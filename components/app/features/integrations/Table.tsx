import {
  Box,
  Button,
  ButtonGroup,
  Container,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useBreakpointValue
} from '@chakra-ui/react';
import * as React from 'react';
import { IntegrationTable } from './IntegrationTable';
import { useGetIntegrationsByUser } from '@/lib/hooks';
import { useUser } from '@supabase/auth-helpers-react';
import { useDebounce } from '@/lib/utils/hooks';
import { TbSearch } from 'react-icons/tb';

export const DocsTableContainer = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const user = useUser();
  const [page, setPage] = React.useState(1);
  const [query, setQuery] = React.useState('');

  const debouncedQuery = useDebounce(query, 500);

  let { data } = useGetIntegrationsByUser({
    userId: user?.id as string,
    pageSize: 5,
    page: page,
    query: debouncedQuery,
    sortBy: 'created_at',
    ascending: false,
    enabled: !!user
  });

  const { integrations, total, hasMore, hasLess } = data || {};

  const showedItems = integrations?.length || 0;

  const handleNext = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  const handlePrevious = () => {
    if (hasLess) {
      setPage(page - 1);
    }
  };

  return (
    <Container py={{ base: '4', md: '8' }} px={{ base: '0' }}>
      <Box
        bg="bg-surface"
        className="border border-gray-300"
        borderRadius={useBreakpointValue({ base: 'none', md: 'lg' })}
      >
        <Stack spacing="5">
          <Box px={{ base: '4', md: '6' }} pt="5">
            <Stack
              direction={{ base: 'column', md: 'row' }}
              justify="space-between"
            >
              <Text fontSize="lg" fontWeight="medium">
                {/* Do */}
              </Text>
              <InputGroup maxW="xs">
                <InputLeftElement pointerEvents="none">
                  <Icon as={TbSearch} color="muted" boxSize="5" />
                </InputLeftElement>
                <Input
                  placeholder="Buscar"
                  onChange={(e) => setQuery(e.target.value)}
                />
              </InputGroup>
            </Stack>
          </Box>
          <Box overflowX="auto">
            <IntegrationTable data={data} />
          </Box>
          <Box px={{ base: '4', md: '6' }} pb="5">
            <HStack spacing="3" justify="space-between">
              {!isMobile && (
                <Text color="muted" fontSize="sm">
                  Mostrando {showedItems} de {total}{' '}
                  {total === 1 ? 'resultado' : 'resultados'}
                </Text>
              )}
              <ButtonGroup
                spacing="3"
                justifyContent="space-between"
                width={{ base: 'full', md: 'auto' }}
                variant="secondary"
              >
                <Button onClick={handlePrevious} isDisabled={!hasLess}>
                  Anterior
                </Button>
                <Button onClick={handleNext} isDisabled={!hasMore}>
                  Siguiente
                </Button>
              </ButtonGroup>
            </HStack>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default DocsTableContainer;
