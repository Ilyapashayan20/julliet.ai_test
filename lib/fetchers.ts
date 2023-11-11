
import { resolve } from 'dns';
import OpenAI from 'openai';
import { SimpleSuggestion } from './services/suggestion';
import { withExponentialBackoff } from '@/lib/utils/promises';

export async function fetchSimpleSuggestion({
  prompt,
  isAccepted,
  stopSequences = null,
  maxTokens = 1000,
  temperature = 0.6
}: {
  prompt: string;
  isAccepted: boolean;
  stopSequences?: string[] | null;
  maxTokens?: number;
  temperature?: number;
}): Promise<SimpleSuggestion> {
  const response = await fetch(`/api/suggestions/v101/new`, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt,
      isAccepted,
      stopSequences,
      maxTokens,
      temperature
    })
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

export async function fetchChatResponse({
  tabId
}: {
  tabId: string;
}): Promise<SimpleSuggestion> {
  const response = await withExponentialBackoff(
    () =>
      fetch(`/api/chat`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tabId })
      }),
    5,
    1000
  );

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

export async function fetchRewrite({ prompt }: { prompt: string }) {
  const rewritePrompt = `reescribe este texto: "${prompt}"`;
  return fetchSimpleSuggestion({ prompt: rewritePrompt, isAccepted: true });
}

export async function fetchRewriteSelection({
  text,
  selection,
  context
}: {
  text: string;
  selection: string;
  context: string;
}) {
  const index = text.indexOf(selection);
  // add quotes to the selection
  const withBrackets = `${text.slice(0, index)}[[${selection}]]${text.slice(
    index + selection.length
  )}`;

  const prompt =
    `reescribe:EstoNoSeReescribe[[EstoSi]]\nrespuesta:EstoNoSeReescribeEstoSiCambio\nContexto:${context}\n${withBrackets}\nrewrite the quotes part of the text:\n`.trim();

  return fetchSimpleSuggestion({ prompt: prompt, isAccepted: true });
}

export async function fetchDocumentSuggestions({
  documentId,
  prompt
}: {
  documentId: string;
  prompt: string;
}) {
  const response = await fetch(`/api/documents/${documentId}/suggestions`, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt })
  });

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchNewsletterSubscribe({ email }: { email: string }) {
  const response = await fetch(`/api/newsletter/subscribe`, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchSendMessage({
  channel,
  text,
  blocks
}: {
  channel: string;
  text: string;
  blocks?: any;
}) {
  const response = await fetch(`/api/notifications/slack`, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ channel, text, blocks })
  });

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchSimpleSuggestionByPayload({
  payload
}: {
  payload: OpenAI.Chat.CreateChatCompletionRequestMessage[];
}): Promise<SimpleSuggestion> {
  try {
    const response = await fetch(`/api/suggestions/v101/chat`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json();
  } catch (error) {
    return Promise.reject(error);
  }
}
