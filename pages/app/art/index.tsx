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
  useColorMode,
  useToast
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdPalette } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { HiOutlineDownload } from 'react-icons/hi';
import { formatDistanceToNow } from 'date-fns';
import { useInView } from 'react-intersection-observer';
import { CustomButton } from '@/components/ui/Step/CustomButton';

export default function ChatPage() {
  const { user, subscription } = useUser();

  const [artDescription, setArtDescription] = useState<string>('');
  const [artsCount, setArtsCount] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('1792x1024');
  const [gneratedImage, setGeneratedImage] = useState<string>('');
  const [arts, setArts] = useState<any>([]);
  const [isLoadingGeneration, setIsLoadingGenerateion] =
    useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const [page, setCurrentPage] = useState<number>(0);
  const [pagesCount, setPagesCount] = useState<number>(1);
  const { ref, inView } = useInView();

  const ArtPayload = {
    prompt: artDescription,
    size: selectedSize
  };

  const generateArt = async () => {
    setIsLoadingGenerateion(true);

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
          title: `¡Su asignación mensual de créditos de arte se ha utilizado por completo! Para acceder a más créditos, considere revisar nuestros planes de suscripción disponibles.`,
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
      setIsLoadingGenerateion(false);
    }
  };

  const saveImage = (imageUrl: string) => {
   'test';
  };

  const getArts = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/art/image?page=${page}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (page === 0) {
          setArts(data.response.data);
        } else {
          setArts((prevArts: any) => [...prevArts, ...data.response.data]);
        }
        setPagesCount(data.response.count / data.per_page);
        setArtsCount(data.response.count);
      } else {
        console.error('get Arts request failed');
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inView && pagesCount > page && !isLoading) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [inView]);

  useEffect(() => {
    if (pagesCount > page) {
      getArts(page);
    } else {
      console.log('not data awiable');
    }
  }, [page]);

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
                  isDisabled={isLoadingGeneration}
                  value={artDescription}
                  height={300}
                  maxHeight={300}
                  onChange={(e) => setArtDescription(e.target.value)}
                  placeholder="
                  Ingrese la descripción de la imagen"
                />
                <Select
                  isDisabled={isLoadingGeneration}
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <option value="1792x1024">1792x1024</option>
                  <option value="1024x1024">1024x1024</option>
                  <option value="1024x1792">1024x1792</option>
                </Select>
                <div className="flex gap-2 items-center w-full justify-between">
                  <Button
                    w={'100%'}
                    isDisabled={isLoadingGeneration}
                    onClick={generateArt}
                  >
                    Generar
                  </Button>
                  <CustomButton  className='bg-yellow-400' />
                  <span
                    className={`text-base text-white h-10 flex items-center rounded-lg px-4 bg-[#7c3aed]`}
                  >
                    {`${artsCount}/${
                      subscription?.subscription_plan_id ==
                      process.env.NEXT_PUBLIC_PADDLE_PLAN_PRO_MONTHLY_ID
                        ? '100'
                        : subscription?.subscription_plan_id ==
                          process.env.NEXT_PUBLIC_PADDLE_PLAN_PRO_YEARLY_ID
                        ? '1200'
                        : '10'
                    }`}
                  </span>{' '}
                </div>
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
                {isLoadingGeneration ? (
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="#7c3aed"
                    size="xl"
                  />
                ) : gneratedImage ? (
                  <>
                    <Image
                      width={380}
                      height={380}
                      src={
                        process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL +
                        gneratedImage
                      }
                      loading="lazy"
                      alt="Picture of the author"
                    />
                    <div className="flex gap-1 bg-[#7c3aed] rounded-xl p-1">
                      <a
                        href={
                          process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL +
                          gneratedImage
                        }
                        target="_blanck"
                        className="bg-white transition hover:bg-opacity-75 p-1 flex items-center rounded-lg  w-fit"
                      >
                        <FaEye color="black" />
                      </a>
                      <button
                        onClick={() =>
                          saveImage(
                            process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL +
                              gneratedImage
                          )
                        }
                        className="bg-white transition hover:bg-opacity-75 p-1 flex items-center rounded-lg  w-fit"
                      >
                        <HiOutlineDownload color="black" />
                      </button>
                    </div>
                  </>
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
                    <div className=" h- overflow-hidden group relative cursor-pointer  w-full sm:max-w-xs  flex justify-center items-center h-full p-1 rounded-md  border border-[#7c3aed]">
                      <Image
                        width={320}
                        height={320}
                        src={
                          process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL +
                          art.path
                        }
                        alt={`image  ${index}`}
                        loading="lazy"
                        className="max-h-[300px] hover    object-none"
                      />
                      <div className="absolute z-30 hidden h-full w-full flex-col justify-between overflow-y-clip bg-black bg-opacity-50 p-3 opacity-0 transition-all duration-500 group-hover:flex group-hover:opacity-100">
                        <div className="absolute   right-3 flex gap-1  top-3">
                          <a
                            href={
                              process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL +
                              art.path
                            }
                            target="_blanck"
                            className=" bg-white transition hover:bg-opacity-75 p-1 flex items-center rounded-lg  w-fit"
                          >
                            <FaEye color="black" />
                          </a>
                          <button
                            onClick={() =>
                              saveImage(
                                process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL +
                                  art.path
                              )
                            }
                            className="bg-white transition hover:bg-opacity-75 p-1 flex items-center rounded-lg  w-fit"
                          >
                            <HiOutlineDownload color="black" />
                          </button>
                        </div>

                        <div className="h-full  flex justify-between flex-col mt-7">
                          <p className="text-white">
                            {art.description?.length > 110
                              ? `${art.description.slice(0, 120)}...`
                              : art.description}
                          </p>

                          <p className=" bg-[#663399c7] text-white py-1 px-2 rounded-lg">
                            {formatDistanceToNow(new Date(art.created_at), {
                              addSuffix: true
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </GridItem>
                ))}
              </Grid>
            </>
          )}
        </Stack>

        <div className="mt-8 mx-auto w-fit">
          {isLoading ? (
            <Spinner
              thickness="3px"
              speed="0.65s"
              emptyColor="gray.200"
              color="#7c3aed"
              size="xl"
            />
          ) : (
            <div ref={ref} />
          )}
        </div>
      </Container>
    </Layout>
  );
}
