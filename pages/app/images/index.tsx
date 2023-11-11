import { useState, useRef } from 'react';
import {
  Box,
  Flex,
  useBreakpointValue,
  Button,
  Center,
  HStack,
  Stack,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
  Textarea
} from '@chakra-ui/react';
import { FiSearch, FiImage } from 'react-icons/fi';
import ImageGrid from '@/components/app/features/art/ImageGrid';
import ImageCard from '@/components/app/features/art/ImageCard';
import { useLexicaImages } from '@/lib/hooks';
import Layout from '@/components/app/Layout';

const defaultQueries = ['cat', 'dog', 'bird', 'fish', 'rabbit'];

const Art = () => {
  const someDefaultQuery =
    defaultQueries[Math.floor(Math.random() * defaultQueries.length)];
  const [query, setQuery] = useState<string>(someDefaultQuery);
  const [showTextPrompt, setShowTextPrompt] = useState(false);
  const [promptText, setPromptText] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  const { data } = useLexicaImages({
    query: query,
    enabled: !!query
  });

  const handleSearch = () => {
    const element = inputRef.current;
    if (!element) return;

    if (showTextPrompt) {
      setShowTextPrompt(false);
      element.focus();
      element.textContent = promptRef.current?.value || '';
    } else {
      console.log('handleSearch');
      const search = inputRef.current?.value;
      console.log('search', search);
      setQuery(search || '');
      if (search) {
        sessionStorage.setItem('lastSearch', search);
      }
    }
  };

  const handleCreate = () => {
    const element = promptRef.current;
    if (!element) return;

    const prompt = element.value || '';

    if (showTextPrompt) {
      const text = promptRef.current?.value;
      // set text area text to 'hello world'
      setPromptText(text || '');
      console.log('handleCreate', text);
    } else {
      setShowTextPrompt(true);
      element.focus();
      setPromptText(prompt);
    }
  };

  return (
    <Layout>
      <Box py="8" flex="1" overflowY="auto" w="100%">
        <Stack spacing={{ base: '8', lg: '6' }}>
          {/* <Stack */}
          {/*   spacing="4" */}
          {/*   direction={{ base: 'column', lg: 'row' }} */}
          {/*   justify="space-between" */}
          {/*   align={{ base: 'start', lg: 'center' }} */}
          {/* > */}
          {/*   <Stack spacing="1"> */}
          {/*     <Heading */}
          {/*       size={useBreakpointValue({ base: 'xs', lg: 'sm' })} */}
          {/*       fontWeight="medium" */}
          {/*     > */}
          {/*       Documentos */}
          {/*     </Heading> */}
          {/*     <Text color="muted"> */}
          {/*       Documentos escritos por ti, con ayuda de Julliet */}
          {/*     </Text> */}
          {/*   </Stack> */}
          {/*   <HStack spacing="3"> */}
          {/*     <Button variant="primary">Nuevo documento</Button> */}
          {/*   </HStack> */}
          {/* </Stack> */}
          <Stack spacing={{ base: '5', lg: '6' }}>
            <Box py="12" w="100%" display="flex" flexDirection="column" m="0">
              <Box w="100%">
                <Center>
                  <VStack spacing={5}>
                    <HStack spacing={5}>
                      <FiImage size={24} />
                      <Text fontSize="2xl">Mis imagenes</Text>
                    </HStack>

                    <Text fontSize="md">
                      Millones de imagenes disponibles para ti, utiliza alguna o
                      crea una completamente nueva
                    </Text>
                  </VStack>
                </Center>
                <Center mt={10}>
                  <VStack spacing={5}>
                    <InputGroup hidden={showTextPrompt}>
                      <InputLeftElement pointerEvents="none">
                        <FiSearch />
                      </InputLeftElement>
                      <Input
                        placeholder="Buscar entre millones de imagenes"
                        w={400}
                        type="text"
                        size="md"
                        ref={inputRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSearch();
                        }}
                      />
                    </InputGroup>
                    <Textarea
                      value={promptText}
                      hidden={!showTextPrompt}
                      placeholder="Define tu imagen con palabras, se todo lo descriptivo que puedas"
                      w={400}
                      size="md"
                      ref={promptRef}
                      onChange={(e) => setPromptText(e.target.value)}
                    />
                    <HStack spacing={5}>
                      <Button
                        colorScheme="purple"
                        maxW={28}
                        leftIcon={<FiSearch />}
                        onClick={(e) => handleSearch()}
                      >
                        Buscar
                      </Button>
                      <Button maxW={20} onClick={() => handleCreate()}>
                        Crear
                      </Button>
                    </HStack>
                  </VStack>
                </Center>
              </Box>
              <Box
                w="100%"
                px={{ base: '4', md: '8', lg: '12' }}
                py={{ base: '6', md: '8', lg: '12' }}
              >
                <ImageGrid>
                  {data &&
                    data.images &&
                    data.images.map((image) => (
                      <ImageCard key={image.id} image={image} />
                    ))}
                </ImageGrid>
              </Box>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Layout>
  );
};

export default Art;
