import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Text,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  useBreakpointValue
} from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { MdArrowDropDown, MdExitToApp } from 'react-icons/md';

interface UserProfileProps {
  name: string;
  image: string;
  email: string;
  isCollapsed?: boolean;
}

export const UserProfile = (props: UserProfileProps) => {
  const { name, image, email, isCollapsed } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const showText = isMobile || (!isMobile && !isCollapsed);

  const shortEmail =
    email && email.length > 18 ? email.slice(0, 18) + '...' : email;
  return (
    <Menu>
      <MenuButton>
        <Stack spacing="3" ps="2" direction="row" align="center">
          <Avatar name={name} src={image} boxSize="10" />
          {showText && (
            <Box>
              <Text
                maxW={160}
                fontWeight="medium"
                className="truncate"
                fontSize="sm"
              >
                {name}
              </Text>
              <Text title={email} maxW={160} className="truncate" fontSize="sm">
                {shortEmail}
              </Text>
            </Box>
          )}
          {!isCollapsed && (
            <IconButton
              as="span"
              variant="ghost"
              icon={<MdArrowDropDown />}
              aria-label="Toggle color mode"
              onClick={() => toggleColorMode()}
            />
          )}
        </Stack>
      </MenuButton>
      <MenuList>
        <MenuItem>
          <Stack
            onClick={() => {
              toggleColorMode();
            }}
            direction="row"
            align="center"
            justify="space-evenly"
          >
            <IconButton
              as="span"
              variant="ghost"
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              aria-label="Toggle color mode"
            />
            <Text>Modo {colorMode === 'light' ? 'Oscuro' : 'Claro'}</Text>
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={async () => {
            await supabaseClient.auth.signOut();
            router.push('/');
          }}
        >
          <Stack direction="row" align="center" justify="space-evenly">
            <IconButton
              as="span"
              variant="ghost"
              icon={<MdExitToApp />}
              aria-label="Toggle color mode"
              onClick={toggleColorMode}
            />
            <Text>Cerrar Sesión</Text>
          </Stack>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
