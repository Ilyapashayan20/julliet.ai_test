import {Box} from '@chakra-ui/react';

import {useColorModeValue} from '@chakra-ui/react';
import * as React from 'react';
import Head from 'next/head';
import NavBar from '@/components/landingV2/NavBar';
import Hero from '@/components/landingV2/Hero';
import ShortCTA from '@/components/landingV2/ShortCTA';
import Pricing from '@/components/landingV2/Pricing';
import BigCTA from '@/components/landingV2/BigCTA';
import Footer from '@/components/landingV2/Footer';
import Features from '@/components/landingV2/Features';
import VideoModal from '@/components/landingV2/VideoModal';
import {NextSeo} from 'next-seo';

export default function NewHome() {
  const colorMode = 'dark';
  const bgColor = useColorModeValue('gray.900', 'gray.900');
  const color = useColorModeValue('white', 'white');

  return (
    <Box overflowX="hidden">
      <NextSeo
        title="Julliet Empresas | SEO Content Marketing automatizado"
        description="Julliet Empresas es una plataforma de SEO Content Marketing automatizado que te ayuda a crear contenido de calidad para tu blog o sitio web."
        canonical="https://www.julliet.ai"
        openGraph={{
          url: 'https://www.julliet.ai',
          title: 'Julliet Empresas | SEO Content Marketing automatizado',
          description:
            'Julliet Empresas es una plataforma de SEO Content Marketing automatizado que te ayuda a crear contenido de calidad para tu blog o sitio web.',
          images: [
            {
              url: 'https://www.julliet.ai/og.png',
              width: 1200,
              height: 630,
              alt: 'Julliet | SEO Content Marketing automatizado',
            }
          ],
          site_name: 'Julliet'
        }}
        twitter={{
          handle: '@jullietAI',
          site: '@jullietAI',
          cardType: 'summary_large_image'
        }}
      />
      <NavBar bgColor={bgColor} color={color} colorMode={colorMode} />
      <Hero bgColor={bgColor} color={color} colorMode={colorMode} />
      <ShortCTA bgColor={bgColor} color={color} colorMode={colorMode} />
      <Features bgColor={bgColor} color={color} colorMode={colorMode} />
      <Pricing bgColor={bgColor} color={color} colorMode={colorMode} />
      <BigCTA bgColor={bgColor} color={color} colorMode={colorMode} />
      <Footer bgColor={bgColor} color={color} colorMode={colorMode} />
      <VideoModal />
    </Box>
  );
}
