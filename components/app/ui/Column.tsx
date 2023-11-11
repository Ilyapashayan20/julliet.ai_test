import {
  Button,
  ButtonProps,
  Flex,
  FlexProps,
  Heading,
  HeadingProps,
  IconButton,
  IconButtonProps,
  useColorModeValue
} from '@chakra-ui/react';

import {
  Link,
  Stack,
  StackProps,
  Text,
  useColorModeValue as mode
} from '@chakra-ui/react';

export const ColumnHeader = (props: FlexProps) => (
  <Flex
    minH="12"
    position="sticky"
    zIndex={1}
    top="0"
    px="3"
    align="center"
    bg={useColorModeValue('white', 'gray.800')}
    color={useColorModeValue('gray.700', 'white')}
    {...props}
  />
);

export const ColumnHeading = (props: HeadingProps) => (
  <Heading fontWeight="bold" fontSize="sm" lineHeight="1.25rem" {...props} />
);

export const ColumnButton = (props: ButtonProps) => (
  <Button
    variant="outline"
    size="sm"
    fontSize="xs"
    _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
    _active={{ bg: useColorModeValue('gray.200', 'gray.600') }}
    _focus={{ boxShadow: 'none' }}
    _focusVisible={{ boxShadow: 'outline' }}
    {...props}
  />
);

export const ColumnIconButton = (props: IconButtonProps) => (
  <IconButton
    size="sm"
    fontSize="md"
    variant="ghost"
    _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
    _active={{ bg: useColorModeValue('gray.200', 'gray.600') }}
    _focus={{ boxShadow: 'none' }}
    _focusVisible={{ boxShadow: 'outline' }}
    {...props}
  />
);

export const ColumnSidebar = (props: StackProps) => (
  <Stack spacing={{ base: '1px', lg: '1' }} px={{ lg: '3' }} py="3" {...props}>
    {posts.map((post) => (
      <Link
        key={post.id}
        aria-current={post.id === '2' ? 'page' : undefined}
        _hover={{ textDecoration: 'none', bg: mode('gray.100', 'gray.700') }}
        _activeLink={{ bg: 'gray.700', color: 'white' }}
        borderRadius={{ lg: 'lg' }}
      >
        <Stack
          spacing="1"
          py={{ base: '3', lg: '2' }}
          px={{ base: '3.5', lg: '3' }}
          fontSize="sm"
          lineHeight="1.25rem"
        >
          <Text fontWeight="medium">{post.title}</Text>
          <Text opacity={0.8}>{post.excerpt}</Text>
          <Text opacity={0.6}>{post.publishedAt}</Text>
        </Stack>
      </Link>
    ))}
  </Stack>
);

export const posts = [
  {
    id: '1',
    title: "For Heaven's Cakes!",
    excerpt:
      'Marzipan lemon drops pastry brownie ice cream croissant sesame snaps candy danish.',
    publishedAt: 'November 8, 2021'
  },
  {
    id: '2',
    title: 'The shape of a cupcake',
    excerpt:
      'Muffin cupcake sweet roll cake candy dragée jujubes toffee icing.',
    publishedAt: 'October 23, 2021'
  },
  {
    id: '3',
    title: 'Sweet Thang Cupcakes',
    excerpt: 'Lemon drops sesame snaps muffin lemon drops soufflé carrot cake.',
    publishedAt: 'November 12, 2021'
  },
  {
    id: '4',
    title: 'Cupcake Boulevard',
    excerpt: 'Bear claw jujubes chupa chups pie croissant liquorice muffin.',
    publishedAt: 'Juli 22, 2021'
  },
  {
    id: '5',
    title: 'Red Velvet Bakery',
    excerpt:
      ' Sesame snaps croissant powder dragée bonbon muffin tart dessert croissant.',
    publishedAt: 'June 1, 2021'
  },
  {
    id: '6',
    title: 'Cupcake Bakeoff',
    excerpt:
      ' Jelly gummies gummi bears powder muffin cookie gingerbread wafer.',
    publishedAt: 'February 4, 2021'
  },
  {
    id: '7',
    title: 'Sugar & Spice Cupcake Shop',
    excerpt:
      ' Toffee dessert sesame snaps oat cake powder jelly-o cake danish apple pie.',
    publishedAt: 'February 2, 2021'
  },
  {
    id: '8',
    title: 'My sweet dream',
    excerpt:
      ' Jelly gummies gummi bears powder muffin cookie gingerbread wafer.',
    publishedAt: 'January 18, 2021'
  },
  {
    id: '9',
    title: 'My sweet dream',
    excerpt:
      ' Jelly gummies gummi bears powder muffin cookie gingerbread wafer.',
    publishedAt: 'January 18, 2021'
  }
];
