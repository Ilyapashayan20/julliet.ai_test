import { openai } from '@/utils/openai';
import { SupabaseClient } from '@supabase/supabase-js';
import {OpenAI} from 'openai';
import { JullietChatScript } from './constants';
import { createSuggestion } from '@/lib/providers/suggestion';
import { getChatMessagesByUserAndTabId } from './chat';
import { getDocumentById } from './documents';
import {
  DocumentLang,
  DocumentLangIsoToSpanishName,
  DocumentTypeToSpanish,
  Tone,
  ToneToSpanish
} from '@/types';


export const getSuggestionByPrompt = async ({
    supabase,
    documentId,
    prompt,
    stop,
    maxTokens = 256,
    isAccepted = false
  }: {
    supabase: SupabaseClient;
    documentId: string | number;
    prompt: string;
    stop?: string[];
    maxTokens: number;
    isAccepted: boolean;
  }) => {
    const document = await getDocumentById({
      supabase,
      id: documentId as string
    });
  
    if (!document || document.length === 0) {
      throw 'DocumentNotFound';
    }
  
    const { title, lang, tone, user_id, type, context } = document;
  
    const toneEs = ToneToSpanish[tone as Tone];
    const langEs = DocumentLangIsoToSpanishName[lang as DocumentLang];
    const typeEs = DocumentTypeToSpanish[type];
  
    let basePrompt = `Actua como un escritor profesional y ayudame a escribir un ${typeEs} titulado "${title}" en idioma ${langEs} usando un tono ${toneEs}:\n`;
  
    let fullPrompt;
    if (context) {
      fullPrompt = `${context}\n{basePrompt}${prompt}\n`;
    } else {
      fullPrompt = `${basePrompt}${prompt}\n`;
    }
  
    let { id, text, wordsCount } = await getSimpleSuggestion({
      supabase,
      prompt: fullPrompt,
      userId: user_id as string,
      isAccepted,
      documentId: documentId as string,
      stop: stop,
      maxTokens
    });
  
    // remove start empty lines
    text = text.replace(/^\s*\n/gm, '');
  
    return {
      id,
      text,
      wordsCount
    };
  };
  
  export const getChatSuggestionByPrompt = async ({
    supabase,
    userId,
    tabId
  }: {
    supabase: SupabaseClient;
    userId: string;
    tabId: string;
  }) => {
    const generateConversation = (stack: any[]) => {
      const conversation = stack
        .map((item) => {
          return `${item.is_bot ? 'Julliet: ' : 'Hum: '}${item.text}`;
        })
        .join('\n');
  
      console.log('conversation', conversation);
      return conversation;
    };
  
    const { messages } = await getChatMessagesByUserAndTabId({
      supabase,
      userId,
      tabId,
      pageSize: 10
    });
  
    const conversation = generateConversation(messages);
    const cleanPrompt = `${JullietChatScript}\n${conversation}\nJulliet:`.trim();
    console.log('cleanPrompt\n', cleanPrompt);
  
    const callOpenAI = async () => {
      try {
        const response = await openai.completions.create({
          prompt: cleanPrompt,
          model: 'text-davinci-003',
          max_tokens: 3000,
          temperature: 0.5,
          stop: ['Julliet:', 'Hum:']
        });
  
        return { data: response, error: null };
      } catch (error) {
        return { response: null, error };
      }
    };
  
    let { data: aiResponse, error } = await callOpenAI();
    if (error) {
      return {
        text: null,
        wordsCount: null,
        error: error
      };
    }
  
    console.log('aiResponse', aiResponse);
  
    let text = aiResponse?.choices[0].text;
    const wordsCount = text?.split(' ').length;
    const raw_data = aiResponse;
  
    const { error: supabaseError } = await supabase.from('suggestions').insert({
      user_id: userId,
      prompt: cleanPrompt,
      text: text,
      is_accepted: false,
      word_count: wordsCount,
      raw_data: raw_data
    });
  
    if (supabaseError) {
      return { text: null, wordsCount: null, error: supabaseError };
    }
  
    console.log('estamos aqui', text);
  
    text = text?.replace('Julliet:', '');
  
    // if first char is space, remove it
    text = text?.replace(/^ /, '');
    // if first char is a ?, remove it
    text = text?.replace(/^\?/, '');
    // Remove last char if it's dot
    text = text?.replace(/\.$/, '');
  
    return {
      text,
      wordsCount,
      error: null
    };
  };
  
  interface GetSuggestionsByDocumentOptions {
    supabase: SupabaseClient;
    documentId: string;
    pageSize: number;
    page: number;
    query: string;
    ascending: boolean;
    sortBy: string;
  }
  
  export const getSuggestionsByDocument = async ({
    supabase,
    documentId,
    pageSize = 10,
    page = 1,
    sortBy = 'created_at',
    ascending = false,
    query
  }: GetSuggestionsByDocumentOptions) => {
    const response = await supabase
      .from('suggestions')
      .select('*', { count: 'exact' })
      .eq('document_id', documentId)
      .ilike('text', `%${query}%`)
      .order(sortBy, { ascending: ascending })
      .range((page - 1) * pageSize, page * pageSize - 1);
  
    if (response.error) {
      throw response.error;
    }
  
    return response;
  };
  
  export const acceptSuggestion = async ({
    supabase,
    suggestionId
  }: {
    supabase: SupabaseClient;
    suggestionId: string | number;
  }) => {
    const { data, error } = await supabase
      .from('suggestions')
      .update({ is_accepted: true })
      .eq('id', suggestionId);
  
    if (error) {
      throw error;
    }
  
    return data;
  };
  
  export const getAcceptedSuggestionsCountByUser = async ({
    supabase,
    userId
  }: {
    supabase: SupabaseClient;
    userId: string | number;
  }) => {
    const { data, error } = await supabase
      .from('suggestions')
      .select('id, word_count, documents:document_id (user_id)', {
        count: 'exact'
      })
      .eq('is_accepted', true)
      .eq('documents.user_id', userId);
  
    if (error) {
      throw error;
    }
  
    return data;
  };
  
  export interface SimpleSuggestion {
    id: string | number;
    text: string;
    wordsCount: number;
  }
  
  export interface getSimpleSuggestionProps {
    supabase: SupabaseClient;
    prompt: string;
    userId: string | number;
    isAccepted: boolean;
    documentId?: string | number | null;
    stop?: string[];
    maxTokens?: number;
    temperature?: number;
  }
  
  export async function getSimpleSuggestion(
    props: getSimpleSuggestionProps
  ): Promise<SimpleSuggestion> {
    const {
      supabase,
      prompt,
      userId,
      isAccepted,
      documentId,
      stop,
      maxTokens,
      temperature
    } = props;
  
    console.log('GET SIMPLE SUGGESTION');
    console.log(props);
  
    const payload = {
      prompt: prompt,
      model: 'text-davinci-003',
      max_tokens: maxTokens || 1024,
      temperature: temperature || 0.6,
      stop: stop || null
    };
    const  response = await openai.completions.create(payload);

    console.log(response)
  
    const text = response?.choices[0]?.text;
    const wordsCount = text?.split(' ').length;
    const usage = response?.usage;
  
    const suggestion = await createSuggestion({
      supabase,
      payload: {
        prompt: prompt,
        text: text,
        user_id: userId as string,
        word_count: wordsCount,
        is_accepted: isAccepted,
        completion_tokens: usage?.completion_tokens,
        prompt_tokens: usage?.prompt_tokens,
        raw_data: response,
        document_id: documentId
      }
    });
  
    return {
      id: suggestion?.id,
      text,
      wordsCount
    } as SimpleSuggestion;
  }
  
  export const getChatSuggestionByPromptV2 = async ({
    supabase,
    userId,
    tabId
  }: {
    supabase: SupabaseClient;
    userId: string;
    tabId: string;
  }) => {
    // This versions uses the new ChatCompletion from OpenAI
  
    const generateConversation = (
      stack: any[]
    ): OpenAI.Chat.CreateChatCompletionRequestMessage[] => {
      const systemConversation: OpenAI.Chat.CreateChatCompletionRequestMessage[] = [
        {
          role: 'assistant',
          content:
            'actua como un asistente personal y responde todo lo que te pregunten, pero responde con respuestas cortas y simples, en formato markdown'
        }
      ];
  
      const userConversation = stack.map((item) => {
        const role = item.is_bot ? 'assistant' : 'user';
  
        return {
          role,
          content: item.text
        } as OpenAI.Chat.CreateChatCompletionRequestMessage;
      });
  
      return [...systemConversation, ...userConversation];
    };
  
    const { messages } = await getChatMessagesByUserAndTabId({
      supabase,
      userId,
      tabId,
      pageSize: 3
    });
  
    const conversation = generateConversation(messages);
  
    const callOpenAI = async () => {
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: conversation
        });
  
        return { data: response, error: null };
      } catch (error) {
        return { response: null, error };
      }
    };
  
    let  { data: aiResponse, error} = await callOpenAI();
    if (error) {
      return {
        text: null,
        wordsCount: null,
        error: error
      };
    }


  
    console.log('aiResponseddd', aiResponse);
  
    let content = aiResponse?.choices[0]?.message?.content;
    const wordsCount = content?.split(' ').length;
    const raw_data = aiResponse;
  
    console.log('content', content);
  
    const { error: supabaseError } = await supabase.from('suggestions').insert({
      user_id: userId,
      prompt: conversation,
      text: content,
      is_accepted: false,
      word_count: wordsCount,
      raw_data: raw_data
    });
  
    if (supabaseError) {
      return { text: null, wordsCount: null, error: supabaseError };
    }
  
    return {
      text: content,
      wordsCount,
      error: null
    };
  };
  
  type getSimpleSuggestionV2Props = {
    supabase: SupabaseClient;
    prompt: string;
    userId: string;
    documentId?: string;
  };
  
  export async function getSimpleSuggestionV2(
    props: getSimpleSuggestionV2Props
  ): Promise<SimpleSuggestion> {
    const { supabase, prompt, userId, documentId } = props;
  
    console.log('GET SIMPLE SUGGESTION V2');
    console.log(props);
  
    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ] as OpenAI.Chat.CreateChatCompletionRequestMessage[]
    };
  
    try {
      const response = await openai.chat.completions.create(payload);
  
      if (!response) {
        throw new Error('No completion');
      }

  
      const text = response?.choices[0]?.message?.content;
      const wordsCount = text?.split(' ').length;
      const raw_data = response;
      console.log(" its from  getSimpleSuggestionV2 " ,text)

  
      const suggestion = await createSuggestion({
        supabase,
        payload: {
          prompt: prompt,
          text: text || undefined,
          user_id: userId,
          word_count: wordsCount,
          is_accepted: false,
          raw_data: raw_data,
          document_id: documentId
        }
      });
  
      return {
        id: suggestion?.id,
        text,
        wordsCount
      } as SimpleSuggestion;
    } catch (error) {
      throw error;
    }
  }
  
  export const getChatSuggestionByPayload = async ({
    supabase,
    userId,
    payload
  }: {
    supabase: SupabaseClient;
    userId: string;
    payload: OpenAI.Chat.CreateChatCompletionRequestMessage[];
  }) => {
    console.log('GET SUGGESTION BY PAYLOAD V1');
  
    try {
      const  response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo-16k',
        messages: payload
      });
  
      if (!response) {
        throw new Error('No completion');
      }
  
      const text = response?.choices[0]?.message?.content;
      const wordsCount = text?.split(' ').length;
      const raw_data = response;
  
      const suggestion = await createSuggestion({
        supabase,
        payload: {
          prompt: payload.map((item) => item.content).join('\n'),
          text: text || undefined,
          user_id: userId,
          word_count: wordsCount,
          is_accepted: true,
          raw_data: raw_data
        }
      });
  
      return {
        id: suggestion?.id,
        text,
        wordsCount
      } as SimpleSuggestion;
    } catch (error) {
      throw error;
    }
  };