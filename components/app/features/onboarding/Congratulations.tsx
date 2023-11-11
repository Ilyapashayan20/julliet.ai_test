import {Box, Center, useBreakpointValue, useMediaQuery} from "@chakra-ui/react"
import OnboardCongratulations from "@/images/onboarding/onboarding-congratulations.png"
import NextImage from "next/image"
import party from 'party-js';
import {useEffect} from "react";

function Congratulations({containerRef}: any) {
  const isDesktop = useBreakpointValue({base: false, lg: true});

  useEffect(() => {
    if (containerRef.current) {
      party.confetti(containerRef.current, {
        count: party.variation.range(50, 100),
        speed: party.variation.range(40, 400),
      });
    }
  }, [containerRef])

  return (
    < Center w="full" alignItems="flex-start" mt={-12} h="100%">
      <NextImage
        src={OnboardCongratulations}
        alt="Congratulations"
        width={1400}
        height={1444}
        style={{margin: '0 auto', padding: '0 0rem'}}
      />
    </Center>
  )
}

export default Congratulations;
