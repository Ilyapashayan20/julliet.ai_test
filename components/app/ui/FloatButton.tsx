import {
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  Button,
  Center,
  Stack,
  Icon
} from '@chakra-ui/react';
import * as React from 'react';
import JullietPowerIcon from '@/components/app/ui/julliet/icons/JullietPower';
import {jullietGradient} from '@/lib/utils/gradient';

const FloatButton = ({children}: {children: React.ReactNode}) => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        bg="brand.600"
        color="white"
        position="fixed"
        rounded="full"
        bottom="40px"
        right={['16px', '60px']}
        w="60px"
        h="60px"
        _expanded={{bg: 'brand.500'}}
        _hover={{bg: 'brand.500'}}
        {...jullietGradient}
      >
        <Center>
          <Icon as={JullietPowerIcon} boxSize="6" />
        </Center>
      </MenuButton>
      <MenuList
        position="fixed"
        bottom="70px"
        right={['10px', '0px']}
        bg="transparent"
        border="none"
        shadow="none"
        color="black"
      >
        <MenuGroup>
          <Stack spacing="2">{children}</Stack>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};

export default FloatButton;
