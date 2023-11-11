import {
  Box,
  Text,
  HStack,
  Button,
  FormControl,
  Icon,
  Container,
  Flex,
  SimpleGrid,
  Input,
  FormLabel,
  GridItem,
  FormErrorMessage,
  FormHelperText,
  Select,
  Textarea,
  useBreakpointValue
} from '@chakra-ui/react';
import {Step} from '@/components/ui/Step';
import {useStep} from '@/components/ui/Step/useStep';
import Bot3dHi5 from '@/images/ilustrations/bot-3d-hi5.png';
import Bot3dHandsUp from '@/images/ilustrations/bot-3d-hands-up.png';
import Bot3d from '@/images/ilustrations/bot-3d.png';
import Image from 'next/image';
import {useEffect, useReducer, useState} from 'react';
import Layout from '@/components/app/Layout';
import CreationLoader from '@/components/app/features/docs/CreationLoader';

import {
  DocumentLangIsoToSpanishName,
  DocumentLangToEmoji,
  Tone,
  ToneToEmoji,
  ToneToSpanish
} from '@/types';
import {useRouter} from 'next/router';
import {
  useCreateDocumentByFetch,
  useGenerateDocumentContent
} from '@/lib/hooks';
import {useUser} from '@/lib/utils/useUser';
import {useDocDetailStore} from '@/lib/store';
import {MdArrowForward, MdGeneratingTokens} from 'react-icons/md';

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'add':
      return {...state, [action.name]: action.value};
    default:
      return state;
  }
};

const initialState = {
  title: '',
  tone: 'neutral',
  lang: 'es',
  type: 'essay',
  generation_mode: 'auto',
  context: ''
};

