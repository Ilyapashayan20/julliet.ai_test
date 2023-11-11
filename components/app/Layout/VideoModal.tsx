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
  Checkbox,
  Text,
  Divider,
  Spacer
} from '@chakra-ui/react';
import { useState } from 'react';

const VideoModal = ({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { user } = useUser();
  const [isChecked, setIsChecked] = useState(false);

  const { mutate: setTutorialSeen } = useSetTutorialSeen();
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setIsChecked(true);
    }
  };

  const handleModalClose = () => {
    if (isChecked) {
      setTutorialSeen(user?.id as string);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Bienvenido a Julliet</ModalHeader>
        <ModalBody>
          <Text mb={4}>Genera un post de blog en menos de 1 minuto.</Text>
          <Center>
            <iframe
              src="https://www.veed.io/embed/489fd212-0de4-498c-a9b6-99e49db8d6e9"
              width="744"
              height="504"
              frameBorder="0"
              title="Julliet - Generación de contenido en segundos"
              allowFullScreen
            />
          </Center>
        </ModalBody>
        <ModalFooter>
          <Checkbox onChange={handleCheckboxChange}>
            No volver a mostrar
          </Checkbox>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VideoModal;
