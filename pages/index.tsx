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
import {useRouter} from 'next/router';
import {useUser} from '@/lib/utils/useUser';

export default function NewHome() {
  const colorMode = 'dark';
  const bgColor = useColorModeValue('gray.900', 'gray.900');
  const color = useColorModeValue('white', 'white');
  const {userDetail} = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (userDetail) {
      console.log('userDetail', userDetail);
      if (userDetail.is_onboarded) {
        router.push('/app/docs');
      } else {
        router.push('/app/onboarding');
      }
    }
  }, [userDetail]);

  return (
    <Box overflowX="hidden">
      <NextSeo
        title="Julliet | Asistente de redacción para profesionales ocupados"
        description="Julliet es un asistente de redacción para profesionales ocupados. Escribimos artículos, correos electrónicos, informes, etc. para que puedas concentrarte en lo que realmente importa."
        canonical="https://www.julliet.ai"
        openGraph={{
          url: 'https://www.julliet.ai',
          title: 'Julliet | Asistente de redacción para profesionales ocupados',
          description:
            'Julliet es un asistente de redacción para profesionales ocupados. Escribimos artículos, correos electrónicos, informes, etc. para que puedas concentrarte en lo que realmente importa.',
          images: [
            {
              url: 'https://www.julliet.ai/og.png',
              width: 1200,
              height: 630,
              alt: 'Julliet | Asistente de redacción para profesionales ocupados'
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