export default function Assistant() {
  const numberOfSteps = 3;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentStep, {setStep}]: [number, any] = useStep({
    maxStep: numberOfSteps,
    initialStep: 0
  });
  const [generationMode, setGenerationMode] = useState('auto');
  const isDesktop = useBreakpointValue({base: false, md: true});
  const [isValidTitle, setIsValidTitle] = useState(true);
  const [isValidContext, setIsValidContext] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const router = useRouter();
  const {user, canCreate, isLoading} = useUser();

  useEffect(() => {
    if (!isLoading && !canCreate) {
      router.push('/app/billing');
    }
  }, [canCreate]);

  const handleChange = (e: any) => {
    dispatch({type: 'add', name: e.target.name, value: e.target.value});
  };

  const {mutateAsync: addNewDocument, isLoading: isCreatingDocument} =
    useCreateDocumentByFetch();

  const {mutateAsync: generateDocumentContent, isLoading: isGenerating} =
    useGenerateDocumentContent();

  const docDetailStore = useDocDetailStore();
  const handleSubmit = (e: MouseEvent) => {
    e.preventDefault();
    if (user) {
      setShowLoader(true);
      addNewDocument({document: state, user_id: user?.id})
        .then((res) => {
          // Check document type and get the generator
          if (res.generation_mode === 'manual') {
            docDetailStore.setDocument(res);
            router.push(`/app/docs`);
          } else {
            generateDocumentContent({
              doc: res,
              userId: user?.id
            })
              .then((res: any) => {
                docDetailStore.setDocument(res);
                router.push(`/app/docs`);
                setShowLoader(false);
              })
              .catch((err: any) => {
                console.log('Error generating document', err);
                console.log(err);
                setShowLoader(false);
              });
          }
        })
        .catch((err) => {
          console.log(err);
          setShowLoader(false);
        });
    }
  };

  const botDialog = [
    {
      headline: '¡Hola!',
      // text: '¿cómo te puedo ayudar hoy?',
      text: '¿qué quieres escribir hoy?',
      image: Bot3dHi5
    },
    // {
    //   headline: '¡Muy bien!',
    //   text: '¿qué quieres escribir hoy?',
    //   image: Bot3d
    // },
    {
      headline: '¡Genial!',
      text: '¿cómo titulamos el artículo?',
      image: Bot3dHi5
    },
    {
      headline: '¡Excelente!',
      text: 'Ya casi terminamos, elige el idioma y el tono del artículo',
      image: Bot3dHandsUp
    }
  ];

  useEffect(() => {
    state.generation_mode = generationMode;
  }, [generationMode]);

  useEffect(() => {
    if (state.title.length > 0) {
      setIsValidTitle(state.title.split(' ').length >= 3);
    }
    if (state.context.length > 0) {
      setIsValidContext(state.context.split(' ').length > 3 && state.context.split(' ').length < 50);
    }
  }, [state]);

  return (
    <Layout showBanner={false}>
      <CreationLoader isOpen={showLoader} />
      <Box h="100vh" mt={{base: -14, md: 0}}>
        <Container
          display="flex"
          justifyContent="center"
          alignItems="center"
          minH="40"
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
              />
            ))}
          </HStack>
        </Container>
        <SimpleGrid
          mt={{base: 0, md: -10}}
          columns={2}
          spacing="0"
          flex="1"
          w={{base: '65%', md: '20%'}}
          mx="auto"
        >
          <Box />
          <Box
            bgColor="#E9E5FF"
            p="4"
            borderRadius="10px 10px 10px 0"
            ml={{base: 0, md: -20, lg: -12}}
            mt={{base: -5, md: 20}}
          >
            <Text
              fontSize={{base: 'md', md: 'xl'}}
              fontWeight="bold"
              color="brand.400"
            >
              {botDialog[currentStep]?.headline}
            </Text>
            <Text
              fontSize={{base: 'lg', md: '2xl'}}
              fontWeight="bold"
              color="gray.900"
            >
              {botDialog[currentStep]?.text}
            </Text>
            <Box />
          </Box>
          <Box mt={-10} ml={{base: -4, md: -28, lg: -18}}>
            <Image
              src={botDialog[currentStep]?.image}
              alt="Bot3dHi5"
              width={isDesktop ? 120 : 80}
            />
          </Box>
        </SimpleGrid>
        {/* {currentStep === 0 && ( */}
        {/*   <Container size="lg" mt={-10}> */}
        {/*     <FormControl> */}
        {/*       <Flex flex="1" justify="center" py={14}> */}
        {/*         <VStack width="fit-content" borderRadius="md"> */}
        {/*           <RadioGroup */}
        {/*             onChange={setGenerationMode} */}
        {/*             defaultValue={generationMode} */}
        {/*           > */}
        {/*             <Box */}
        {/*               bgColor={generationMode === 'auto' ? '#EEF2FF' : 'white'} */}
        {/*               borderRadius="10px 10px 0 0" */}
        {/*               py={4} */}
        {/*               px={{base: 4, md: 8}} */}
        {/*               color="brand.600" */}
        {/*             > */}
        {/*               <Radio colorScheme="brand" value="auto"> */}
        {/*                 <Text */}
        {/*                   fontWeight="bold" */}
        {/*                   fontSize={{base: 'md', md: 'xl'}} */}
        {/*                 > */}
        {/*                   Quiero que escribas un artículo por mí.{'  '} */}
        {/*                 </Text> */}
        {/*               </Radio> */}
        {/*               <Text */}
        {/*                 color="brand.600" */}
        {/*                 fontSize={{base: 'sm', md: 'md'}} */}
        {/*               > */}
        {/*                 Escribiré el artículo por ti, luego podrás revisarlo.{' '} */}
        {/*                 {/1* <Text *1/} */}
        {/*                 {/1*   as="span" *1/} */}
        {/*                 {/1*   color="brand.600" *1/} */}
        {/*                 {/1*   fontSize="sm" *1/} */}
        {/*                 {/1*   cursor="pointer" *1/} */}
        {/*                 {/1*   textDecoration="underline" *1/} */}
        {/*                 {/1* > *1/} */}
        {/*                 {/1*   Ver video tutorial *1/} */}
        {/*                 {/1* </Text> *1/} */}
        {/*               </Text> */}
        {/*             </Box> */}
        {/*             <Box */}
        {/*               bgColor={ */}
        {/*                 generationMode === 'manual' ? '#EEF2FF' : 'white' */}
        {/*               } */}
        {/*               borderRadius="0 0 10px 10px" */}
        {/*               py={4} */}
        {/*               px={{base: 4, md: 8}} */}
        {/*               color="brand.600" */}
        {/*             > */}
        {/*               <Radio */}
        {/*                 value="manual" */}
        {/*                 borderColor="gray.300" */}
        {/*                 fontWeight="extrabold" */}
        {/*               > */}
        {/*                 <Text */}
        {/*                   fontWeight="bold" */}
        {/*                   fontSize={{base: 'md', md: 'xl'}} */}
        {/*                 > */}
        {/*                   Quiero que acompañes mi escritura */}
        {/*                 </Text> */}
        {/*               </Radio> */}
        {/*               <Text */}
        {/*                 color="brand.600" */}
        {/*                 fontSize={{base: 'sm', md: 'md'}} */}
        {/*                 cursor="pointer" */}
        {/*               > */}
        {/*                 Te haré sugerencias a medida que escribes, para que */}
        {/*                 puedas mejorar tu redacción. {/1* <Text *1/} */}
        {/*                 {/1*   as="span" *1/} */}
        {/*                 {/1*   color="brand.600" *1/} */}
        {/*                 {/1*   fontSize="sm" *1/} */}
        {/*                 {/1*   cursor="pointer" *1/} */}
        {/*                 {/1*   textDecoration="underline" *1/} */}
        {/*                 {/1* > *1/} */}
        {/*                 {/1*   Ver video tutorial *1/} */}
        {/*                 {/1* </Text> *1/} */}
        {/*               </Text> */}
        {/*             </Box> */}
        {/*           </RadioGroup> */}
        {/*         </VStack> */}
        {/*       </Flex> */}
        {/*       <Flex justify="center"> */}
        {/*         <HStack */}
        {/*           spacing="100" */}
        {/*           justify="center" */}
        {/*           flex="1" */}
        {/*           alignSelf="flex-end" */}
        {/*           mb="4" */}
        {/*           w={{base: '95%', md: '50%'}} */}
        {/*         > */}
        {/*           <Button variant="ghost" onClick={() => router.push('/')}> */}
        {/*             Cancelar */}
        {/*           </Button> */}

        {/*           <Button */}
        {/*             variant="solid" */}
        {/*             color="white" */}
        {/*             bgColor="brand.600" */}
        {/*             onClick={() => setStep(currentStep + 1)} */}
        {/*             _hover={{bgColor: 'brand.400'}} */}
        {/*             _active={{bgColor: 'brand.600'}} */}
        {/*           > */}
        {/*             Continuar <Icon as={MdArrowForward} ml={2} /> */}
        {/*           </Button> */}
        {/*         </HStack> */}
        {/*       </Flex> */}
        {/*     </FormControl> */}
        {/*   </Container> */}
        {/* )} */}
        {currentStep === 0 && (
          <Container flex="1" py={6} maxW={{base: '95%', md: '50%'}}>
            <Box>
              <SimpleGrid columns={2} spacing={6} columnGap={3}>
                <GridItem colSpan={2}>
                  <FormControl isRequired>
                    <FormLabel>Plantilla</FormLabel>
                    <Select
                      name="type"
                      placeholder="Tipo de artículo"
                      borderColor="gray.300"
                      onChange={handleChange}
                      defaultValue={state.type}
                    >
                      <option value="essay">
                        📝 Ensayo o artículo académico
                      </option>
                      <option value="blog_outline">
                        🧾 Idea para artículo de blog
                      </option>
                      <option value="blog">👨🏾‍💻 Artículo de blog</option>
                      <option value="email">📧 Email</option>
                      <option value="fanfiction">🦹🏻‍♀️ Fanfiction</option>
                    </Select>
                    <FormHelperText>
                      Elige una de las opciones, esta influirá en la forma en
                      que te ayudaré a escribir y en la estructura del artículo,
                      un gran artículo debe tener una buena estructura.
                    </FormHelperText>
                  </FormControl>
                </GridItem>
              </SimpleGrid>
            </Box>
            <Flex justify="center">
              <HStack
                spacing="100"
                justify="center"
                flex="1"
                alignSelf="flex-end"
                mb="4"
                mt={6}
                w={{base: '95%', md: '50%'}}
              >
                <Button variant="ghost" onClick={() => router.push('/')}>
                  Cancelar
                </Button>

                <Button
                  variant="solid"
                  color="white"
                  bgColor="brand.600"
                  onClick={() => setStep(currentStep + 1)}
                  _hover={{bgColor: 'brand.400'}}
                  _active={{bgColor: 'brand.600'}}
                >
                  Continuar <Icon as={MdArrowForward} ml={2} />
                </Button>
              </HStack>
            </Flex>
          </Container>
        )}
        {currentStep === 1 && (
          <Container flex="1" py={6} maxW={{base: '95%', md: '50%'}}>
            <SimpleGrid columns={2} spacing={2} columnGap={3}>
              <GridItem colSpan={2}>
                <FormControl isRequired isInvalid={!isValidTitle}>
                  <FormLabel>Título</FormLabel>
                  <Input
                    name="title"
                    placeholder="Escribe un título descriptivo"
                    onChange={handleChange}
                    value={state.title}
                    isRequired
                    isInvalid={!isValidTitle}
                  />
                  {isValidTitle ? (
                    <FormHelperText>
                      Usa palabras que describan el contenido del artículo. 🌟
                      Por ejemplo: ¿Cómo ser un buen escritor?
                    </FormHelperText>
                  ) : (
                    <FormErrorMessage>
                      Ups! El título debe tener al menos 3 palabras
                    </FormErrorMessage>
                  )}
                </FormControl>
              </GridItem>
              <GridItem colSpan={2}>
                <FormControl isRequired isInvalid={!isValidContext}>
                  <FormLabel>Puntos Clave</FormLabel>
                  <Textarea
                    placeholder="Escribe los puntos clave que quieres transmitir en el documento, separados por comas"
                    name="context"
                    borderColor="gray.300"
                    onChange={handleChange}
                    isInvalid={!isValidContext}
                    value={state.context}
                  />
                  {isValidContext ? (
                    <FormHelperText>
                      🌟 Por ejemplo: ¿Cómo ser un buen escritor?, ¿Cómo
                      escribir un artículo de blog?, ¿Cómo escribir un email?
                    </FormHelperText>
                  ) : (
                    <FormErrorMessage>
                      Ups! Los puntos clave debe tener al menos 3 palabras y un máximo de 50 palabras
                      recuerda que esto ayudará a que tu artículo sea más
                      descriptivo, puedes separar los puntos clave por comas.
                    </FormErrorMessage>
                  )}
                </FormControl>
              </GridItem>
            </SimpleGrid>
            <Flex justify="center">
              <HStack
                spacing="100"
                justify="center"
                flex="1"
                alignSelf="flex-end"
                mb="4"
                mt={6}
                w={{base: '95%', md: '50%'}}
              >
                <Button
                  variant="ghost"
                  onClick={() => setStep(currentStep - 1)}
                >
                  Atrás
                </Button>

                <Button
                  variant="solid"
                  color="white"
                  bgColor="brand.600"
                  onClick={() => setStep(currentStep + 1)}
                  _hover={{bgColor: 'brand.400'}}
                  _active={{bgColor: 'brand.600'}}
                  isDisabled={
                    state.context.split(' ').length < 3 ||
                    state.title.split(' ').length < 3
                  }
                >
                  Continuar <Icon as={MdArrowForward} ml={2} />
                </Button>
              </HStack>
            </Flex>
          </Container>
        )}
        {currentStep === 2 && (
          <Container flex="1" py={6} maxW={{base: '95%', md: '40%'}}>
            <SimpleGrid columns={2} spacing={6} columnGap={3}>
              <GridItem colSpan={{base: 2, md: 2}}>
                <FormControl isRequired>
                  <FormLabel>Idioma</FormLabel>
                  <Select
                    borderColor="gray.300"
                    name="lang"
                    placeholder="Idioma"
                    defaultValue="es"
                    onChange={handleChange}
                  >
                    {Object.entries(DocumentLangIsoToSpanishName).map(
                      ([key, value]) => (
                        <option key={key} value={key}>
                          {/* @ts-ignore */}
                          {DocumentLangToEmoji[key]} {value}
                        </option>
                      )
                    )}
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem colSpan={{base: 2, md: 2}}>
                <FormControl>
                  <FormLabel>Tono</FormLabel>
                  <Select
                    name="tone"
                    placeholder="Selecciona un tono"
                    defaultValue={Tone.NEUTRAL}
                    borderColor="gray.300"
                    onChange={handleChange}
                  >
                    {Object.entries(ToneToSpanish).map(([key, value]) => (
                      <option key={key} value={key}>
                        {/* @ts-ignore */}
                        {ToneToEmoji[key]} {value}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
            </SimpleGrid>
            <Flex justify="center">
              <HStack
                spacing="100"
                justify="center"
                flex="1"
                alignSelf="flex-end"
                mb="4"
                mt={6}
                w={{base: '95%', md: '50%'}}
              >
                <Button
                  variant="ghost"
                  onClick={() => setStep(currentStep - 1)}
                >
                  Atrás
                </Button>

                <Button
                  variant="solid"
                  color="white"
                  bgColor="brand.600"
                  onClick={(e: any) => handleSubmit(e)}
                  _hover={{bgColor: 'brand.400'}}
                  _active={{bgColor: 'brand.600'}}
                >
                  Finalizar <Icon as={MdGeneratingTokens} ml={2} />
                </Button>
              </HStack>
            </Flex>
          </Container>
        )}
      </Box>
    </Layout>
  );
}
