import { withTokenAuth } from '@/lib/utils/decorators';
import { getSimpleSuggestion } from '@/lib/services/suggestion';
import { NextApiRequest, NextApiResponse } from 'next';
import { SupabaseClient } from '@supabase/supabase-js';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: SupabaseClient,
  user: any
) {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const { prompt, isAccepted, stopSequences, maxTokens, temperature } =
    req.body;

  const suggestion = await getSimpleSuggestion({
    supabase: supabase,
    prompt: prompt,
    userId: user.id,
    isAccepted: isAccepted,
    stop: stopSequences,
    maxTokens: maxTokens,
    temperature: temperature
  });

  res.status(200).json(suggestion);
}

export default withTokenAuth(handler);
