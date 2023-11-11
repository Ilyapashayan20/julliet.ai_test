import { SupabaseClient } from '@supabase/supabase-js';

export async function updateDocumentData({
  supabase,
  documentId,
  data,
  word_count
}: {
  supabase: SupabaseClient;
  documentId: string | number;
  data: any;
  word_count: number;
}) {
  return await supabase
    .from('documents')
    .update({ data, word_count })
    .eq('id', documentId);
}
