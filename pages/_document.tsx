import { Html, Head, Main, NextScript } from 'next/document';
import { PageMeta } from '../types';
import { ReactNode } from 'react';
import { ColorModeScript } from '@chakra-ui/react';
import { theme } from '@/components/app/theme';
import { FlashlessScript } from 'chakra-ui-flashless';

interface Props {
  children: ReactNode;
  meta?: PageMeta;
}

export default function Document({ children, meta: pageMeta }: Props) {
  return (
    <Html
      className="h-full scroll-smooth bg-slate-50 antialiased [font-feature-settings:'ss01']"
      lang="en"
    >
      <Head>
         <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){
                  w[l]=w[l]||[];
                  w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
                  var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                  j.async=true;
                  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                  f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-N55XDVM9');
              `,
            }}
          />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </Head>
      <body className="flex flex-col h-full loading">
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript /> 
        <noscript dangerouslySetInnerHTML={
          {
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N55XDVM9"
            height="0" width="0" style="display:none;visibility:hidden" />`
          }
        } />
      </body>
    </Html>
  );
}
