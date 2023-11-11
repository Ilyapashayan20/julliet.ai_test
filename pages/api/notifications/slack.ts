import { NextApiRequest, NextApiResponse } from 'next';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { withTokenAuth } from '@/lib/utils/decorators';
import { sendMessage } from '@/lib/services/slack';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: SupabaseClient,
  user: any
) => {
  const { channel, text } = req.body;

  await sendMessage({
    channel: channel,
    text: text
  });

  res.status(200).json({ message: 'Message sent' });
};

export default withTokenAuth(handler);
