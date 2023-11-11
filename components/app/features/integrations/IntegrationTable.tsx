import { useDeleteIntegration, useIntegrationById } from '@/lib/hooks';
import NextLink from 'next/link';
import { IntegrationTypeColor, IntegrationType, IIntegration } from '@/types';
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
import * as React from 'react';
import DeleteModal from './DeleteModal';
import { TbTrash, TbFilePencil } from 'react-icons/tb';

import { BsWordpress } from 'react-icons/bs';
import { useIntegrationStore } from '@/lib/store';

interface DocsTableProps extends TableProps {
  data: any;
}

export const IntegrationTable = (props: DocsTableProps) => {
  const { data, ...rest } = props;
  const [overlay, setOverlay] = React.useState(<Overlay />);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [toHandleId, setToHandleId] = React.useState<number | null>(null);

  const { integrations, isLoading } = data || {};

  const store = useIntegrationStore();

  const { data: integration, refetch } = useIntegrationById({
    integrationId: toHandleId as number,
    enabled: false
  });

  const handleEdit = (integrationId: number) => {
    console.log('handleEdit', integrationId);
    setToHandleId(integrationId);
    store.setIsEditing(true);
  };

  React.useEffect(() => {
    if (toHandleId) {
      refetch();
    }
  }, [toHandleId]);

  React.useEffect(() => {
    if (integration) {
      store.setIntegration(integration);
      store.setDrawerIsOpen(true);
    }
  }, [integration]);

  const deleteIntegration = useDeleteIntegration();

  const onDelete = () => {
    deleteIntegration(toHandleId as number);
    onClose();
  };

  const handleDeleteClick = (integrationId: number) => {
    setOverlay(<Overlay />);
    setToHandleId(integrationId);
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
                  <Text>Nombre</Text>
                  {/* }<Icon as={IoArrowDown} color="muted" boxSize="4" /> */}
                </HStack>
              </HStack>
            </Th>
            <Th>Tipo</Th>
            <Th>Host</Th>
            <Th>Username</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {integrations?.map((integration: IIntegration) => (
            <Tr key={integration.id}>
              <Td>
                <HStack spacing="3">
                  {/* <Checkbox /> */}
                  {/* <Text>{integration.title}</Text> */}
                  <Box>
                    <NextLink href={`/app/integrations/${integration.id}`}>
                      <HStack spacing="3" cursor="pointer">
                        <Text fontWeight="medium">{integration.name}</Text>
                      </HStack>
                    </NextLink>
                    {/* <Text color="muted">{integration.title}</Text> */}
                  </Box>
                </HStack>
              </Td>
              <Td>
                <Text
                  size="sm"
                  rounded="md"
                  maxW="90px"
                  bg={IntegrationTypeColor[integration.type as IntegrationType]}
                  textAlign="center"
                  fontSize="xs"
                  fontWeight="medium"
                  color="black"
                  py="1"
                >
                  <Icon as={BsWordpress} boxSize="4" /> {'  '}
                  {integration.type}
                </Text>
              </Td>
              <Td>
                <Text color="muted">{integration.host}</Text>
              </Td>
              <Td>
                <Text color="muted">{integration.username}</Text>
              </Td>
              <Td>
                <HStack spacing="1">
                  <IconButton
                    onClick={() => handleDeleteClick(integration?.id as number)}
                    icon={<TbTrash fontSize="1.25rem" />}
                    variant="ghost"
                    aria-label="Delete member"
                  />
                  <IconButton
                    onClick={() => handleEdit(integration?.id as number)}
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

const TableSkeleton = (props: TableProps) => {
  const rowsCount = 5;
  const columnsCount = 5;

  return (
    <Table variant="simple" w="100%" {...props}>
      <Thead>
        <Tr>
          {Array.from({ length: columnsCount }).map((_, i) => (
            <Th key={i}>
              <Skeleton height="20px" />
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody w="100%">
        {Array.from({ length: rowsCount }).map((_, i) => (
          <Tr key={i}>
            {Array.from({ length: columnsCount }).map((_, i) => (
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

const Overlay = () => (
  <ModalOverlay
    bg="none"
    backdropFilter="auto"
    backdropInvert="30%"
    backdropBlur="2px"
  />
);
