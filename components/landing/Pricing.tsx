import '@/components/landing/Container';
import '@/components/ui/Button';
import 'clsx';
import 'react';
import clsx from 'clsx';

import { Button } from '@/components/ui/Button';
import { Container } from '@/components/landing/Container';
import { useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/router';
import { useUser } from '@/lib/utils/useUser';

function SwirlyDoodle({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 281 40"
      className={className}
      preserveAspectRatio="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M240.172 22.994c-8.007 1.246-15.477 2.23-31.26 4.114-18.506 2.21-26.323 2.977-34.487 3.386-2.971.149-3.727.324-6.566 1.523-15.124 6.388-43.775 9.404-69.425 7.31-26.207-2.14-50.986-7.103-78-15.624C10.912 20.7.988 16.143.734 14.657c-.066-.381.043-.344 1.324.456 10.423 6.506 49.649 16.322 77.8 19.468 23.708 2.65 38.249 2.95 55.821 1.156 9.407-.962 24.451-3.773 25.101-4.692.074-.104.053-.155-.058-.135-1.062.195-13.863-.271-18.848-.687-16.681-1.389-28.722-4.345-38.142-9.364-15.294-8.15-7.298-19.232 14.802-20.514 16.095-.934 32.793 1.517 47.423 6.96 13.524 5.033 17.942 12.326 11.463 18.922l-.859.874.697-.006c2.681-.026 15.304-1.302 29.208-2.953 25.845-3.07 35.659-4.519 54.027-7.978 9.863-1.858 11.021-2.048 13.055-2.145a61.901 61.901 0 0 0 4.506-.417c1.891-.259 2.151-.267 1.543-.047-.402.145-2.33.913-4.285 1.707-4.635 1.882-5.202 2.07-8.736 2.903-3.414.805-19.773 3.797-26.404 4.829Zm40.321-9.93c.1-.066.231-.085.29-.041.059.043-.024.096-.183.119-.177.024-.219-.007-.107-.079ZM172.299 26.22c9.364-6.058 5.161-12.039-12.304-17.51-11.656-3.653-23.145-5.47-35.243-5.576-22.552-.198-33.577 7.462-21.321 14.814 12.012 7.205 32.994 10.557 61.531 9.831 4.563-.116 5.372-.288 7.337-1.559Z"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={clsx(
        'h-6 w-6 flex-none fill-current stroke-current',
        className
      )}
    >
      <path
        d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
        strokeWidth={0}
      />
      <circle
        cx={12}
        cy={12}
        r={8.25}
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Plan({
  name,
  price,
  description,
  href,
  features,
  ctaText,
  planId,
  showCheckout,
  featured = false,
  isFree = false
}: {
  name: string;
  price: string;
  description: string;
  href?: string;
  features: string[];
  ctaText: string;
  planId?: string;
  showCheckout: boolean;
  featured?: boolean;
  isFree?: boolean;
}) {
  const { user, subscription } = useUser();
  const appStore = useAppStore();
  const isCurrentPlan = user && subscription?.subscription_plan_id == planId;

  const handlePaddleCheckout = () => {
    console.log('handlePaddleCheckout', planId);
    // @ts-ignore
    Paddle.Checkout.open({
      product: Number(planId),
      email: user?.email,
      passthrough: '{"user_id": "' + user?.id + '"}',
      subscription_id: subscription?.subscription_id,
      bill_immediately: true,
      prorate: !isCurrentPlan,
      successCallback: (data: any) => {
        window.location.href = '/app/docs';
      }
    });
  };

  const router = useRouter();

  if (
    subscription?.subscription_plan_id == planId &&
    router.pathname == '/app/billing'
  ) {
    ctaText = 'Tu plan actual';
  }

  return (
    <section
      className={clsx(
        'flex flex-col rounded-3xl px-6 sm:px-8',
        featured ? 'order-first bg-violet-600 py-8 lg:order-none' : 'lg:py-8'
      )}
    >
      <h3
        className={clsx(
          'mt-5 text-lg font-bold font-display',
          featured && 'text-white'
        )}
      >
        {name}
      </h3>
      <p
        className={clsx(
          'mt-2 text-base italic',
          featured ? 'text-white' : 'text-smoky-black'
        )}
      >
        {description}
      </p>
      <p
        className={clsx(
          'order-first text-5xl font-light tracking-tight font-display',
          featured && 'text-white'
        )}
      >
        {price}
      </p>
      <ul
        role="list"
        className={clsx(
          'order-last mt-10 flex flex-col gap-y-3 text-sm',
          featured ? 'text-white' : 'text-smoky-black'
        )}
      >
        {features.map((feature) => (
          <li key={feature} className="flex">
            {/* <CheckIcon */}
            {/*   className={featured ? 'text-white' : 'text-smoky-black'} */}
            {/* /> */}
            <span className="ml-4 text-base ">{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        href={isFree ? subscription?.cancel_url : showCheckout ? '#' : href}
        variant={featured ? 'solid' : 'outline'}
        color={featured ? 'white' : 'smoky-black'}
        className="mt-8"
        aria-label={`Get started with the ${name} plan for ${price}`}
        onClick={showCheckout ? handlePaddleCheckout : undefined}
        disabled={isCurrentPlan as boolean}
      >
        {ctaText} <span className="ml-2 text-violet-600">➜</span>
      </Button>
    </section>
  );
}

export function Pricing({
  showHeader,
  className,
  ctaText = 'Pruébalo gratis',
  showCheckout = true
}: {
  showHeader?: boolean;
  className?: string;
  ctaText?: string;
  showCheckout?: boolean;
}) {
  const tooltipRef = useRef(null);
  const triangleRef = useRef(null);

  // const moveTooltip = (e: any) => {
  //   console.log(e.target.value);
  //   const { left, top } = e.target.getBoundingClientRect();
  //   console.log(left, top);
  //   if (tooltipRef.current && triangleRef.current.style) {
  //     tooltipRef.current.style.marginLeft = `${e.target.value * 15}%`;
  //     triangleRef.current.style.marginLeft = `${
  //       (e.target.value - 50) * (1.48 / 2)
  //     }%`;
  //   }
  // };

  return (
    <section id="pricing" aria-label="Pricing" className={className}>
      <Container>
        {showHeader && (
          <div className="md:text-center">
            <h2 className="text-3xl tracking-tight text-smoky-black font-display sm:text-4xl">
              Precio según{' '}
              <span className="relative whitespace-nowrap">
                <SwirlyDoodle className="absolute top-1/2 left-0 h-[1em] w-full fill-violet-300" />
                <span className="relative">tus necesidades</span>
              </span>{' '}
            </h2>
            <p className="mt-4 text-lg text-smoky-black">
              Cancela en cualquier momento. Sin compromiso y sin preguntas.
            </p>
          </div>
        )}
        {/* <div className="relative flex flex-col items-center justify-center pt-1 mt-8 overflow-hidden"> */}
        {/*   <div */}
        {/*     className="flex flex-col text-center text-md h-[70px] lg:h-[65px] rounded-md bg-slate-200 absolute top-0 left-0 pb-4" */}
        {/*     ref={tooltipRef} */}
        {/*   > */}
        {/*     <span className="pl-2 pr-2 text-2xl font-bold">25000</span> */}
        {/*     <span className="pl-2 pr-2 mb-12 lg:text-sm text-[0.7rem] font-medium"> */}
        {/*       Words per month */}
        {/*     </span> */}
        {/*     <svg */}
        {/*       className={`absolute left-0 w-full h-6 text-slate-200 top-[62%]`} */}
        {/*       x="0px" */}
        {/*       y="0px" */}
        {/*       viewBox="0 0 255 255" */}
        {/*       ref={triangleRef} */}
        {/*     > */}
        {/*       <polygon */}
        {/*         className="fill-current" */}
        {/*         points="0,0 127.5,127.5 255,0" */}
        {/*       ></polygon> */}
        {/*     </svg> */}
        {/*   </div> */}
        {/*   <input */}
        {/*     type="range" */}
        {/*     onChange={(e) => moveTooltip(e)} */}
        {/*     className="w-3/4 h-4 p-0 mt-5 bg-slate-200 form-range focus:outline-none focus:ring-0 focus:shadow-none rounded-md accent-violet-600" */}
        {/*     id="customRange1" */}
        {/*     min="1" */}
        {/*     max="7" */}
        {/*     step="1" */}
        {/*   /> */}
        {/* </div> */}
        <div className="lg:ml-[9.7rem] lg:mt-2 ml-11 mt-3">
          {/* <input */}
          {/*   type="checkbox" */}
          {/*   name="yearly" */}
          {/*   checked */}
          {/*   className="rounded-full checked:text-violet-600" */}
          {/* /> */}
          {/* <label htmlFor="yearly" className="ml-2 text-sm"> */}
          {/*   Pago anual */}
          {/* </label> */}
        </div>
        <div className="max-w-2xl mt-16 -mx-4 grid grid-cols-1 gap-y-10 sm:mx-auto lg:-mx-8 lg:max-w-none lg:grid-cols-3 xl:mx-0 xl:gap-x-8">
          <Plan
            showCheckout={false}
            name="🆓 Gratuito"
            price="$0"
            href="/register"
            description="Prueba la plataforma sin compromiso"
            features={[
              '🤖 Genera 2.000 palabras GRATIS al mes',
              '💻 5 Casos de uso',
              '📖 Escribe en 30+ idiomas',
              '🗣 Escribe usando 10+ tonos de voz',
              '🔌 Integración con WordPress',
              '🆕 Artículos 100% originales',
              '📧 Soporte por email'
            ]}
            ctaText={ctaText}
            isFree
            // planId={process.env.NEXT_PUBLIC_PADDLE_PLAN_FREELANCER_ID as string}
          />
          <Plan
            featured
            showCheckout={showCheckout}
            name="👩🏽‍💻 Starter"
            price="$9"
            href="/register"
            description="Bueno para escritores, traductores y editores"
            features={[
              '🤖 Genera 20.000 palabras al mes',
              '💻 5 Casos de uso',
              '📖 Escribe en 30+ idiomas',
              '🗣 Escribe usando 10+ tonos de voz',
              '🔌 Integración con WordPress',
              '🆕 Artículos 100% originales',
              '📧 Soporte por email',
              '📞 Soporte por teléfono'
            ]}
            ctaText={ctaText}
            planId={process.env.NEXT_PUBLIC_PADDLE_PLAN_STARTUP_ID as string}
          />
          <Plan
            name="🏢 Ilimitado"
            showCheckout={showCheckout}
            price="$39"
            href="/register"
            description="Para los más ambiciosos"
            features={[
              '🤖 Genera palabras ILIMITADAS* al mes',
              '💻 5 Casos de uso',
              '📖 Escribe en 30+ idiomas',
              '🗣 Escribe usando 10+ tonos de voz',
              '🔌 Integración con WordPress',
              '🆕 Artículos 100% originales',
              '📧 Soporte por email',
              '📞 Soporte por teléfono',
              '📝 Acceso a la API',
              '💬 Soporte prioritario'
            ]}
            ctaText={ctaText}
            planId={process.env.NEXT_PUBLIC_PADDLE_PLAN_ENTERPRISE_ID as string}
          />
        </div>
      </Container>
    </section>
  );
}
