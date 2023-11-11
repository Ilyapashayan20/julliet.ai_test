import wpapi from 'wpapi';
import {SupabaseClient} from '@supabase/supabase-js';
import {DocumentLang, IDocument} from '@/types';
import {getDataAsHtml, getWordCount} from '@/lib/utils/slate';
import {Descendant} from 'slate';
import {getIntegrationById} from './integrations';
import {generate as generateBlogPost} from '../generators/blogPostGenerator';
import {generate as generateEssay} from '../generators/essayGenerator';
import {generate as generateBlogOutline} from '../generators/blogPostOutline';
import {generate as generateEmail} from '../generators/email';
import {generate as generateFanfiction} from '../generators/fanfiction';
import {updateDocumentData} from '../providers/document';

export const getDocumentsByUser = async ({
    supabase,
    userId,
    query,
    pageSize = 5,
    page = 1,
    sortBy = 'created_at',
    ascending = false
}: {
    supabase: SupabaseClient;
    userId: string;
    query?: string;
    pageSize?: number;
    page?: number;
    sortBy?: string;
    ascending?: boolean;
}) => {
    let qry = supabase
        .from('documents')
        .select('*', {count: 'exact'})
        .eq('user_id', userId)
        .order(sortBy, {ascending: ascending})
        .range((page - 1) * pageSize, page * pageSize - 1);

    if (query) {
        qry = qry.ilike('title', `%${query}%`);
    }

    const response = await qry;

    if (response.error) {
        throw response.error;
    }

    const count = response.count ? response.count : 0;
    const hasMore = page * pageSize < count;
    const hasLess = page > 1;

    return {
        documents: response.data as IDocument[],
        total: count,
        page,
        pageSize,
        hasMore,
        hasLess
    };
};

export const getDocumentById = async ({
    supabase,
    id
}: {
    supabase: SupabaseClient;
    id: string;
}) => {
    const response = await supabase.from('documents').select('*').eq('id', id);

    if (response.error) {
        throw response.error;
    }

    if (response.data.length === 0) {
        throw 'DocumentNotFound';
    }

    return response.data[0];
};

export const createDocument = async ({
    supabase,
    user_id,
    document
}: {
    supabase: SupabaseClient;
    user_id: string;
    document: IDocument;
}) => {
    const {data, error} = await supabase
        .from('documents')
        .insert({
            ...document,
            user_id
        })
        .select();

    console.log(data, error);
    const [doc] = data as IDocument[];

    console.log('document created');
    console.log(doc);

    if (error) {
        throw error;
    }

    return data;
};

export const saveDocument = async ({
    supabase,
    documentId,
    data
}: {
    supabase: SupabaseClient;
    documentId: string | number;
    data: Descendant[];
}) => {
    let toUpdate: any = {
        data,
        updated_at: new Date(),
        word_count: getWordCount(data)
    };

    const response = await supabase
        .from('documents')
        .update(toUpdate)
        .eq('id', documentId);

    if (response.error) {
        throw response.error;
    }

    return response;
};

export const updateDocumentTitle = async ({
    supabase,
    documentId,
    title
}: {
    supabase: SupabaseClient;
    documentId: string | number;
    title: string;
}) => {
    const response = await supabase
        .from('documents')
        .update({title})
        .eq('id', documentId);

    if (response.error) {
        throw response.error;
    }
    return response;
};

export const deleteDocument = async ({
    supabase,
    documentId
}: {
    supabase: SupabaseClient;
    documentId: string | number;
}) => {
    const response = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

    if (response.error) {
        throw response.error;
    }
    return response;
};

export async function publishDocument({
    supabase,
    documentId,
    integrationId,
    status = 'publish',
    publishDate = new Date()
}: {
    supabase: SupabaseClient;
    documentId: string | number;
    integrationId: string | number;
    status?: 'publish' | 'draft' | 'private' | 'pending' | 'future';
    publishDate?: Date;
}) {
    const document = await getDocumentById({
        supabase,
        id: documentId as string
    });

    const integration = await getIntegrationById({
        supabase,
        integrationId
    });

    const wp = new wpapi({
        endpoint: integration.host,
        username: integration.username,
        password: integration.password
    });

    const html = getDataAsHtml(document.data);
    const payload = {
        title: document.title,
        content: html,
        status: status,
        date: publishDate ? publishDate.toISOString() : undefined
    };

    return await wp.posts().create(payload);
}

const getGenerator = (type: string) => {
    switch (type) {
        case 'essay':
            return generateEssay;
        case 'blog':
            return generateBlogPost;
        case 'blog_outline':
            return generateBlogOutline;
        case 'email':
            return generateEmail;
        case 'fanfiction':
            return generateFanfiction;
        default:
            return generateBlogOutline;
    }
};

export async function generateDocumentContent({
    doc,
    supabase
}: {
    doc: IDocument;
    supabase: SupabaseClient;
}) {
    const generator = getGenerator(doc.type);
    const result = await generator({
        title: doc.title,
        tone: doc.tone,
        lang: doc.lang as DocumentLang
    });

    const {slateData, wordsCount} = result;
    console.log('generated content');
    console.log(slateData);
    console.log(wordsCount);

    await updateDocumentData({
        supabase,
        documentId: doc.id as number,
        data: slateData,
        word_count: wordsCount
    });

    return {id: doc.id};
}
