import Layout from '@/components/app/Layout';
import Dots from '@/components/app/ui/dots';
import { fetchChatResponse, fetchRewrite } from '@/lib/fetchers';
import {
  useCreateChatMessage,
  useDeleteChatMessagesByTabId,
  useGetChatMessagesByUserAndTabId,
  useGetUserChatTabIds
} from '@/lib/hooks';
import { useDebounce } from '@/lib/utils/hooks';
import { useUser } from '@/lib/utils/useUser';
import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  Textarea,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { MdAddCircle, MdChatBubbleOutline, MdSend } from 'react-icons/md';
import ReactMarkdown from 'react-markdown';
import { v4 as uuidv4 } from 'uuid';

const scrollToBottom = () => {
  console.log('scrolling to bottom');
  const chatBoxes = document.getElementsByClassName('chat-box');
  for (let i = 0; i < chatBoxes.length; i++) {
    chatBoxes[i].scrollTop = chatBoxes[i].scrollHeight;
  }
};

export default function ChatPage() {
  const { user } = useUser();
  const [tabIndex, setTabIndex] = useState(0);
  const [tabId, setTabId] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<Overlay />);
  const [search, setSearch] = useState('');
  const debouncedSearchTerm = useDebounce(search, 500);

  const { data: tabsIds } = useGetUserChatTabIds({
    userId: user?.id as string,
    enabled: !!user,
    search: debouncedSearchTerm
  });

  console.log('search', debouncedSearchTerm);

  const { mutateAsync: createChatMessage } = useCreateChatMessage();

  const handleCreateTab = useCallback(() => {
    const newTabId = uuidv4();
    createChatMessage({
      user_id: user?.id as string,
      tab_id: newTabId,
      is_bot: true,
      text: 'Hola, soy Juliet, ¿en qué te puedo ayudar?',
      created_at: new Date().toISOString()
    }).then(() => {
      console.log('newTabId', newTabId);
      setTabId(newTabId);
    });
  }, [createChatMessage, setTabId, user?.id]);

  useEffect(() => {
    // if there is not message create a welcome message
    if (tabsIds?.length === 0) {
      handleCreateTab();
    }
    setTabIndex(tabsIds?.length ? tabsIds.length - 1 : 0);
    console.log('tabIndex', tabIndex);
    () => {
      setTabIndex(0);
    };
  }, [tabsIds, handleCreateTab, setTabIndex, tabIndex]);

  useEffect(() => {
    if (!tabId && tabsIds && tabsIds?.length > 0) {
      setTabId(tabsIds[tabIndex]);
      console.log('tabId', tabId);
    }
  }, [tabsIds, tabId, tabIndex]);

  function handleTabChange(index: number) {
    setTabIndex(index);
    if (tabsIds) {
      setTabId(tabsIds[index]);
      console.log('tabId', tabId);
    }
    setTimeout(() => {
      scrollToBottom();
    }, 300);
  }

  const { mutateAsync: deleteTab } = useDeleteChatMessagesByTabId({
    tabId,
    userId: user?.id as string
  });

  const handleDeleteTab = () => {
    deleteTab().then(() => {
      if (tabsIds?.length === 1) {
        handleCreateTab();
      }
      onClose();
    });
  };

  const color = useColorModeValue('gray.600', 'white');

  return (
    <Layout showBanner={false}>
      <DeleteModal
        isOpen={isOpen}
        onClose={onClose}
        onDelete={handleDeleteTab}
        overlay={overlay}
      />
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
                Chat
              </Heading>
              <Text>
                Conversa con Julliet y obtén respuestas a tus preguntas
              </Text>
            </Stack>
            <HStack spacing="3"></HStack>
          </Stack>
          <Stack
            border="1px solid #E2E8F0"
            spacing={{ base: '5', lg: '6' }}
            rounded="lg"
          >
            <Grid templateColumns="repeat(4, 1fr)" height={'80vh'}>
              <GridItem
                colSpan={1}
                w=""
                h="100%"
                borderRight="1px #E2E8F0 solid"
              >
                <Stack padding={4}>
                  <Input
                    onChange={(e: any) => setSearch(e.target.value)}
                    placeholder="Buscar conversación..."
                  />
                </Stack>
                <Stack>
                  <Stack
                    onClick={() => {
                      handleCreateTab();
                    }}
                    direction={'row'}
                    align="center"
                    spacing={2}
                    padding={4}
                    _hover={{ background: 'gray.200', cursor: 'pointer' }}
                  >
                    <MdAddCircle size="24" />
                    <Text>Crear nuevo chat</Text>
                  </Stack>
                  {tabsIds?.map((id, idx) => (
                    <Stack
                      onClick={() => {
                        handleTabChange(idx);
                      }}
                      key={`chat-${id}`}
                      background={tabId === id ? 'gray.200' : 'transparent'}
                      _hover={{ background: 'gray.200', cursor: 'pointer' }}
                      direction={'row'}
                      align="center"
                      spacing={2}
                      padding={4}
                    >
                      <MdChatBubbleOutline
                        color={tabId === id ? 'black' : color}
                        size={24}
                      />
                      <Text color={tabId === id ? 'black' : color}>
                        Chat {idx + 1}{' '}
                      </Text>
                    </Stack>
                  ))}
                </Stack>
              </GridItem>
              <GridItem colSpan={3} h="100%" overflowY="scroll">
                {/* <Stack  height={'6.8%'} padding={4}>
                </Stack>
                <Stack background="gray.200" height={'86%'} padding={4}>
                </Stack>
                <Stack  height={'7%'} padding={4}>
  </Stack> */}
                <ChatBox
                  user={user}
                  tabId={tabId.toString()}
                  activeTabId={tabId}
                />
              </GridItem>
            </Grid>
          </Stack>
        </Stack>
      </Container>
    </Layout>
  );
}

