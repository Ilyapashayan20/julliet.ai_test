import RoleSelection from "@/components/app/features/onboarding/RoleSelection";
import {useStep} from "@/components/ui/Step/useStep";
import {useReducer, useRef} from "react";
import {ButtonGroup, Button, Container, Slide, Text, Box, VStack, HStack, Flex, Heading, useColorMode} from "@chakra-ui/react";
import {Step} from "@/components/ui/Step";
import {MdArrowForward, MdArrowBack} from "react-icons/md";
import {NextSeo} from "next-seo";
import WhereHeFoundUs from "@/components/app/features/onboarding/WhereHeFoundUs";
import Bot3dHi5 from '@/images/ilustrations/bot-3d-hi5.png';
import Bot3dHandsUp from '@/images/ilustrations/bot-3d-hands-up.png';
import Bot3d from '@/images/ilustrations/bot-3d.png';
import NextImage from "next/image";
import {useRouter} from "next/router";
import Congratulations from "@/components/app/features/onboarding/Congratulations";
import {jullietGradient} from "@/lib/utils/gradient";
import {useSaveUserOnboarding} from "@/lib/hooks";
import {useUser} from "@/lib/utils/useUser";
import {saveUserOnboardingPayload} from "@/lib/services/users";

const initialState = {
  role: '',
  howHeFoundUs: '',
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'add':
      return {...state, [action.name]: action.value};
    default:
      return state;
  }
};

function Welcome() {
  const numberOfSteps = 3;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentStep, {setStep}]: [number, any] = useStep({
    maxStep: numberOfSteps,
    initialStep: 0
  });
  const router = useRouter();
  const {colorMode} = useColorMode();
  const containerRef = useRef<HTMLDivElement>(null);
  console.log('state', state);


  const {user} = useUser();
  const {
    mutateAsync: saveUserOnboarding,
    isLoading: isSavingUserOnboarding
  } = useSaveUserOnboarding();

  const handleSave = () => {
    const payload = {
      role: state.role,
      howHeFoundUs: state.howHeFoundUs,
      userId: user?.id
    } as saveUserOnboardingPayload;

    saveUserOnboarding(payload).then(() => {
      router.push('/app/docs');
    }).catch((err) => {
      router.push('/app/docs');
    });
  }


  return (
    <Container
      h="100%"
      maxW="container.lg"
      ref={containerRef}
    >
      <NextSeo title="🙋🏻‍♀️ Bienvenido a Julliet" />
      <Flex
        justifyContent="center"
        alignItems="center"
        minH="40"
        mt={-4}
      >
        <HStack spacing="0" justify="space-evenly" flex="1">
          {[...Array(numberOfSteps)].map((_, id) => (
            <Step
              key={id}
              cursor="pointer"
              onClick={() => setStep(id)}
              isActive={currentStep === id}
              isCompleted={currentStep > id}
              isLastStep={numberOfSteps === id + 1}
              zIndex={2}
            />
          ))}
        </HStack>
      </Flex>
      {currentStep === 0 && (
        <Slide
          direction={currentStep === 0 ? 'left' : 'right'}
          in={currentStep === 0} style={{zIndex: 10}}>
          <VStack spacing={4} h="100%" mt={32} overflowY="auto">
            <WelcomeHeader
              preTitle="¡Hola Victor! 👋"
              title="¡Bienvenido a Julliet!"
              subtitle="¿Qué rol te identifica?"
              image={Bot3dHi5}
            />
            <RoleSelection
              dispatch={dispatch}
              onClick={() => setStep(currentStep + 1)}
            />
          </VStack>
        </Slide>
      )
      }
      {
        currentStep === 1 && (
          <Slide
            direction={currentStep === 1 ? 'right' : 'left'}
            in={currentStep === 1} style={{width: '100%'}}
          >
            <VStack
              spacing={{base: 0, md: 4}}
              h="100%" mt={{base: 28, md: 32}} overflowY="auto">
              <WelcomeHeader
                preTitle="De verdad me alegra que estés aquí 🤗"
                title="¿Cómo te enteraste de mi?"
                subtitle="Esto me ayudará a mejorar"
                image={Bot3dHandsUp}
              />
              <Box w={{base: '80%', md: '50%'}}>
                <WhereHeFoundUs
                  dispatch={dispatch}
                  onClick={() => setStep(currentStep + 1)} />
                <Button
                  variant="ghost"
                  colorScheme="primary"
                  leftIcon={<MdArrowBack />}
                  onClick={() => setStep(currentStep - 1)}
                  mt={{base: 4, md: 0}}
                >
                  Atrás
                </Button>

              </Box>
            </VStack>
          </Slide>
        )
      }
      {
        currentStep === 2 && (
          <Slide
            direction={currentStep === 2 ? 'right' : 'left'}
            in={currentStep === 2} style={{width: '100%'}}
          >
            <VStack spacing={4} h="100%" mt={32} overflowY="auto">
              <WelcomeHeader
                preTitle="!Eres genial! 🤩"
                title="!Gracias por tu tiempo!"
                subtitle="Ya podemos empezar"
                align="center"
                justify="center"
              />
              <Box w={{base: '80%', md: '50%'}}>
                <Congratulations containerRef={containerRef} />
                <HStack
                  spacing={4}
                  mt={{base: 10, md: 4}}
                  justify="space-between" px={{base: 4, md: 0}}>
                  <Button
                    variant="ghost"
                    colorScheme="primary"
                    leftIcon={<MdArrowBack />}
                    onClick={() => setStep(currentStep - 1)}
                  >
                    Atrás
                  </Button>
                  <Button
                    bgColor={colorMode === 'light' ? 'primary.500' : 'primary.700'}
                    color="white"
                    colorScheme="primary"
                    rightIcon={<MdArrowForward />}
                    onClick={() => handleSave()}
                    alignSelf="flex-end"
                    {...jullietGradient}
                    isLoading={isSavingUserOnboarding}
                  >
                    Ir al dashboard
                  </Button>
                </HStack>
              </Box>
            </VStack>
          </Slide>
        )

      }

    </Container >
  );
}

function WelcomeHeader({
  preTitle = "Hola, Victor 🙋🏻‍♀️",
  title = '¡Hola!',
  subtitle = '¿Qué rol te identifica?',
  align = 'flex-start',
  justify = 'space-between',
  image
}: any) {
  return (
    <HStack
      spacing={{base: 4, md: 8}}
      mb={4}
      w={{base: '80%', md: '40%'}}
      align={align}
      justify={justify}
    >
      <VStack spacing="2"
        alignItems={align}
        mb="10">
        <Text
          fontSize={{base: 'xl', md: '2xl'}}
          fontWeight="bold">
          {preTitle}
        </Text>
        <Heading as="h1"
          size={{base: 'sm', md: 'md'}}
          mt="2">
          {title}
        </Heading>
        <Text fontSize={{base: 'md', md: 'lg'}}>{subtitle}</Text>
      </VStack>
      {image && (
        <Box pb="4">
          <NextImage
            src={image}
            alt="Bot 3d"
            width={150}
            height={150}
            quality={100}
          />
        </Box>
      )}
    </HStack>
  )
}

export default Welcome

