import { ISuggestion } from '@/types';
import { SupabaseClient } from '@supabase/supabase-js';

export async function createSuggestion({
  supabase,
  payload
}: {
  supabase: SupabaseClient;
  payload: ISuggestion;
}) {
  const { data, error } = await supabase
    .from('suggestions')
    .insert(payload)
    .select();

  if (error) {
    throw error;
  }

  return data[0];
}
