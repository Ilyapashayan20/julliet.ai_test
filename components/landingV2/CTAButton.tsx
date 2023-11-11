import {Box, Button, LightMode, keyframes} from '@chakra-ui/react';
import Link from 'next/link';

const bgGradientAnimation = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;

const CTAButton = ({
  children,
  isDisabled,
  w = '250px',
  href = '/register',
  ...props
}: any) => {
  const filter =
    props.filter ||
    'drop-shadow(0px 0px 20px var(--chakra-colors-whiteAlpha-300)) brightness(1.18)';
  return (
    <Box {...props} w={w}>
      <LightMode>
        <Link href={href}>
          <Button
            as="div"
            size="lg"
            color="whiteAlpha.900"
            w="full"
            fontWeight="bold"
            fontSize="md"
            filter={filter}
            cursor="pointer"
            isDisabled={isDisabled}
            bgSize="400% 400%"
            bgGradient="linear(to-r, brand.200, brand.600, brand.400)"
            _hover={{
              bgGradient: 'linear(to-l, brand.200, brand.600, brand.400)'
            }}
            animation={`${bgGradientAnimation} 7s ease infinite`}
          >
            {children}
          </Button>
        </Link>
      </LightMode>
    </Box>
  );
};

export default CTAButton;
