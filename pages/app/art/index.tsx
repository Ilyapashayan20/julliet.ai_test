import Layout from '@/components/app/Layout';
import Image from 'next/image';

import { useUser } from '@/lib/utils/useUser';
import {
  Button,
  Container,
  Grid,
  GridItem,
  HStack,
  Heading,
  Icon,
  Select,
  Spinner,
  Stack,
  Text,
  Textarea,
  useBreakpointValue,
  useToast
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { MdPalette } from 'react-icons/md';

export default function ChatPage() {
  const { user } = useUser();
  const [artDescription, setArtDescription] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('1792x1024');
  const [gneratedImage, setGeneratedImage] = useState<string>('');
  const [arts, setArts] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toast = useToast();

  const ArtPayload = {
    prompt: artDescription,
    n: 1,
    size: selectedSize
  };

  const getArts = async () => {
    try {
      const response = await fetch('/api/art/image', {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setArts(data.data);
      } else {
        console.error('get Arts request failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const generateArt = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/art/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          payload: ArtPayload
        })
      });
      if (response.status === 200) {
        const data = await response.json();
        setGeneratedImage(data);
      } else if (response.status === 422) {
        toast({
          title: `Your monthly art credit allocation has been fully utilized! For access to more credits, please consider reviewing our available subscription plans.`,
          position: 'bottom-right',
          status: 'warning',
          isClosable: true
        });
      } else if (response.status === 400) {
        toast({
          title: `El campo de descripción es obligatorio.`,
          position: 'bottom-right',
          status: 'error',
          isClosable: true
        });
      } else {
        toast({
          title: `Generate Art failed`,
          position: 'bottom-right',
          status: 'error',
          isClosable: true
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getArts();
  }, []);

  return (
    <Layout showBanner={false}>
      <Container py="8" flex="1">
        <Stack spacing={{ base: '8', lg: '6' }}>
          <Stack
            spacing="4"
            direction={{ base: 'column', lg: 'row' }}
            justify="space-between"
            align={{ base: 'start', lg: 'center' }}
          >
            <Stack spacing="1">
              <Heading
                size={useBreakpointValue({ base: 'xs', lg: 'sm' })}
                fontWeight="medium"
              >
                Art
              </Heading>
              <Text>Comience describiendo una imagen.</Text>
            </Stack>
            <HStack spacing="3"></HStack>
          </Stack>
          <Stack
            borderWidth="1px"
            borderColor="#E2E8F0"
            spacing={{ base: '5', lg: '6' }}
            rounded="lg"
          >
            <Grid templateColumns={{ base: '1fr', md: '1fr 3fr' }}>
              <Stack padding={2}>
                <Textarea
                  isDisabled={isLoading}
                  value={artDescription}
                  height={300}
                  maxHeight={300}
                  onChange={(e) => setArtDescription(e.target.value)}
                  placeholder="
                  Ingrese la descripción de la imagen"
                />
                <Select
                  isDisabled={isLoading}
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <option value="1792x1024">1792x1024</option>
                  <option value="1024x1024">1024x1024</option>
                  <option value="1024x1792">1024x1792</option>
                </Select>
                <Button isDisabled={isLoading} onClick={generateArt}>
                  Generar
                </Button>
              </Stack>
              <Stack
                borderWidth="1px"
                borderColor="#E2E8F0"
                justifyContent="center"
                alignItems="center"
                margin={2}
                spacing={{ base: '5', lg: '6' }}
                rounded="lg"
                overflow="hidden"
                height={396}
              >
                {isLoading ? (
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="#7c3aed"
                    size="xl"
                  />
                ) : gneratedImage ? (
                  <Image
                    width={380}
                    height={380}
                    src={
                      // process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL +
                      gneratedImage
                    }
                    loading="lazy"
                    alt="Picture of the author"
                  />
                ) : (
                  <div className="flex flex-col justify-center items-center gap-3">
                    <div className=" p-2 rounded-full bg-[#7c3aed]">
                      <MdPalette color="white" width={3} height={3} />
                    </div>
                    <h1 className=" sm:text-base text-[#7c3aed]  text-xs text-center ">
                      Para que comience el proceso, ingrese una descripción de
                      la imagen.
                    </h1>
                  </div>
                )}
              </Stack>
            </Grid>
          </Stack>
          {arts?.length > 0 && (
            <>
              <Text fontSize={24} marginTop={2}>
                Últimas Generaciones
              </Text>
              <Grid
                templateColumns="repeat(4, 1fr)" // For large screens, 4 columns
                gap={4}
                flexWrap={{ base: 'wrap', md: 'wrap', lg: 'nowrap' }}
              >
                {arts?.map((art: any, index: number) => (
                  <GridItem
                    key={index}
                    colSpan={{ base: 9, sm: 2, md: 2, lg: 1 }}
                  >
                    <a href={  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL +
                          art.path} target='_blanck' className=" cursor-pointer  w-full sm:max-w-xs  flex justify-center items-center h-full p-1 rounded-md  border border-[#7c3aed]">
                      <Image
                        width={320}
                        height={320}
                        src={
                          // process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL +
                          art.path
                        }
                        alt={art.alt}
                        className="max-h-[300px]    object-none"
                      />
                    </a>
                  </GridItem>
                ))}
              </Grid>
            </>
          )}
        </Stack>
      </Container>
    </Layout>
  );
}
