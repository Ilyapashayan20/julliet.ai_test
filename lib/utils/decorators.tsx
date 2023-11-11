import { NextApiRequest, NextApiResponse } from 'next';
import {
  createServerSupabaseClient,
  SupabaseClient
} from '@supabase/auth-helpers-nextjs';

export function withTokenAuth(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createServerSupabaseClient({ req, res }) as SupabaseClient;

    const auth = req.headers.authorization;
    if (auth) {
      console.log('Trying to authenticate with token');
      const {
        data: { user }
      } = await supabase.auth.getUser(auth);
      console.log('user', user);
      return handler(req, res, supabase, user);
    }

    // try to get user by session
    const {
      data: { session: session },
      error
    } = await supabase.auth.getSession();
    if (session?.user) {
      return handler(req, res, supabase, session?.user);
    }

    // no user found
    res.status(401).json({ error: 'Not authenticated' });
  };
}
