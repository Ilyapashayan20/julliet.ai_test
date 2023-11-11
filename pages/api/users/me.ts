import { NextApiRequest, NextApiResponse } from 'next';
import { withTokenAuth } from '@/lib/utils/decorators';
import { SupabaseClient } from '@supabase/supabase-js';
import crypto from 'crypto';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: SupabaseClient,
  user: any
) {
  const secret = process.env.INTERCOM_SECRET;
  const hmac = crypto.createHmac('sha256', secret as string);
  hmac.update(user.id);
  const intercomHash = hmac.digest('hex');

  const {
    data: { session: session }
  } = await supabase.auth.getSession();

  res.status(200).json({ intercomHash, ...session });
}

export default withTokenAuth(handler);
