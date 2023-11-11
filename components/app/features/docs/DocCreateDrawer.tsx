import { useEffect, useReducer } from 'react';

import {
  Text,
  Button,
  Select,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerBody,
  DrawerCloseButton,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  GridItem,
  Icon,
  Radio,
  Box,
  Stack,
  RadioGroup,
  Spinner,
  VStack,
  FormErrorMessage,
  Textarea
} from '@chakra-ui/react';

import {
  useCreateDocumentByFetch,
  useGenerateDocumentContent
} from '@/lib/hooks';

import React from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { TbCirclePlus } from 'react-icons/tb';
import {
  DocumentLangIsoToSpanishName,
  DocumentLangToEmoji,
  Tone,
  ToneToSpanish,
  ToneToEmoji
} from '@/types';
import JullietMessage from '@/components/ui/JullietMessage';

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'add':
      return { ...state, [action.name]: action.value };
    default:
      return state;
  }
};

const initialState = {
  title: '',
  tone: 'neutral',
  lang: 'es',
  type: 'blog',
  generation_mode: 'auto',
  context: ''
};

function FullScreenSpinner(props: any) {
  const { isOpen } = props;

  return (
    <>
      {isOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100%"
          height="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex="21474831004"
          bg="gray.100"
        >
          <VStack spacing="10">
            <Spinner w="12rem" h="12rem" color="brand.600" />
            <Text fontSize="xl" fontWeight="bold" color="brand.400">
              Espera un segundo estoy escribiendo un documento para ti 😍
            </Text>
          </VStack>
        </Box>
      )}
    </>
  );
}

