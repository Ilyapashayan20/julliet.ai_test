import {
  Box,
  Icon,
  chakra,
  IconButton,
  IconButtonProps
} from '@chakra-ui/react';
import * as React from 'react';
import { MdMenu } from 'react-icons/md';

const Bar = chakra('span', {
  baseStyle: {
    display: 'block',
    pos: 'absolute',
    w: '1.25rem',
    h: '0.125rem',
    rounded: 'full',
    bg: 'currentcolor',
    mx: 'auto',
    insetStart: '0.125rem',
    transition: 'all 0.12s'
  }
});

const ToggleIcon = (props: { active: boolean }) => {
  const { active } = props;
  return (
    <Box
      className="group"
      data-active={active ? '' : undefined}
      as="span"
      display="block"
      w="1.5rem"
      h="1.5rem"
      pos="relative"
      aria-hidden
      pointerEvents="none"
      mt="3"
    >
      <Icon as={MdMenu} boxSize="6" />
    </Box>
  );
};

interface ToggleButtonProps extends IconButtonProps {
  isOpen: boolean;
}

export const ToggleButton = (props: ToggleButtonProps) => {
  const { isOpen, ...iconButtonProps } = props;
  return (
    <IconButton
      position="relative"
      variant="unstyled"
      size="sm"
      color="on-accent"
      zIndex="skipLink"
      icon={<ToggleIcon active={isOpen} />}
      {...iconButtonProps}
    />
  );
};
