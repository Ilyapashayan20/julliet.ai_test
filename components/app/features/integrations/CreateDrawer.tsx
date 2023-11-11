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
  Input,
  SimpleGrid,
  GridItem,
  Icon,
  InputGroup,
  InputRightElement,
  Link
} from '@chakra-ui/react';

import { useCreateIntegration, useUpdateIntegration } from '@/lib/hooks';

import React from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { TbCirclePlus } from 'react-icons/tb';
import { useIntegrationStore } from '@/lib/store';

function CreateDrawer({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const store = useIntegrationStore();

  const [showPassword, setShowPassword] = React.useState(false);
  const user = useUser();

  const handleChange = (e: any) => {
    store.setIntegration({
      ...store.integration,
      [e.target.name]: e.target.value
    });
  };

  const handleShowPassword = () => setShowPassword(!showPassword);
  const createIntegration = useCreateIntegration();
  const updateIntegration = useUpdateIntegration();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (user) {
      const payload = {
        ...store.integration,
        user_id: user.id
      };

      if (store.isEditing) {
        updateIntegration(payload, {
          onSuccess: () => {
            store.setDrawerIsOpen(false);
            store.setIsEditing(false);
          }
        });
      } else {
        createIntegration(
          { payload },
          {
            onSuccess: (data) => {
              onClose();
            }
          }
        );
      }
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="sm">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>
          <Icon as={TbCirclePlus} boxSize="5" mr="2" />
          Nueva integración
          <Text fontSize="md" my="6">
            Para crear una integración, necesitas un{' '}
            <Text as="span" color="brand.400">
              {' '}
              Wordpress Application Token
            </Text>
            , para ello necesitas seguir los pasos descritos{' '}
            <Link href="https://www.google.com" color="brand.400" isExternal>
              aquí
            </Link>
          </Text>
        </DrawerHeader>
        <DrawerCloseButton />
        <DrawerBody pb={6}>
          <SimpleGrid columns={2} spacing={6} columnGap={3}>
            <GridItem colSpan={2}>
              <FormControl isRequired>
                <FormLabel>Nombre</FormLabel>
                <Input
                  name="name"
                  value={store.integration.name}
                  placeholder="Blog de Juan"
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl isRequired>
                <FormLabel>Tipo</FormLabel>
                <Select
                  name="type"
                  placeholder="Selecciona un tipo"
                  onChange={handleChange}
                  value={store.integration.type}
                  defaultValue="wordpress"
                >
                  <option value="wordpress">Wordpress</option>
                </Select>
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel>Host</FormLabel>
                <Input
                  name="host"
                  value={store.integration.host}
                  placeholder="https://blogdejuan.com/wp-json"
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl isRequired>
                <FormLabel>Usuario</FormLabel>
                <Input
                  name="username"
                  value={store.integration.username}
                  placeholder="juan"
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl isRequired>
                <FormLabel>Contraseña</FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    placeholder="juan password"
                    value={store.integration.password}
                    onChange={handleChange}
                    type={showPassword ? 'text' : 'password'}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </GridItem>
          </SimpleGrid>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            bgColor="brand.600"
            color="white"
            ml={3}
            onClick={handleSubmit}
          >
            {store.isEditing ? 'Actualizar' : 'Crear'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default CreateDrawer;
