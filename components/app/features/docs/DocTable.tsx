import {useDeleteDocument} from '@/lib/hooks';
import NextLink from 'next/link';
import {
  IDocument,
  DocumentType,
  DocumentTypeToSpanish,
  DocumentTypeToColor,
  DocumentLangToEmoji,
  DocumentLang,
  ToneToSpanish,
  Tone,
  ToneToColor,
  DocumentLangIsoToSpanishName
} from '@/types';
import {
  Box,
  HStack,
  Icon,
  IconButton,
  ModalOverlay,
  Skeleton,
  Table,
  TableProps,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure
} from '@chakra-ui/react';
import {useRouter} from 'next/router';
import * as React from 'react';
import DeleteModal from './DeleteModal';
import {TbTrash, TbFileDescription, TbFilePencil} from 'react-icons/tb';
import {useDocDetailStore} from '@/lib/store';

const TableSkeleton = (props: TableProps) => {
  const rowsCount = 5;
  const columnsCount = 5;

  return (
    <Table variant="simple" w="100%" {...props}>
      <Thead>
        <Tr>
          {Array.from({length: columnsCount}).map((_, i) => (
            <Th key={i}>
              <Skeleton height="20px" />
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody w="100%">
        {Array.from({length: rowsCount}).map((_, i) => (
          <Tr key={i}>
            {Array.from({length: columnsCount}).map((_, i) => (
              <Td key={i}>
                <Skeleton height="20px" />
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

interface DocsTableProps extends TableProps {
  data: any;
}

const Overlay = () => (
  <ModalOverlay
    bg="none"
    backdropFilter="auto"
    backdropInvert="30%"
    backdropBlur="2px"
  />
);

export const DocTable = (props: DocsTableProps) => {
  const {data, ...rest} = props;
  const router = useRouter();
  const [overlay, setOverlay] = React.useState(<Overlay />);
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [toDeleteId, setToDeleteId] = React.useState<string | number>('');
  const docDetailStore = useDocDetailStore();

  const {documents, isLoading} = data || {};

  const handleEdit = (docId: number) => {
    router.push(`/app/docs/${docId}`);
  };

  const {mutateAsync: deleteDocument} = useDeleteDocument()

  const onDelete = () => {
    deleteDocument(toDeleteId).then(() => {
      onClose();
      docDetailStore.setDocument(null);
    });
  };

  const handleDeleteClick = (docId: number) => {
    console.log('delete', docId);
    setOverlay(<Overlay />);
    setToDeleteId(docId);
    onOpen();
  };

  if (isLoading) {
    return <TableSkeleton {...rest} />;
  }

  return (
    <>
      <DeleteModal
        isOpen={isOpen}
        onClose={onClose}
        overlay={overlay}
        onDelete={onDelete}
      />
      <Table {...props}>
        <Thead>
          <Tr>
            <Th>
              <HStack spacing="3">
                {/* <Checkbox /> */}
                <HStack spacing="1">
                  <Text>Titulo</Text>
                  {/* }<Icon as={IoArrowDown} color="muted" boxSize="4" /> */}
                </HStack>
              </HStack>
            </Th>
            <Th>Tipo</Th>
            <Th>Tono</Th>
            <Th>Idioma</Th>
            <Th>Palabras</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {documents?.map((doc: IDocument) => (
            <Tr key={doc.id}>
              <Td>
                <HStack spacing="3">
                  {/* <Checkbox /> */}
                  {/* <Text>{doc.title}</Text> */}
                  <Box>
                    <NextLink href={`/app/docs/${doc.id}`}>
                      <HStack spacing="3" cursor="pointer">
                        <Icon as={TbFileDescription} />
                        <Text fontWeight="medium" title={doc.title}>
                          {doc.title.length > 50
                            ? doc.title.slice(0, 50) + '...'
                            : doc.title}
                        </Text>
                      </HStack>
                    </NextLink>
                    {/* <Text color="muted">{doc.title}</Text> */}
                  </Box>
                </HStack>
              </Td>
              <Td>
                <Text
                  size="sm"
                  rounded="md"
                  maxW="120px"
                  bg={DocumentTypeToColor[doc.type as DocumentType]}
                  textAlign="center"
                  fontSize="xs"
                  fontWeight="medium"
                  color="black"
                >
                  {DocumentTypeToSpanish[doc.type as DocumentType]}
                </Text>
              </Td>
              <Td>
                <Text
                  size="sm"
                  rounded="md"
                  maxW="120px"
                  bg={ToneToColor[doc.tone as Tone]}
                  textAlign="center"
                  fontSize="xs"
                  fontWeight="medium"
                  color="black"
                >
                  {ToneToSpanish[doc.tone as Tone]}
                </Text>
              </Td>
              <Td>
                <Text
                  color="muted"
                  title={DocumentLangIsoToSpanishName[doc.lang as DocumentLang]}
                >
                  {DocumentLangToEmoji[doc.lang as DocumentLang]}
                </Text>
              </Td>
              <Td>
                <Text color="muted">{doc.word_count}</Text>
              </Td>
              <Td>
                <HStack spacing="1">
                  <IconButton
                    onClick={() => handleDeleteClick(doc?.id as number)}
                    icon={<TbTrash fontSize="1.25rem" />}
                    variant="ghost"
                    aria-label="Delete member"
                  />
                  <IconButton
                    onClick={() => handleEdit(doc?.id as number)}
                    icon={<TbFilePencil fontSize="1.25rem" />}
                    variant="ghost"
                    aria-label="Edit member"
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};
