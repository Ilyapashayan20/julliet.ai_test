import { useDocDetailStore } from '@/lib/store';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Icon,
  HStack
} from '@chakra-ui/react';

function InfoModal(props: { isOpen: boolean; onClose: () => void }) {
  const store = useDocDetailStore();

  return (
    <>
      <Modal onClose={() => props.onClose()} isOpen={props.isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{store.modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack spacing="8">
              {store.modalIcon}
              <Text>{store.modalMessage}</Text>
            </HStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={() => props.onClose()}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default InfoModal;
