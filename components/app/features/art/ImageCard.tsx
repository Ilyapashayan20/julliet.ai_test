import {
  AspectRatio,
  Box,
  Image,
  Skeleton,
  Stack,
  StackProps,
  useBreakpointValue
} from '@chakra-ui/react';
import * as React from 'react';
import { FavouriteButton } from './FavouriteButton';
import { LexicaImage } from '@/lib/services/lexica';

interface Props {
  image: LexicaImage;
  rootProps?: StackProps;
}

export const ImageCard = (props: Props) => {
  const { image, rootProps } = props;
  const { srcSmall, prompt } = image;

  return (
    <Stack spacing={useBreakpointValue({ base: '4', md: '5' })} {...rootProps}>
      <Box position="relative">
        <AspectRatio ratio={4 / 3}>
          <Image
            src={srcSmall}
            alt={prompt}
            draggable="false"
            fallback={<Skeleton />}
            borderRadius={useBreakpointValue({ base: 'md', md: 'xl' })}
          />
        </AspectRatio>
        <FavouriteButton
          position="absolute"
          top="4"
          right="4"
          aria-label={`Add ${name} to your favourites`}
        />
      </Box>
    </Stack>
  );
};

export default ImageCard;