function DocCreateDrawer({
  isOpen,
  onOpen,
  onClose
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [generationMode, setGenerationMode] = React.useState('auto');
  const user = useUser();
  const router = useRouter();
  const [showJullietWritesInfo, setShowJullietWritesInfo] =
    React.useState(false);
  const [showUserWritesInfo, setShowUserWritesInfo] = React.useState(false);
  const titleFieldRef = React.useRef<HTMLInputElement>(null);
  const [showSpinner, setShowSpinner] = React.useState(false);

  const handleChange = (e: any) => {
    dispatch({ type: 'add', name: e.target.name, value: e.target.value });
  };

  const { mutateAsync: addNewDocument, isLoading: isCreatingDocument } =
    useCreateDocumentByFetch();

  const { mutateAsync: generateDocumentContent, isLoading: isGenerating } =
    useGenerateDocumentContent();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (user) {
      onClose();
      setShowSpinner(true);
      addNewDocument({ document: state, user_id: user?.id })
        .then((res) => {
          // Check document type and get the generator
          if (res.generation_mode === 'manual') {
            router.push(`/app/docs/${res.id}`);
          } else {
            generateDocumentContent({
              doc: res,
              userId: user?.id
            })
              .then((res: any) => {
                router.push(`/app/docs/${res.id}`);
              })
              .catch((err: any) => {
                console.log('Error generating document', err);
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
          setShowSpinner(false);
          onOpen();
        });
    }
  };

  const isTitleValid = () => {
    return state.title.split(' ').length >= 3;
  };

  const isContextValid =
    state.context.split(' ').length > 10 || state.context === '';

  useEffect(() => {
    state.generation_mode = generationMode;
  }, [generationMode]);

  return (
    <>
      <FullScreenSpinner isOpen={showSpinner} />
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        size="lg"
        initialFocusRef={titleFieldRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader display="flex" alignItems="center">
            <Icon as={TbCirclePlus} boxSize="5" mr="2" />
            Nuevo artículo
          </DrawerHeader>
          <DrawerCloseButton />
          <DrawerBody pb={6}>
            <SimpleGrid columns={2} spacing={6} columnGap={3}>
              <GridItem colSpan={2}>
                <FormControl isRequired isInvalid={!isTitleValid()}>
                  <FormLabel>Titulo</FormLabel>
                  <Input
                    name="title"
                    placeholder="Escribe un título descriptivo"
                    onChange={handleChange}
                    ref={titleFieldRef}
                  />
                  <FormErrorMessage>
                    Ups! El título debe tener al menos 3 palabras
                  </FormErrorMessage>
                  <JullietMessage
                    message="Los títulos descriptivos me ayudan a entender qué quieres transmitir en el documento, por eso es muy importante que sean descriptivos"
                    example="✨ Por ejemplo: ¿Cómo ser un buen escritor?"
                  />
                </FormControl>
              </GridItem>

              <GridItem colSpan={2}>
                <FormControl isRequired>
                  <FormLabel>Idioma</FormLabel>
                  <Select
                    borderColor="gray.300"
                    name="lang"
                    placeholder="Idioma"
                    onChange={handleChange}
                    defaultValue="es"
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

              <GridItem colSpan={1}>
                <FormControl isRequired>
                  <FormLabel>Tipo de documento</FormLabel>
                  <Select
                    name="type"
                    placeholder="Tipo de documento"
                    onChange={handleChange}
                    defaultValue="blog"
                    borderColor="gray.300"
                  >
                    <option value="blog_outline">
                      🧾 Idea para artículo de blog
                    </option>
                    <option value="blog">
                      👨🏾‍💻 Artículo de blog (800-1400 palabras)
                    </option>
                    {/* <option value="free">✍🏻 Libre</option> */}
                    <option value="email">📧 Email</option>
                    <option value="fanfiction">🦹🏻‍♀️ Fanfiction</option>
                  </Select>
                </FormControl>
              </GridItem>

              <GridItem colSpan={1}>
                <FormControl>
                  <FormLabel>Tono</FormLabel>
                  <Select
                    name="tone"
                    placeholder="Selecciona un tono"
                    onChange={handleChange}
                    defaultValue={Tone.NEUTRAL}
                    borderColor="gray.300"
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

              <GridItem colSpan={2}>
                <FormControl isRequired isInvalid={!isContextValid}>
                  <FormLabel>Puntos Clave</FormLabel>
                  <Textarea
                    placeholder="Escribe los puntos clave que quieres transmitir en el documento, separados por comas"
                    onChange={handleChange}
                    name="context"
                    borderColor="gray.300"
                  />
                  <FormErrorMessage>
                    Ups! El contexto debe tener al menos 10 palabras, o puedes
                    dejarlo vacío, pero recuerda que es importante que sea
                    descriptivo para que pueda ayudarte a escribir el documento
                  </FormErrorMessage>
                </FormControl>
              </GridItem>

              <GridItem colSpan={2} mt="6">
                <FormControl>
                  <FormLabel>
                    ¿Cómo quieres que te ayude el día de hoy?
                  </FormLabel>
                  <Stack spacing="6" mt="4">
                    <RadioGroup
                      onChange={setGenerationMode}
                      value={generationMode}
                    >
                      <Box mb="4">
                        <Radio
                          colorScheme="brand"
                          value="auto"
                          borderColor="gray.300"
                        >
                          Quiero que Julliet escriba el contenido por mi
                        </Radio>
                        <Text
                          fontSize="sm"
                          cursor="pointer"
                          as="u"
                          ml="2"
                          onClick={() =>
                            setShowJullietWritesInfo(!showJullietWritesInfo)
                          }
                        >
                          ¿Qué significa esto?
                        </Text>
                        {showJullietWritesInfo && (
                          <JullietMessage message="Escribiré el contenido por ti, luego podrás editarlo como desees. Cada palabra generada se restará de tu cuenta." />
                        )}
                      </Box>
                      <Box>
                        <Radio value="manual" borderColor="gray.300">
                          Quiero que Julliet acompañe mi escritura
                        </Radio>
                        <Text
                          fontSize="sm"
                          cursor="pointer"
                          as="u"
                          ml="2"
                          onClick={() =>
                            setShowUserWritesInfo(!showUserWritesInfo)
                          }
                        >
                          ¿Qué significa esto?
                        </Text>
                        {showUserWritesInfo && (
                          <JullietMessage message="Te haré sugerencias a medida que escribes. Solo se restarán de tu cuenta las palabras de las sugerencias que aceptes." />
                        )}
                      </Box>
                    </RadioGroup>
                  </Stack>
                </FormControl>
              </GridItem>
            </SimpleGrid>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              colorScheme="brand"
              ml={3}
              onClick={handleSubmit}
              isDisabled={!isTitleValid()}
            >
              Crear
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default DocCreateDrawer;
