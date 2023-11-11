import { SupabaseClient } from '@supabase/supabase-js';
import { IChatMessage } from '../../types';

export async function getUserChatTabsIds({
  supabase,
  userId,
  search = null
}: {
  supabase: SupabaseClient;
  userId: string;
  search?: string | null;
}): Promise<string[]> {
  const params: { user_id: string; search?: string } = {
    user_id: userId
  };

  if (search) {
    params['search'] = search;
  }

  const { data, error } = await supabase.rpc(
    'get_user_chat_messages_tab_ids',
    params
  );

  if (error) {
    throw error;
  }

  return data.filter((id: number) => id !== null);
}

export const getChatMessagesByUserAndTabId = async ({
  supabase,
  userId,
  tabId,
  query,
  pageSize = 5,
  page = 1,
  sortBy = 'created_at',
  ascending = false
}: {
  supabase: SupabaseClient;
  userId: string;
  tabId: string;
  query?: string;
  pageSize?: number;
  page?: number;
  sortBy?: string;
  ascending?: boolean;
}) => {
  let qry = supabase
    .from('chat_messages')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .eq('tab_id', tabId)
    .order(sortBy, { ascending: ascending })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (query) {
    qry = qry.ilike('text', `%${query}%`);
  }

  const response = await qry;

  if (response.error) {
    throw response.error;
  }

  const count = response.count ? response.count : 0;
  const hasMore = page * pageSize < count;
  const hasLess = page > 1;

  return {
    messages: response.data.reverse() as IChatMessage[],
    total: count,
    page,
    pageSize,
    hasMore,
    hasLess
  };
};

export const createChatMessage = async ({
  supabase,
  payload
}: {
  supabase: SupabaseClient;
  payload: IChatMessage;
}) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert(payload)
    .select();

  if (error) {
    throw error;
  }

  console.log('data', data);

  return data[0];
};

export async function deleteChatMessagesByTabId({
  supabase,
  userId,
  tabId
}: {
  supabase: SupabaseClient;
  userId: string;
  tabId: string;
}) {
  return supabase
    .from('chat_messages')
    .delete()
    .eq('user_id', userId)
    .eq('tab_id', tabId);
}
