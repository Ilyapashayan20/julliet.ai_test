import NextLink from 'next/link';
import {
  Box,
  Flex,
  HStack,
  Stack,
  StackProps,
  Text,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  Link,
  useColorModeValue as mode,
  InputGroup,
  InputLeftElement,
  Input,
  Icon,
  VStack,
  useBreakpointValue,
  ModalOverlay
} from '@chakra-ui/react';

import { useEffect , useState } from 'react';
import {
  ColumnButton,
  ColumnHeader,
  ColumnHeading,
  ColumnIconButton
} from '@/components/app/ui/Column';

import Layout from '@/components/app/Layout';
import {MdAdd, MdDelete, MdSearch} from 'react-icons/md';
import DocDetail from '@/components/app/features/docs/DocDetail';
import {IDocument} from '@/types';
import {useDeleteDocument, useDocumentsByUser} from '@/lib/hooks';
import {useUser} from '@/lib/utils/useUser';
import {useDebounce} from '@/lib/utils/hooks';
import {getEditorText} from '@/lib/utils/slate';
import {useDocDetailStore} from '@/lib/store';
import {useRouter} from 'next/router';
import {formatRelativeDate} from '@/lib/utils/dates';
import DeleteModal from '@/components/app/features/docs/DeleteModal';

export const App = () => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [sidebarIsScrolled, setSidebarIsScrolled] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const router = useRouter();
  const {user} = useUser();
  const docDetailStore = useDocDetailStore();
  const [allDocuments, setAllDocuments] = useState<IDocument[]>([]);

  let {data, isLoading} = useDocumentsByUser({
    userId: user?.id as string,
    pageSize: 10,
    page: page,
    query: debouncedQuery,
    sortBy: 'updated_at',
    ascending: false,
    enabled: !!user
  });

  const {documents, total, hasMore} = data || {};

