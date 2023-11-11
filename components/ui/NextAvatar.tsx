import NextImage from 'next/image';
import {Box, Flex, Text} from '@chakra-ui/react';

const NextAvatar = ({src, name, ...rest}: any) => {
  const {w = 12} = rest;
  return (
    <Box
      position="relative"
      overflow="hidden"
      rounded="full"
      w={w}
      h={w}
      bg="gray.100"
      title={name}
      border="2px solid white"
      {...rest}
    >
      <NextImage
        src={src}
        alt={name}
        fill
        style={{objectFit: 'cover', objectPosition: 'center'}}
      />
      <Text ml="2" fontWeight="medium">
        {name}
      </Text>
    </Box>
  );
};

export default NextAvatar;
