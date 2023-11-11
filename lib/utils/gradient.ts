import {keyframes} from '@chakra-ui/react';


const jullietFilter = 'drop-shadow(0px 0px 20px var(--chakra-colors-whiteAlpha-300)) brightness(1.18)';

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

const jullietAnimation = `${bgGradientAnimation} 3s ease infinite`


const jullietGradient = {
    bgSize: "200% auto",
    bgGradient: "linear(to-r, brand.200, brand.600, brand.400)",
    animation: jullietAnimation,
    filter: jullietFilter
}

export {jullietGradient};
