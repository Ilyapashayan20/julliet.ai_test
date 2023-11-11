import {
  Button,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
  useBreakpointValue
} from '@chakra-ui/react';
import * as React from 'react';

import IntegrationsTable from '@/components/app/features/integrations/Table';
import CreateDrawer from '@/components/app/features/integrations/CreateDrawer';
import { TbCirclePlus } from 'react-icons/tb';
import Layout from '@/components/app/Layout';
import { useIntegrationStore } from '@/lib/store';

export const App = () => {
  const store = useIntegrationStore();

  return (
    <Layout>
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
                Integraciones
              </Heading>
              <Text color="muted">
                Conecta Julliet con tus herramientas favoritas para publicar tus
                documentos rapidamente
              </Text>
            </Stack>
            <HStack spacing="3">
              <Button
                variant="primary"
                onClick={() => store.setDrawerIsOpen(true)}
                leftIcon={<TbCirclePlus />}
                bgColor="brand.600"
                color="white"
              >
                Nueva integración
              </Button>
            </HStack>
          </Stack>
          <Stack spacing={{ base: '5', lg: '6' }}>
            <IntegrationsTable />
          </Stack>
        </Stack>
      </Container>
      <CreateDrawer
        isOpen={store.drawerIsOpen}
        onClose={() => store.setDrawerIsOpen(false)}
      />
    </Layout>
  );
};

export default App;
