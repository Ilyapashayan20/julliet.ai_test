import Image from 'next/image';
import logoImage from '@/images/julliet-3d-logo.png';
import logoImagePro from '@/images/julliet-3d-logo-pro.png';
import logoImageWhite from '@/images/julliet-3d-logo-white.png';
import logoImageProWhite from '@/images/julliet-3d-logo-white-pro.png';
import logoImagotipo from '@/images/imagotipo.png';
import logoImagotipoPro from '@/images/imagotipo-pro.png';
import { Box, useColorMode } from '@chakra-ui/react';
import { useUser } from '@/lib/utils/useUser';

export default function LogoV2(props: any) {
  let { colorMode, w, h, imagotype, href, ...rest } = props;
  const colorConfig = useColorMode();
  colorMode = colorMode || colorConfig.colorMode;
  const { isPro } = useUser();

  const darkLogo = isPro ? logoImageProWhite : logoImageWhite;
  const lightLogo = isPro ? logoImagePro : logoImage;
  const imagotipo = isPro ? logoImagotipoPro : logoImagotipo;

  w = { base: '120px', md: '180px' };
  // TODO: Refactor this
  let logo = colorMode == 'dark' ? darkLogo : lightLogo;
  if (imagotype) {
    logo = imagotipo;
    w = 54;
    rest.ml = 0.4;
  }

  href = href || '/';

  return (
    <Box as="a" href={href} display="inline-block" w={w} {...rest}>
      <Image src={logo} alt="Julliet Logo" />
    </Box>
  );
}
