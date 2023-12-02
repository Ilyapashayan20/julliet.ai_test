import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // We need to create a response and hand it to the supabase client to be able to modify the response headers.
  const res = NextResponse.next();
  // Create authenticated Supabase Client.
  const supabase = createMiddlewareSupabaseClient({ req, res });

  // Check session
  const {
    data: { session }
  } = await supabase.auth.getSession();

  // // Check auth condition
  if (!session?.user) {
    if (req.nextUrl.pathname === '/') {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/app/docs';
      return NextResponse.redirect(redirectUrl);
    }
    return res;
  }

  if (req.nextUrl.pathname.includes('/app')) {
    // Auth condition not met, redirect to home page.
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: ['/:path*']
};
