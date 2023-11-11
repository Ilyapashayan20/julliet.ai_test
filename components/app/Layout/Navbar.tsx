import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  useDisclosure
} from '@chakra-ui/react';
import * as React from 'react';
import LogoV2 from '@/components/ui/LogoV2';
import {Sidebar} from './Sidebar';
import {ToggleButton} from './ToggleButton';

export const Navbar = ({paths}: any) => {
  const {isOpen, onToggle, onClose} = useDisclosure();
  return (
    <Box
      width="full"
      py="4"
      px={{base: '4', md: '8'}}
      bg={{light: 'white', dark: 'gray.800'}}
    >
      <Flex justify="space-between">
        <LogoV2 />
        <ToggleButton
          isOpen={isOpen}
          aria-label="Open Menu"
          onClick={onToggle}
          color={{light: 'gray.800', dark: 'white'}}
        />
        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          isFullHeight
          preserveScrollBarGap
          // Only disabled for showcase
          trapFocus={false}
        >
          <DrawerOverlay />
          <DrawerContent maxW="240px">
            <Sidebar paths={paths} />
          </DrawerContent>
        </Drawer>
      </Flex>
    </Box>
  );
};
