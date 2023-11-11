import '@/styles/retroica-font.css';
import {Chakra} from '@/lib/utils/Chakra';
import '@/styles/tailwind.css';
import {useEffect, useState} from 'react';
import {Analytics} from '@vercel/analytics/react';
import React from 'react';
import NextNProgress from 'nextjs-progressbar';

import {SessionContextProvider, useUser} from '@supabase/auth-helpers-react';
import {createBrowserSupabaseClient} from '@supabase/auth-helpers-nextjs';
import {AppProps} from 'next/app';
import type {Database} from 'types_db';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import '@fontsource/inter/variable.css';
import TagManager from 'react-gtm-module';
import {MyUserContextProvider} from '@/lib/utils/useUser';
import {useRouter} from 'next/router';

interface AppWithDehydratedState extends AppProps {
  pageProps: {
    dehydratedState: any;
    cookies: string;
  };
}

const tagManagerArgs = {
  gtmId: 'GTM-P29PW8Q'
};

export default function MyApp({
  Component,
  pageProps
}: AppWithDehydratedState) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );

  const router = useRouter();


  useEffect(() => {
    supabaseClient.auth.getUser().then((response) => {
      const user = response?.data.user
      const isInsideApp = router.pathname.startsWith('/app')
      // profitwell script to retain
      // @ts-ignore
      if (window.dataLayer) {
        if (!user && !isInsideApp) {
          // @ts-ignore
          dataLayer.push({'event': 'start_pw'})
          console.log('start_pw')
        }

        if (user && !isInsideApp) {
          // @ts-ignore
          dataLayer.push({'event': 'start_pw', 'pw_user_email': user?.email})
          console.log('pw_user_email', user?.email)
        }
      }
    })
  }, [supabaseClient])

  useEffect(() => {
    document.body.classList?.remove('loading');
    if (process.env.NODE_ENV === 'production') {
      TagManager.initialize(tagManagerArgs);
    }

    //wait for 2 seconds before showing the app
    // setTimeout(() => {
    //   if (!!window && user) {
    //     fetch('/api/users/me')
    //       .then((res) => res.json())
    //       .then((data) => {
    //         if (!data?.user) {
    //           if (window.Intercom) {
    //             window.Intercom('boot', {
    //               api_base: 'https://api.intercom.io',
    //               app_id: 'bzhtms7v',
    //               user_id: data.user.id,
    //               email: data.user.email,
    //               user_hash: data.intercomHash
    //             });
    //           }
    //         }
    //       });
    //   }
    // }, 1000);
  }, []);

  const queryClient = new QueryClient();

  return (
    <>
      <Chakra cookies={pageProps.cookies}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <SessionContextProvider supabaseClient={supabaseClient}>
              <MyUserContextProvider>
                <NextNProgress color="#d10085" />
                {/* @ts-ignore */}
                <Component {...pageProps} />
                <Analytics />
                {/* <ReactQueryDevtools /> */}
              </MyUserContextProvider>
            </SessionContextProvider>
          </Hydrate>
        </QueryClientProvider>
      </Chakra>
    </>
  );
}
