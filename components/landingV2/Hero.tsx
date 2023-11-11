import {useEffect, useState} from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselIconButton,
  CarouselSlide,
  useCarousel
} from '@/components/ui/SimpleCarousel';

import {
  useColorModeValue as mode,
  Box,
  Text,
  Center,
  Heading,
  VStack,
  HStack,
  Icon,
  Avatar,
  Circle,
  VisuallyHidden,
  useBreakpointValue
} from '@chakra-ui/react';
import CTAButton from './CTAButton';
import {MdHelp, MdStar} from 'react-icons/md';
import {FaPlay} from 'react-icons/fa';
import JullietHarry from '@/images/screenshots/Browser/Chrome/Light.png';
import {
  ChatMonkey,
  Finnik,
  Lighthouse,
  Plumtic,
  Wakanda,
  WorkScout
} from './Logos';
import {IoChevronBackOutline, IoChevronForwardOutline} from 'react-icons/io5';
import {useLandingStore} from '@/lib/store';
import NextAvatar from '../ui/NextAvatar';

const Hero = ({bgColor, color}: any) => {
  const store = useLandingStore();

  const captions = [
    'artículos de blog',
    'artículos académicos',
    'correos electrónicos'
    // 'descripciones de productos',
    // 'twitter posts',
    // 'twitter threads',
    // 'linkedin posts',
  ];

  const [caption, setCaption] = useState(captions[0]);
  const [index, setIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const index = captions.indexOf(caption);
      const nextIndex = index + 1 === captions.length ? 0 : index + 1;
      setCaption(captions[nextIndex]);
    }, 3000);
    return () => clearInterval(interval);
  }, [caption]);

  const marks = [ChatMonkey, Wakanda, Lighthouse, Plumtic, WorkScout, Finnik];

  const slidesPerView = useBreakpointValue({base: 3, md: 5});

  const [ref, slider] = useCarousel({
    slides: {
      perView: slidesPerView,
      spacing: useBreakpointValue({base: 16, md: 24})
    },
    slideChanged: (slider) => setCurrentSlide(slider.track.details.rel)
  });

  return (
    <Box>
      <Box as="section" bg={bgColor} color={color} pt={{base: '10', md: '0'}}>
        <Box
          maxW={{base: 'xl', md: '5xl'}}
          mx="auto"
          px={{base: '6', md: '8'}}
        >
          <Box textAlign="center">
            <Center>
              <Text
                fontSize={{base: '0.70rem', md: 'sm'}}
                bgColor={mode('brand.400', 'brand.400')}
                fontWeight="extrabold"
                // border="1px solid white"
                w={{base: 'auto', md: 'auto'}}
                rounded="full"
                mb={4}
                color={mode('white', 'white')}
                px={4}
                py={2}
                boxShadow="lg"
              >
                ‟Mejor asistente para escribir” ⭐️⭐️⭐️⭐️⭐️
              </Text>
            </Center>
            <Heading
              as="h1"
              size={{base: 'lg', md: '2xl'}}
              fontWeight="extrabold"
              maxW={{base: 'xl', md: '5xl'}}
              mx="auto"
              lineHeight="1.2"
              letterSpacing="tight"
            >
              No pierdas tiempo tiempo redactando
              <br />
              <Text
                bgClip="text"
                bgGradient="linear(to-r, brand.400, primary.700, brand.300)"
                as="span"
                filter="drop-shadow(0px 0px 20px var(--chakra-colors-brand-600))"
              >
                {caption}
              </Text>
              <br />
            </Heading>
            <Text
              fontSize={{base: 'md', md: 'xl'}}
              mt="4"
              maxW="xl"
              mx="auto"
              color={mode('gray.300', 'gray.300')}
              fontWeight="medium"
            >
              El arma secreta de los profesionales ocupados
              que quieren escribir más contenido de calidad en menos tiempo,
              sin tener que contratar a un escritor.
            </Text>
          </Box>

          <VStack
            justify="center"
            direction={{base: 'column', md: 'row'}}
            mt="10"
            mb="20"
            spacing="5"
          >
            <CTAButton>Comienza gratis →</CTAButton>
            <HStack spacing="2">
              <Icon
                as={MdHelp}
                w={4}
                h={4}
                bgColor={bgColor}
                color={color}
                title="La capa gratuita te permite generar 2000 palabras por mes gratis"
                mb="0.4"
              />
              <Text fontSize="0.8rem" mt="2" color="gray.300">
                No se requiere tarjeta de crédito
              </Text>
            </HStack>
            <HStack spacing="3">
              <HStack spacing="-3">
                {[
                  'https://i.pravatar.cc/100?img=3',
                  'https://i.pravatar.cc/100?img=4',
                  'https://i.pravatar.cc/100?img=5',
                  'https://i.pravatar.cc/100?img=6',
                  'https://i.pravatar.cc/100?img=7',
                  'https://i.pravatar.cc/100?img=8',
                  'https://i.pravatar.cc/100?img=9',
                  'https://i.pravatar.cc/100?img=10',
                ].map((item) => (
                  <NextAvatar
                    key={item}
                    name={item}
                    src={item}
                    w={9}
                  />
                ))}
              </HStack>
              <Box m="4">
                <HStack spacing="0">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Icon
                      key={item}
                      as={MdStar}
                      w={4}
                      h={4}
                      color="yellow.400"
                    />
                  ))}
                </HStack>
                <Text fontSize="0.8rem" mt="2" color="gray.500" textAlign="center">
                  4.9/5
                </Text>
              </Box>
            </HStack>
            <Text fontSize="md" color="gray.300" fontWeight="medium">
              Unete a los mas de
              <Text as="span" color="brand.400" mx="1" fontWeight="bold">15000+</Text>
              profesionales y marcas que usan Julliet
            </Text>
          </VStack>

          <Box
            id="#screenshot"
            className="group"
            cursor="pointer"
            position="relative"
            rounded="lg"
            overflow="hidden"
            mt={-4}
            bg="white"
            onClick={() => {
              store.onModalOpen();
            }}
            shadow={mode('brand-400', 'whiteAlpha-300')}
          >
            <Image alt="Julliet.ai Screenshot" src={JullietHarry} />
            <Circle
              size="20"
              as="button"
              bg="white"
              shadow="lg"
              color="purple.600"
              position="absolute"
              top="50%"
              left="50%"
              transform="translate3d(-50%, -50%, 0)"
              fontSize="xl"
              transition="all 0.2s"
              _groupHover={{
                transform: 'translate3d(-50%, -50%, 0) scale(1.05)'
              }}
            >
              <VisuallyHidden>Play demo video</VisuallyHidden>
              <FaPlay />
            </Circle>
          </Box>
        </Box>
      </Box>

      <Box as="section" py="24" bgColor={bgColor} color={color}>
        <Box
          maxW={{base: 'xl', md: '7xl'}}
          mx="auto"
          px={{base: '6', md: '8'}}
        >
          <Text
            fontWeight="bold"
            fontSize="sm"
            textAlign="center"
            textTransform="uppercase"
            letterSpacing="wide"
            color={color}
          >
            Utilizado por más de 200 clientes
          </Text>
          <HStack spacing="2" pt={8}>
            <CarouselIconButton
              onClick={() => slider.current?.prev()}
              icon={<IoChevronBackOutline />}
              aria-label="Previous slide"
              disabled={currentSlide === 0}
            />
            <Carousel ref={ref} direction="row" width="full">
              {marks.map((mark, i) => (
                <CarouselSlide
                  key={i}
                  onClick={() => setIndex(i)}
                  cursor="pointer"
                >
                  <Icon
                    as={mark}
                    w={{base: 70, md: 140}}
                    h="auto"
                    color={color}
                  />
                </CarouselSlide>
              ))}
            </Carousel>
            <CarouselIconButton
              onClick={() => slider.current?.next()}
              icon={<IoChevronForwardOutline />}
              aria-label="Next slide"
              disabled={currentSlide + Number(slidesPerView) === marks.length}
            />
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Hero;
