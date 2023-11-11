import React from 'react';
import {
  Box,
  HStack,
  keyframes,
  usePrefersReducedMotion
} from '@chakra-ui/react';

export default function Dots(props: any) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const animation1 = prefersReducedMotion
    ? undefined
    : `${keyframe_dot1} infinite 1s linear`;
  const animation2 = prefersReducedMotion
    ? undefined
    : `${keyframe_dot2} infinite 1s linear`;
  const animation3 = prefersReducedMotion
    ? undefined
    : `${keyframe_dot3} infinite 1s linear`;

  const styles = createStyles(props.size, props.color);
  const color = props.color || '#591da9';

  return (
    <Box {...props}>
      <HStack>
        {/* @ts-ignore */}
        <Box style={styles.dot1} animation={animation1} bg={color} />
        <Box style={styles.dot2} animation={animation2} bg={color} />
        <Box style={styles.dot3} animation={animation3} bg={color} />
      </HStack>
    </Box>
  );
}

const keyframe_dot1 = keyframes`
  0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1, 1.5);
  }
  50% {
    transform: scale(1, 0.67);
  }
  75% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1, 1);
  }
`;
const keyframe_dot2 = keyframes`
 0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1, 1.5);
  }
  75% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1, 1);
  }
`;
const keyframe_dot3 = keyframes`
 0% {
    transform: scale(1, 1);
  }
  25% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1, 0.67);
  }
  75% {
    transform: scale(1, 1.5);
  }
  100% {
    transform: scale(1, 1);
  }
`;

const createStyles = (size: number, color: string) => {
  return {
    dot1: {
      position: 'relative',
      width: size,
      height: size,
      borderRadius: '6px',
      // backgroundColor: '#591da9',
      // color: '#97144D',
      display: ' inline-block',
      margin: '0 2px'
    },
    dot2: {
      width: size,
      height: size,
      borderRadius: '5px',
      // backgroundColor: '#591da9',
      // color: '#97144D',
      display: 'inline-block',
      margin: '0 2px'
    },

    dot3: {
      width: size,
      height: size,
      borderRadius: '5px',
      // backgroundColor: '#591da9',
      display: 'inline-block',
      margin: '0 2px'
    }
  };
};
