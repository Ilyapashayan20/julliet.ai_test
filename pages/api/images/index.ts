import { NextApiRequest, NextApiResponse } from 'next';
import { getImageFromPrompt } from '@/lib/services/images';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: SupabaseClient,
  user: any
) => {
  const prompt = req.query.prompt as string;
  const num_outputs = req.query.num_outputs as string;

  const data = await getImageFromPrompt({
    prompt,
    num_outputs: parseInt(num_outputs)
  });

  res.status(200).json(data);
};

export default handler;
