import {
  BoxProps,
  Center,
  chakra,
  Divider,
  List,
  ListItem,
  ListItemProps,
  useBreakpointValue,
} from '@chakra-ui/react';
import {AnimateSharedLayout, motion} from 'framer-motion';
import {
  Box,
  useRadioGroup,
  useRadio,
  createIcon,
  Button,
  Flex,
  Heading,
  Text,
  useColorModeValue as mode
} from '@chakra-ui/react';
import * as React from 'react';
import CTAButton from './CTAButton';
import {useAppStore, useLandingStore} from '@/lib/store';
import {pricing} from '@/components/landingV2/data';
import Image from 'next/image';
import CallCenter from '@/images/landing/call-center.jpeg';
import {useRouter} from 'next/router';
import {useUser} from '@/lib/utils/useUser';

const Pricing = ({
  bgColor,
  color,
  colorMode,
  showHeading = true,
  title,
  subtitle,
  ...props
}: any) => {
  const isDesktop = useBreakpointValue({base: false, md: true});
  const store = useLandingStore();
  const appStore = useAppStore();

  const proPricing =
    store.pricingDuration === 'monthly'
      ? pricing.pro.monthly
      : pricing.pro.yearly;

  const planId =
    store.pricingDuration === 'monthly'
      ? appStore.proPlanMonthlyId
      : appStore.proPlanYearlyId;

  const router = useRouter();
  const isInsideApp = router.pathname.includes('/app');
  return (
    <Box
      id="pricing"
      as="section"
      py={{base: '10', md: '20'}}
      bgColor={bgColor}
      color={color}
      {...props}
    >
      <Box
        maxW={{base: 'xl', md: '5xl'}}
        mx="auto"
        px={{base: '6', md: '8'}}
      >
        <Flex
          direction="column"
          align={{base: 'flex-start', md: 'center'}}
          maxW="2xl"
          mx="auto"
        >
          {showHeading && (
            <>
              <Heading
                as="h1"
                size={{base: 'md', md: '2xl'}}
                letterSpacing="tight"
                fontWeight="extrabold"
                textAlign={{base: 'start', md: 'center'}}
              >
                {title || `¿Listo para empezar?`}

              </Heading>
              <Text
                mt="4"
                fontSize={{base: 'md', md: 'xl'}}
                textAlign={{base: 'left', md: 'center'}}
                color={colorMode === 'light' ? 'gray.200' : 'gray.400'}
              >
                {!!subtitle ? (
                  <>{subtitle}</>
                ) : (

                  <>
                    Nuestros clientes ahorran un promedio de 10 horas por semana de artículos de blog, correos electrónicos y publicaciones en redes sociales
                    <Text
                      as="a"
                      href="#"
                      color={colorMode === 'light' ? 'brand.600' : 'brand.400'}
                      fontWeight="bold"
                    >
                      {' '}
                      en nuestro plan Pro
                    </Text>
                  </>
                )}
              </Text>
            </>
          )}
          <DurationSwitcher mt="10" colorMode={colorMode} />
        </Flex>

        <Flex
          direction={{base: 'column-reverse', lg: 'row'}}
          maxW={{base: '560px', lg: 'unset'}}
          mx="auto"
          mt="10"
          bg={colorMode === 'light' ? 'white' : 'gray.700'}
          rounded="xl"
        >
          <PricingCard
            hidden={isInsideApp && !isDesktop}
            isFree={true}
            flex="1"
            colorScheme="blue"
            bgColor={colorMode === 'light' ? 'white' : 'gray.700'}
            colorMode={colorMode}
            {...pricing.free}
          />
          <Box
            w={{base: 'unset', lg: '1px'}}
            minH="0"
            h={{base: '1px', lg: 'unset'}}
            bg={colorMode === 'light' ? 'gray.100' : 'gray.600'}
          />
          <PricingCard
            flex="1"
            colorScheme="pink"
            planId={planId}
            {...proPricing}
            bgColor={colorMode === 'light' ? 'white' : 'gray.700'}
            color={colorMode === 'light' ? 'white' : 'blackAlpha.800'}
            colorMode={colorMode}
          />
        </Flex>
        {/* <Box */}
        {/*   mt="10" */}
        {/*   px="12" */}
        {/*   py="10" */}
        {/*   bg={colorMode === 'light' ? 'gray.200' : 'gray.700'} */}
        {/*   rounded="xl" */}
        {/* > */}
        {/* <Flex align="center" direction={{base: 'column', md: 'row'}}> */}
        {/*   <Stack w="full" align="center" direction="row" spacing="8"> */}
        {/*     {isDesktop && ( */}
        {/*       <AspectRatio w="full" ratio={0.9}> */}
        {/*         <Image */}
        {/*           quality={80} */}
        {/*           width={400} */}
        {/*           height={400} */}
        {/*           src={CallCenter} */}
        {/*           alt="Call Center" */}
        {/*         /> */}
        {/*       </AspectRatio> */}
        {/*     )} */}
        {/* <Box maxW="400px"> */}
        {/*   <Text fontSize="xl" fontWeight="bold"> */}
        {/*     ¿Necesitas ayuda o tienes alguna pregunta? */}
        {/*   </Text> */}
        {/*   <VStack align="start" spacing="10" mt="4"> */}
        {/*     <Text mt="2"> */}
        {/*       Agenda un meet y te ayudamos a empezar a generar contenido */}
        {/*       para todas tus redes sociales */}
        {/*     </Text> */}
        {/*     <Button */}
        {/*       colorScheme="purple" */}
        {/*       size="lg" */}
        {/*       bgColor="brand.400" */}
        {/*       color="white" */}
        {/*       mt={{base: '6', md: '0'}} */}
        {/*       w={{base: 'full', md: 'auto'}} */}
        {/*       minW="10rem" */}
        {/*       flexShrink={0} */}
        {/*       fontSize="md" */}
        {/*       as="a" */}
        {/*       target="_blank" */}
        {/*       href="https://calendly.com/jullietai/ventas-julliet-ai" */}
        {/*     > */}
        {/*       Agenda una llamada */}
        {/*     </Button> */}
        {/*   </VStack> */}
        {/* </Box> */}
        {/* </Stack> */}
        {/* </Flex> */}
        {/* </Box> */}
      </Box>
    </Box>
  );
};