const ChatBox = ({
  user,
  tabId,
  activeTabId
}: {
  user: any;
  tabId: string;
  activeTabId: string;
}) => {
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const { canCreate } = useUser();
  const router = useRouter();

  // load more messages when scrolling to top
  const handleScroll = (e: any) => {
    if (e.target.scrollTop === 0) {
      if (hasMore) {
        setPage(page + 1);
      }
    }
  };

  const { mutateAsync: createChatMessage } = useCreateChatMessage();

  const { data, isLoading: isMessageLoading } =
    useGetChatMessagesByUserAndTabId({
      userId: user?.id as string,
      tabId,
      enabled: !!user && tabId !== '' && tabId === activeTabId,
      page: page,
      pageSize: 10,
      sortBy: 'created_at',
      ascending: false
    });

  const { messages, hasMore } = data || {};

  useEffect(() => {
    if (messages?.length) {
      scrollToBottom();
    }
  }, [messages, tabId]);

  const handleSendMessage = () => {
    createChatMessage({
      user_id: user?.id as string,
      tab_id: tabId,
      is_bot: false,
      text: message
    }).then(() => {
      getSuggestion();
    });

    setMessage('');
  };

  function handleRewriteMessage(text: string) {
    setIsLoading(true);
    fetchRewrite({
      prompt: text
    })
      .then((res) => {
        setIsLoading(false);
        createChatMessage({
          user_id: user?.id as string,
          tab_id: tabId,
          is_bot: true,
          text: res.text
        });
      })
      .catch((err) => {
        setIsLoading(false);
        console.log('err', err);
      });
  }

  const getSuggestion = () => {
    if (!canCreate) {
      router.push('/app/billing');
    }

    setIsLoading(true);
    fetchChatResponse({
      tabId
    })
      .then((res) => {
        console.log('res', res);
        setIsLoading(false);

        if (res?.text) {
          createChatMessage({
            user_id: user?.id as string,
            is_bot: true,
            tab_id: tabId,
            text: res.text
          });
        } else {
          createChatMessage({
            user_id: user?.id as string,
            is_bot: true,
            tab_id: tabId,
            text: 'Necesito un poco más de información para poder ayudarte 😅'
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        alert('Error');
        alert(err);
        console.log('err', err);
      });
  };

  useEffect(() => {
    console.log('scroll to bottom');
  }, [messages]);

  return (
    <>
      <Box
        h={['calc(100% - 110px)', 'calc(100% - 110px)']}
        w="100%"
        p="8"
        overflowY="scroll"
        onScroll={handleScroll}
        bg="gray.100"
        className="chat-box"
      >
        {isMessageLoading && (
          <Stack spacing="4" w="full" bg="gray.200" h="1000px" opacity="0.5">
            <Dots />
          </Stack>
        )}

        <Stack spacing="6">
          {messages &&
            !isMessageLoading &&
            messages.map((item, index) => (
              <Stack
                direction={item.is_bot ? 'row' : 'row-reverse'}
                key={`${item.id}-msg`}
              >
                <Avatar
                  w="32px"
                  h="32px"
                  p={!item.is_bot ? '0px' : '0px'}
                  name={!item.is_bot ? 'Yo' : 'Julliet'}
                  bg={!item.is_bot ? 'brand.400' : 'transparent'}
                  src={
                    !item.is_bot
                      ? user?.user_metadata.avatar_url || null
                      : '/logo/imagotipo.png'
                  }
                />
                <Box
                  p="2"
                  borderRadius="lg"
                  borderTopLeftRadius={item.is_bot ? 0 : 'lg'}
                  borderTopEndRadius={!item.is_bot ? 0 : 'lg'}
                  w="fit-content"
                  alignSelf={!item.is_bot ? 'flex-end' : 'flex-start'}
                  bg={!item.is_bot ? 'white' : 'brand.600'}
                  color={item.is_bot ? 'white' : 'brand.600'}
                >
                  <HStack spacing="2">
                    <Box ml={item.is_bot ? 2 : 0}>
                      <ReactMarkdown>{item.text}</ReactMarkdown>
                    </Box>

                    <Flex flexDirection="column" hidden={!item.is_bot}>
                      <Menu>
                        <MenuButton
                          bg="transparent"
                          _hover={{ bg: 'transparent' }}
                          _expanded={{ bg: 'transparent' }}
                          as={Button}
                        />
                        <MenuList
                          bg="white"
                          color="black"
                          w="100px"
                          shadow="none"
                        >
                          <MenuItem
                            onClick={() => handleRewriteMessage(item.text)}
                          >
                            ✍️ Reescribir
                          </MenuItem>
                          {/* <MenuItem>📝 Crear artículo</MenuItem> */}
                        </MenuList>
                      </Menu>
                    </Flex>
                  </HStack>
                </Box>
              </Stack>
            ))}
          <Spacer />
        </Stack>
      </Box>
      <Box padding={4}>
        <InputGroup>
          <InputRightElement p="5" w="90px">
            <Box h="100%">
              {!isLoading ? (
                <Icon
                  ml="6"
                  as={MdSend}
                  color="gray.500"
                  fontSize="30"
                  cursor="pointer"
                  onClick={handleSendMessage}
                />
              ) : (
                <Dots size="10px" />
              )}
            </Box>
          </InputRightElement>
          <Textarea
            readOnly={isLoading}
            placeholder="Escribe un mensaje"
            size="lg"
            _focus={{ shadow: 'lg', bg: 'white', border: 'gray.200' }}
            color="gray.900"
            bgColor={isLoading ? 'gray.400' : 'white'}
            shadow="lg"
            border="none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (message.length > 0) handleSendMessage();
              }
            }}
          />
        </InputGroup>
      </Box>
    </>
  );
};

const Overlay = () => (
  <ModalOverlay
    bg="none"
    backdropFilter="auto"
    backdropInvert="30%"
    backdropBlur="2px"
  />
);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  overlay: React.ReactNode;
  onDelete: () => void;
}

function DeleteModal(props: Props) {
  const { isOpen, onClose, overlay, onDelete } = props;

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="xl">
      {overlay}
      <ModalContent>
        <ModalHeader>Confirmación</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Stack spacing="4">
            <Text fontWeight="medium">
              ¿Estas seguro que quieres cerrar este chat?
            </Text>
            <Text fontSize="sm" color="red.500">
              <Text as="span" fontWeight="bold" alignSelf="left">
                *
              </Text>{' '}
              Esta accion no podra ser revertida
            </Text>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onDelete}>
            Eliminar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
