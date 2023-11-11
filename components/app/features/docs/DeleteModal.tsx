import * as React from 'react';

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
  Text
} from '@chakra-ui/react';

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
              ¿Estas seguro que quieres eliminar este documento?
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

export default DeleteModal;