useEffect(() => {
    if (documents) {
      if (!docDetailStore.document) {
        docDetailStore.setDocument(documents[0]);
      }
    }
  }, [documents]);

  useEffect(() => {
    if (documents) {
      if (page > 1) {
        setAllDocuments([...allDocuments, ...documents]);
      } else {
        setAllDocuments(documents);
      }
    }
  }, [documents, page]);

  useEffect(() => {
    if (!isLoading && data && documents?.length === 0) {
      router.push('/app/docs/assistant');
    }
  }, [isLoading, data, documents]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
      if (hasMore) setPage(page + 1);
    }
  };

  // Esto esta mal, no entiendo porque el useBreakpointValue no funciona bien
  const isDesktop = useBreakpointValue({base: false, md: true});

 useEffect(() => {
    if (!isDesktop) {
      docDetailStore.setShowSidebar(true);
    } else {
      docDetailStore.setShowSidebar(false);
    }
  }, [isDesktop]);

  return (
    <Layout showBanner={false}>
      <Flex height="100vh" overflowY="hidden">
        <Box
          height="full"
          borderRightWidth="1px"
          width={{md: '20rem', xl: '24rem'}}
          display={
            !docDetailStore.showSidebar
              ? {base: 'none', md: 'initial'}
              : 'inline-block'
          }
          // scroll is max height of the sidebar
          onScroll={(x) => handleScroll(x)}
          overflowY="scroll"
        >
          <ColumnHeader shadow={sidebarIsScrolled ? 'base' : 'none'}>
            <VStack spacing="3" align="start" pt="2" width="full" px="2">
              <HStack justify="space-between" width="full">
                <HStack spacing="3">
                  {/* <ColumnIconButton */}
                  {/*   onClick={onOpen} */}
                  {/*   aria-label="Open Navigation" */}
                  {/*   icon={<FiMenu />} */}
                  {/*   display={{ md: 'inline-flex', lg: 'none' }} */}
                  {/* /> */}
                  <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                    <DrawerOverlay />
                    <DrawerContent></DrawerContent>
                  </Drawer>
                  <ColumnHeading>Artículos({total})</ColumnHeading>
                </HStack>
                <NextLink href="/app/docs/assistant" passHref>
                  <ColumnButton
                    leftIcon={<MdAdd />}
                    bgColor="brand.600"
                    _hover={{bgColor: 'brand.400'}}
                    color="white"
                  >
                    Nuevo
                  </ColumnButton>
                </NextLink>
              </HStack>
              <InputGroup width="full" pb={3}>
                <InputLeftElement pointerEvents="none">
                  <Icon as={MdSearch} boxSize="4" mb={2} />
                </InputLeftElement>
                <Input
                  placeholder="Buscar"
                  variant="filled"
                  width="full"
                  bgColor={mode('gray.100', 'gray.700')}
                  size="sm"
                  onChange={(e) => setQuery(e.target.value)}
                />
              </InputGroup>
            </VStack>
          </ColumnHeader>
          <ColumnSidebar documents={allDocuments} store={docDetailStore} />
        </Box>
        {!docDetailStore.showSidebar && (
          <Box maxW="full" flex="1" overflowY="scroll" mt={{base: '230px', md: '140px'}}>
            <DocDetail />
          </Box>
        )}
      </Flex>
    </Layout>
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

interface ColumnSidebarProps extends StackProps {
  documents: IDocument[] | undefined;
  store: any;
}

export const ColumnSidebar = (props: ColumnSidebarProps) => {
  let {documents, store, ...rest} = props;
  documents = documents || [];

  const bg = mode('gray.100', 'gray.700');
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [overlay, setOverlay] = useState(<Overlay />);
  const [toDeleteId, setToDeleteId] = useState<string | number>('');
  const docDetailStore = useDocDetailStore();

  const {mutateAsync: deleteDocument} = useDeleteDocument();

  const onDelete = () => {
    deleteDocument(toDeleteId).then(() => {
      if (documents && documents.length > 0) {
        docDetailStore.setDocument(documents[0]);
      } else {
        docDetailStore.setDocument(null);
      }
      onClose();
    });
  };

  const documentHaveData = (document: IDocument) => {
    return (
      document.data && Array.isArray(document.data) && document.data.length > 0
    );
  };

  return (
    <Stack spacing={{base: '1px', lg: '1'}} px={{lg: '3'}} py="3" {...rest}>
      <DeleteModal
        isOpen={isOpen}
        onClose={onClose}
        overlay={overlay}
        onDelete={onDelete}
      />
      {documents &&
        documents.map((document, idx) => (
          <Link
            key={`document-${idx}`}
            _hover={{
              textDecoration: 'none',
              bg
            }}
            _activeLink={{bg: 'gray.700', color: 'white'}}
            borderRadius={{lg: 'lg'}}
            onClick={() => {
              store.setDocument(document);
              store.setShowSidebar(false);
            }}
          >
            <Stack
              spacing="1"
              py={{base: '3', lg: '2'}}
              px={{base: '3.5', lg: '3'}}
              fontSize="sm"
              lineHeight="1.25rem"
              bg={document.id === store.document?.id ? bg : 'transparent'}
            >
              {document.title.length > 40 ? (
                <Text fontWeight="medium">
                  {document.title.slice(0, 40)}...
                </Text>
              ) : (
                <Text fontWeight="medium">{document.title}</Text>
              )}
              {documentHaveData(document) &&
                getEditorText(document.data).length > 120 ? (
                <Text opacity={0.8}>
                  {documentHaveData(document) &&
                    getEditorText(document.data).slice(0, 120)}
                  ...
                </Text>
              ) : (
                <Text opacity={0.8}>
                  {documentHaveData(document) && getEditorText(document.data)}
                </Text>
              )}
              <HStack
                spacing="2"
                fontSize="sm"
                color="gray.500"
                justify="space-between"
              >
                <Text opacity={0.6}>
                  {formatRelativeDate(document.created_at)}
                </Text>
                <Icon
                  onClick={(e) => {
                    e.stopPropagation();
                    setToDeleteId(document.id as number);
                    onOpen();
                  }}
                  as={MdDelete}
                  boxSize="4"
                />
              </HStack>
            </Stack>
          </Link>
        ))}
    </Stack>
  );
};

export default App;
