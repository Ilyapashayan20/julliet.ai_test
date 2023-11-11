import Image from 'next/image';

import { Button } from '@/components/ui/Button';
import { Container } from '@/components/landing/Container';
import heroImage from '@/images/landing/hero-image.png';
import backgroundImage from '@/images/background-faqs.jpg';
import { useState, useEffect } from 'react';

const captions = [
  'artículos de blog',
  'twitter tweets',
  'linkedin posts',
  'instagram posts',
  'emails',
  'descripciones de productos',
  'documentos'
];

export function Hero() {
  const [heroTitleCaption, setHeroTitleCaption] = useState(captions[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const index = captions.indexOf(heroTitleCaption);
      const nextIndex = index + 1 === captions.length ? 0 : index + 1;
      setHeroTitleCaption(captions[nextIndex]);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroTitleCaption]);

  return (
    <Container className="relative mb-12 lg:mb-0 lg:py-32 columns-lg">
      {/* <Image */}
      {/*   className="absolute top-40 left-1/2 max-w-none translate-x-[-30%] -translate-y-1/4 z-[-999] hidden lg:block" */}
      {/*   src={backgroundImage} */}
      {/*   alt="" */}
      {/*   width={1558} */}
      {/*   height={946} */}
      {/*   loading="eager" */}
      {/*   overflow="hidden" */}
      {/* /> */}
      <div className="hero__content">
        <h1 className="max-w-4xl mx-auto text-3xl font-medium tracking-tight text-left lg:text-5xl text-smoky-black font-display">
          Escribe increíbles
          <br />
          <span className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-bittersweet">
            {heroTitleCaption}
          </span>{' '}
          en segundos en vez de horas
        </h1>
        <p className="max-w-xl mx-auto mt-6 ml-1 text-lg tracking-tight text-left text-slate-700">
          Julliet escribe y publica{' '}
          <span className="text-violet-600">{heroTitleCaption}</span> en
          segundos usando IA. No pierdas más tiempo escribiendo, deja que
          Julliet lo haga por ti.
        </p>
        <div className="flex mt-10 gap-x-6">
          <Button
            href="/login"
            className="text-lg font-semibold text-white bg-gradient-to-br from-violet-600 to-bittersweet animate-border bg-[length:400%_400%]"
          >
            Regístrate gratis
          </Button>
          {/* <Button */}
          {/*   // href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" */}
          {/*   variant="outline" */}
          {/* > */}
          {/*   <svg */}
          {/*     aria-hidden="true" */}
          {/*     className="flex-none w-3 h-3 fill-blue-600 group-active:fill-current" */}
          {/*   > */}
          {/*     <path d="m9.997 6.91-7.583 3.447A1 1 0 0 1 1 9.447V2.553a1 1 0 0 1 1.414-.91L9.997 5.09c.782.355.782 1.465 0 1.82Z" /> */}
          {/*   </svg> */}
          {/*   <span className="ml-3 font-semibold">Mira el video</span> */}
          {/* </Button> */}
        </div>
      </div>
      <div className="w-[130%] pr-10">
        <Image
          className="relative hidden lg:block"
          src={heroImage}
          alt="Inteligencia artificial"
          width={1480}
          height={860}
          quality={50}
          priority
        />
      </div>
    </Container>
  );
}
