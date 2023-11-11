import {useEffect, useReducer} from 'react';

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
  SimpleGrid,
  GridItem,
  Icon,
  Input,
  FormErrorMessage
} from '@chakra-ui/react';

import {useGetIntegrationsByUser, usePublishDocument} from '@/lib/hooks';

import React from 'react';
import {useUser} from '@supabase/auth-helpers-react';
import {useRouter} from 'next/router';
import {TbCirclePlus} from 'react-icons/tb';
import {IIntegration} from '@/types';
import {useDocDetailStore} from '@/lib/store';
import JullietOk from '../../ui/julliet/icons/JullietOK';

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'add':
      return {...state, [action.name]: action.value};
    default:
      return state;
  }
};

const initialState = {
  integration_id: '',
  status: 'draft',
  publishDate: ''
};

function DocPublishDrawer({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const user = useUser();
  const store = useDocDetailStore();

  const {data} = useGetIntegrationsByUser({
    userId: user?.id as string,
    pageSize: 100,
    enabled: !!user?.id
  });

  const integrations = data?.integrations;

  const {
    mutate: publishDocument,
    isLoading: isPublishing,
    isSuccess: isPublished,
    isError: isPublishError
  } = usePublishDocument();

  useEffect(() => {
    if (isPublished) {
      onClose();
      store.setModalMessage('Tu documento ha sido publicado');
      store.setModalTitle('Publicado');
      store.setModalIcon(JullietOk);
      store.setModalMessage('Tu documento ha sido publicado');
      store.onModalOpen();
    }
  }, [isPublished]);

  useEffect(() => {
    if (isPublishError) {
      onClose();
      store.setModalMessage('Ha ocurrido un error');
      store.onModalOpen();
    }
  }, [isPublishError]);

  const handleChange = (e: any) => {
    dispatch({type: 'add', name: e.target.name, value: e.target.value});
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    publishDocument({
      documentId: store.document?.id as number,
      integrationId: state.integration_id,
      status: state.status,
      publishDate: state.publishDate
    });
  };

  const isIntegrationError = state.integration_id === '';
  const isStatusError = state.status === '';
  const isPublishDateError =
    state.publishDate === '' && state.status === 'future';

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          <Icon as={TbCirclePlus} boxSize="5" mr="2" />
          Publicar documento
          <Text fontSize="md" color="gray.500" my="6">
            Hora de publicar tu primer documento, selecciona en que integración
            quieres publicarlo.
          </Text>
        </DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody pb={6}>
          <SimpleGrid columns={2} spacing={6} columnGap={3}>
            <GridItem colSpan={2}>
              <FormControl isRequired isInvalid={isIntegrationError}>
                <FormLabel>Integración</FormLabel>
                <Select
                  name="integration_id"
                  placeholder="Selecciona una integración"
                  onChange={handleChange}
                >
                  {integrations?.map((integration: IIntegration) => (
                    <option key={integration.id} value={integration.id}>
                      {integration.name}
                    </option>
                  ))}
                </Select>
                {isIntegrationError && (
                  <FormErrorMessage>
                    {' '}
                    Debes seleccionar una integración
                  </FormErrorMessage>
                )}
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl isRequired isInvalid={isStatusError}>
                <FormLabel>¿Cuando quieres publicarlo?</FormLabel>
                <Select
                  name="status"
                  placeholder="Selecciona una opción"
                  onChange={handleChange}
                >
                  <option value="draft">Ahora, como borrador</option>
                  <option value="publish">Ahora, como publicado</option>
                  <option value="private">Ahora, como privado</option>
                  <option value="future">Luego, programar</option>
                </Select>
                {isPublishDateError && (
                  <FormErrorMessage>
                    Necesitamos saber cuando publicarlo
                  </FormErrorMessage>
                )}
              </FormControl>
            </GridItem>

            {state.status === 'future' && (
              <GridItem colSpan={2}>
                <FormControl isRequired>
                  <FormLabel>Fecha de publicación</FormLabel>
                  <Input
                    name="publish_date"
                    type="datetime-local"
                    onChange={handleChange}
                  />
                  {isStatusError && (
                    <FormErrorMessage>
                      Necesitamos saber la fecha de publicación
                    </FormErrorMessage>
                  )}
                </FormControl>
              </GridItem>
            )}
          </SimpleGrid>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            isLoading={isPublishing}
            colorScheme="purple"
            ml={3}
            onClick={handleSubmit}
          >
            Publicar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default DocPublishDrawer;
