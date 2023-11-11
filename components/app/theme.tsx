import { theme as proTheme } from '@chakra-ui/pro-theme';
import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

export const theme = extendTheme(
  {
    initialColorMode: 'dark',
    useSystemColorMode: true,
    colors: {
      ...proTheme.colors,
      brand: {
        600: '#591da9',
        500: '#8665BE',
        400: '#d10085',
        50: '#E2D7F4'
      },
      primary: {
        '50': '#f9f6fc',
        '100': '#e6dcf2',
        '200': '#d0bee6',
        '300': '#b59ad9',
        '400': '#a686d1',
        '500': '#926ac6',
        '600': '#8052bd',
        '700': '#6b36b2',
        '800': '#5c22ab',
        '900': '#431680'
      },
      secondary: {
        '50': '#faf6fe',
        '100': '#edd9f9',
        '200': '#dcb8f4',
        '300': '#c88fee',
        '400': '#bc76ea',
        '500': '#ab53e5',
        '600': '#992fe0',
        '700': '#7d04ce',
        '800': '#6b03b0',
        '900': '#4f0282'
      },
      tertiary: {
        '50': '#fdf5fa',
        '100': '#f8d7ec',
        '200': '#f1b3db',
        '300': '#e985c4',
        '400': '#e468b7',
        '500': '#db38a0',
        '600': '#ca0081',
        '700': '#a40069',
        '800': '#8c0059',
        '900': '#680042'
      }
    },
    fonts: {
      heading: `'Roboto', sans-serif`,
      body: `'Roboto', sans-serif`
    },
    shadows: {
      'brand-400': '0 0 40px 1px var(--chakra-colors-brand-400)',
      'brand-600': '0 0 20px 1px var(--chakra-colors-brand-600)',
      'whiteAlpha-300': '0 0 40px 1px var(--chakra-colors-whiteAlpha-500)'
    }
  } as ThemeConfig,
  proTheme
);
