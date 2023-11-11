import { IIntegration } from '@/types';
import { SupabaseClient } from '@supabase/supabase-js';

export async function createIntegration({
  supabase,
  payload
}: {
  supabase: SupabaseClient;
  payload: IIntegration;
}) {
  const { data, error } = await supabase
    .from('integrations')
    .insert([payload])
    .select();

  if (error) {
    throw error;
  }

  return data;
}

export async function getIntegrationsByUser({
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
}) {
  console.log('getIntegrationsByUser', userId);
  let qry = supabase
    .from('integrations')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order(sortBy, { ascending })
    .range((page - 1) * pageSize, page * pageSize - 1);

  // if (qry) {
  //   qry = qry.ilike('name', `%${query}%`);
  // }

  const response = await qry;

  console.log('getIntegrationsByUser', response);

  if (response.error) {
    throw response.error;
  }

  const count = response.count ? response.count : 0;
  const hasMore = page * pageSize < count;
  const hasLess = page > 1;

  return {
    integrations: response.data as IIntegration[],
    total: count,
    page,
    pageSize,
    hasMore,
    hasLess
  };
}

export async function deleteIntegration({
  supabase,
  integrationId
}: {
  supabase: SupabaseClient;
  integrationId: string | number;
}) {
  const { data, error } = await supabase
    .from('integrations')
    .delete()
    .match({ id: integrationId });

  if (error) {
    throw error;
  }

  return data;
}

export async function getIntegrationById({
  supabase,
  integrationId
}: {
  supabase: SupabaseClient;
  integrationId: string | number;
}) {
  const { data, error } = await supabase
    .from('integrations')
    .select()
    .eq('id', integrationId);

  if (error) {
    throw error;
  }

  return data[0];
}

export async function updateIntegration({
  supabase,
  payload
}: {
  supabase: SupabaseClient;
  payload: IIntegration;
}) {
  const { data, error } = await supabase
    .from('integrations')
    .update(payload)
    .match({ id: payload.id });

  if (error) {
    throw error;
  }

  return data;
}