const ActiveIndicatorImpl = chakra('div', {
  baseStyle: {
    w: 'full',
    h: 'full',
    rounded: 'full',
    pos: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0'
  }
});

const ActiveIndicator = motion(ActiveIndicatorImpl);

const CurvedLine = createIcon({
  viewBox: '0 0 38 20',
  path: (
    <path
      fill="none"
      d="M1.5 18.4H21C29.8366 18.5 37 11.3366 37 2.5V1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
});

export const RadioButton = (props: any & {children?: React.ReactNode}) => {
  const {getInputProps, getCheckboxProps, getLabelProps, state} =
    useRadio(props);

  const {colorMode} = props;

  const activeIndicatorBg = colorMode === 'light' ? 'white' : 'gray.200';

  return (
    <Box as="label" pos="relative" {...getLabelProps()}>
      <input {...getInputProps()} />
      <Center
        {...getCheckboxProps()}
        cursor="pointer"
        pos="relative"
        zIndex={1}
        h="12"
        px="8"
        textAlign="center"
        transition="all 0.2s"
        minW="8rem"
        fontWeight="medium"
        _checked={{
          color: 'brand.400',
          fontWeight: 'bold'
        }}
      >
        {props.children}
      </Center>
      {state.isChecked && (
        <ActiveIndicator
          bg={activeIndicatorBg}
          shadow="md"
          layoutId="highlight"
          transition={{duration: '0.1'}}
        />
      )}
    </Box>
  );
};

export const DurationSwitcher = ({colorMode, ...props}: any) => {
  const store = useLandingStore();

  React.useEffect(() => {
    console.log(store);
  }, [store.pricingDuration]);

  const {getRadioProps, getRootProps} = useRadioGroup({
    defaultValue: 'monthly',
    onChange: handleOnChange
  });

  function handleOnChange(value: string) {
    store.setPricingDuration(value);
  }

  return (
    <Box pos="relative">
      <AnimateSharedLayout>
        <Flex
          display="inline-flex"
          align="center"
          bg={colorMode === 'light' ? 'gray.200' : 'gray.700'}
          rounded="full"
          {...getRootProps(props)}
        >
          <RadioButton
            colorMode={colorMode}
            {...getRadioProps({value: 'monthly'})}
          >
            Mensual
          </RadioButton>
          <RadioButton
            colorMode={colorMode}
            {...getRadioProps({value: 'yearly'})}
          >
            Anual
          </RadioButton>
        </Flex>
      </AnimateSharedLayout>
      <Box
        color={colorMode === 'light' ? 'gray.500' : 'gray.400'}
        pos="absolute"
        right="-8rem"
        top="6"
      >
        <Text color="brand.400" lineHeight="1" fontWeight="bold" mr="10">
          ¡Ahorra 20%!
        </Text>
        <CurvedLine
          color="brand.400"
          fontSize="2.5rem"
          pos="relative"
          right="4"
          bottom="1"
        />
      </Box>
    </Box>
  );
};

const CheckIcon = createIcon({
  viewBox: '0 0 17 12',
  d: 'M0 5.82857L1.64571 4.11429L5.48571 7.2L14.8114 0L16.4571 1.71429L5.48571 12L0 5.82857Z'
});

const PricingDetail = (props: ListItemProps & {iconColor: string}) => {
  const {children, iconColor, ...rest} = props;
  return (
    <ListItem
      display="flex"
      alignItems="flex-start"
      fontWeight="medium"
      maxW="260px"
      {...rest}
    >
      {/* <CheckIcon marginEnd="3" mt="1" color={iconColor} /> */}
      <Text ml="4" as="span" display="inline-block">
        {children}
      </Text>
    </ListItem>
  );
};

interface PricingCardProps extends BoxProps {
  features: string[];
  name: string;
  duration: string;
  extras: string;
  description: string;
  price: string;
  isFree?: boolean;
  planId?: string;
  onClick?: () => void;
  colorScheme: string;
  bgColor?: string;
  colorMode: string;
}

export const PricingCard = (props: PricingCardProps) => {
  const {
    features,
    name,
    description,
    duration,
    price,
    extras,
    onClick,
    isFree = false,
    colorScheme: c,
    bgColor,
    planId,
    colorMode,
    ...rest
  } = props;
  const router = useRouter();

  const insideApp = router.pathname.includes('app');
  const ctaText =
    isFree && insideApp ? 'Ya estas en este plan' : 'Comenzar gratis ➜';

  const {user, subscription} = useUser();

  const isCurrentPlan =
    (user &&
      subscription?.subscription_plan_id ==
      process.env.NEXT_PUBLIC_PADDLE_PLAN_PRO_MONTHLY_ID) ||
    (user &&
      subscription?.subscription_plan_id ==
      process.env.NEXT_PUBLIC_PADDLE_PLAN_PRO_YEARLY_ID);

  const proCtaText = isCurrentPlan ? 'Ya eres PRO' : 'Comenzar gratis ➜';

  const handlePaddleCheckout = () => {
    console.log('isCurrentPlan', isCurrentPlan);
    console.log('current plan', subscription?.subscription_plan_id);
    console.log('planId', planId);
    if (!insideApp) {
      router.push('/register');
      return;
    }
    // @ts-ignore
    Paddle.Checkout.open({
      product: Number(planId),
      email: user?.email,
      passthrough: '{"user_id": "' + user?.id + '"}',
      subscription_id: subscription?.subscription_id,
      bill_immediately: true,
      prorate: !isCurrentPlan,
      successCallback: (data: any) => {
        // @ts-ignore
        if (window.dataLayer) {
          // @ts-ignore
          dataLayer.push({'event': 'pro_suscription'})
        }
        window.location.href = '/app/docs';
      }
    });
  };

  const borderColor =
    rest.borderColor || colorMode === 'light' ? `${c}.400` : `${c}.500`;

  return (
    <Box p={{base: '10', md: '16'}} {...rest} bgColor={bgColor}>
      <Heading color={colorMode === 'light' ? `${c}.500` : `${c}.400`}>
        {name}
      </Heading>
      <Divider
        opacity={1}
        borderWidth="2px"
        borderColor={borderColor}
        my="6"
        w="56px"
      />

      <Text
        maxW="280px"
        fontSize="lg"
        color={colorMode === 'light' ? 'gray.500' : 'white'}
      >
        {description}
      </Text>

      <Box mt="2">
        <Text
          color={colorMode === 'light' ? 'gray.500' : 'white'}
          fontSize={{base: '6xl', md: '7xl'}}
          fontWeight="extrabold"
        >
          {price}
        </Text>
        <Text
          color={colorMode === 'light' ? 'gray.500' : 'gray.200'}
          casing="uppercase"
          fontWeight="bold"
        >
          {duration}
        </Text>
        <Text mt="2" color={colorMode === 'light' ? 'gray.500' : 'gray.200'}>
          {extras}
        </Text>
      </Box>

      {isFree ? (
        <Button
          as="a"
          href="/register"
          my="8"
          size="lg"
          fontSize="md"
          bgColor={mode(`brand.300`, `brand.400`)}
          color={mode('white', 'whiteAlpha.900')}
          w="full"
          disabled={isCurrentPlan || insideApp}
          isDisabled={isCurrentPlan || insideApp}
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          {ctaText}
        </Button>
      ) : (
        <>
          <CTAButton
            mb="8"
            my="10"
            w="full"
            filter="drop-shadow(0px 0px 20px var(--chakra-colors-whiteAlpha-300)) brightness(1.18)"
            href="#"
            onClick={(e: Event) => {
              if (!isCurrentPlan) {
                e.preventDefault();
                handlePaddleCheckout();
              }
            }}
            isDisabled={isCurrentPlan}
          >
            {proCtaText}
          </CTAButton>
        </>
      )}

      <Box>
        <Text
          fontWeight="bold"
          mb="4"
          color={colorMode === 'light' ? 'gray.500' : 'white'}
        >
          ¿Qué incluye?
        </Text>
        <List spacing="4">
          {features.map((feature, index) => (
            <PricingDetail
              key={index}
              iconColor={mode('brand.300', 'brand.400')}
              color={colorMode === 'light' ? 'gray.500' : 'white'}
            >
              {feature.startsWith('-') ? (
                <em>⛔️ {feature.replace('-', '')}</em>
              ) : (
                <span>✅ {feature}</span>
              )}
            </PricingDetail>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Pricing;
