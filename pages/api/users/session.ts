import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const auth = req.headers.authorization;
  console.log('auth', auth);

  const supabase = createServerSupabaseClient({ req, res });

  let {
    data: { session: session },
    error
  } = await supabase.auth.getSession();

  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!session)
    return res.status(401).json({
      error: 'not_authenticated',
      description:
        'The user does not have an active session or is not authenticated'
    });

  return res.status(200).json(session);
};

export default handler;
