import {useEffect} from 'react';
import {Navbar} from './Navbar';
import {Sidebar} from './Sidebar';
import Banner from './Banner';

import {
  Center,
  Flex,
  Stack,
  useBreakpointValue,
  useColorMode,
  useDisclosure
} from '@chakra-ui/react';
import {useAppStore} from '@/lib/store';
import {useUser} from '@/lib/utils/useUser';
import {ISubscription} from '@/types';
import {useRouter} from 'next/router';
import {MdApi, MdChat, MdMenuBook,MdPalette } from 'react-icons/md';
import {NextSeo} from 'next-seo';
import {TopBanner} from './TopBanner';

const paths = [
  {
    name: 'Artículos',
    path: '/app/docs',
    icon: MdMenuBook,
    exact: true,
    isPro: false
  },
  {
    name: 'Chat',
    path: '/app/chat',
    icon: MdChat,
    exact: true,
    isPro: false
  },
  {
    name: 'Integraciones',
    path: '/app/integrations',
    icon: MdApi,
    exact: true,
    isPro: true
  },
  {
    name: 'Art',
    path: '/app/art',
    icon: MdPalette,
    exact: true,
    isPro: false
  }
  // {
  //   name: 'Imágenes',
  //   path: '/app/images',
  //   icon: TbPhoto,
  //   exact: true
  // }
];

interface LayoutProps extends React.ComponentPropsWithoutRef<'div'> {
  showBanner?: boolean;
  children: React.ReactNode;
  props?: any;
}

const Layout = ({children, showBanner = false, ...props}: LayoutProps) => {
  const isDesktop = useBreakpointValue({base: false, lg: true});
  const appStore = useAppStore();
  const {isPro, wordCount, isLoading} = useUser();

  useEffect(() => {
    if (isPro) {
      appStore.showTopBanner = false;
    }
  }, [isPro]);

  const {toggleColorMode} = useColorMode();
  useEffect(() => {
    if (localStorage.getItem('isFirstTime') === null) {
      toggleColorMode();
      localStorage.setItem('isFirstTime', 'false');
    }
  }, []);

  const router = useRouter();
  const pageTitle = paths.find((path) =>
    router.pathname.includes(path.path)
  )?.name;
  const title = pageTitle ? `${pageTitle} | Julliet.ai` : 'Julliet.ai';

  const marginTop = useBreakpointValue({base: '2', lg: '0'});
  const marginTopWithBanner = useBreakpointValue({
    base: '80px',
    md: 8
  });
  return (
    <>
      {appStore.showTopBanner && <TopBanner />}
      <Flex
        mt={appStore.showTopBanner ? marginTopWithBanner : marginTop}
        as="section"
        direction={{base: 'column', lg: 'row'}}
        height="100vh"
        overflowY={isDesktop ? 'auto' : 'hidden'}
        {...props}
      >
        <NextSeo title={title} />
        {/* <VideoModal isOpen={isOpen} onClose={onClose} /> */}
        {isDesktop ? <Sidebar paths={paths} /> : <Navbar paths={paths} />}
        <Stack maxW="100%" w="100%" overflowY={isDesktop ? 'auto' : 'auto'}>
          {children}
          {showBanner && (
            <Center>
              <Banner credits={isLoading ? 0 : wordCount} isPro={isPro} />
            </Center>
          )}
        </Stack>
      </Flex>
    </>
  );
};

export default Layout;
