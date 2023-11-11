import {
  As,
  Link,
  Button,
  ButtonProps,
  HStack,
  Badge,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import * as React from 'react';
import NextLink from 'next/link';
import {jullietGradient} from '@/lib/utils/gradient';

interface NavButtonProps extends ButtonProps {
  icon: As;
  label: string;
  href: string;
  isActive?: boolean;
  showText?: boolean;
  isDesktop?: boolean;
  target?: string;
  showProBadge?: boolean;
}

export const NavButton = (props: NavButtonProps) => {
  const {
    icon,
    label,
    href,
    isActive,
    showText,
    target,
    isDesktop,
    bg,
    showProBadge = false,
    ...buttonProps
  } = props;

  return (
    <NextLink
      href={showProBadge ? '/app/billing' : href}
      target={target}>
      <Button
        variant="primary-on-accent"
        justifyContent="start"
        {...buttonProps}
        _hover={{
          bg: 'brand.400',
          color: 'white'
        }}
        bg={bg ? bg : isActive ? 'brand.600' : 'transparent'}
        color={useColorModeValue(isActive ? 'white' : 'brand.600', 'white')}
        w="100%"
      >
        <HStack spacing="3">
          <Icon as={icon} boxSize="6" color="primary" />
          {(showText || !isDesktop) && <Link as="div">{label}</Link>}
          {showProBadge && showText && (
            <Badge
              colorScheme="brand"
              variant="solid"
              fontSize="xs"
              px="2"
              py="1"
              borderRadius="md"
              {...jullietGradient}
            >
              Pro
            </Badge>
          )}
        </HStack>
      </Button>
    </NextLink >
  );
};
