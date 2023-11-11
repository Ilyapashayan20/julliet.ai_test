import { useSetTutorialSeen } from '@/lib/hooks';
import { useLandingStore } from '@/lib/store';
import { useUser } from '@/lib/utils/useUser';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Center,
  Checkbox
} from '@chakra-ui/react';

const VideoModal = ({ isOpen }: { isOpen?: boolean }) => {
  const store = useLandingStore();
  isOpen = isOpen || store.isModalOpen;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => store.onModalClose()}
      size="4xl"
      isCentered
    >
      <ModalOverlay />
      <ModalContent bg="transparent" shadow="none" border="none">
        <ModalCloseButton />
        <ModalBody bgColor="transparent">
          <Center>
            <iframe
              src="https://www.veed.io/embed/489fd212-0de4-498c-a9b6-99e49db8d6e9"
              width="744"
              height="504"
              frameBorder="0"
              title="Julliet - Generaci�n de contenido en segundos"
              allowFullScreen
            />
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default VideoModal;
