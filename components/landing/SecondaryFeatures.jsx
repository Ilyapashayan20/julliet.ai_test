import { useId } from 'react';
import Image from 'next/image';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';

import { Container } from '@/components/landing/Container';
import screenshotContacts from '@/images/screenshots/contacts.png';
import screenshotInventory from '@/images/screenshots/inventory.png';
import screenshotProfitLoss from '@/images/screenshots/profit-loss.png';

const features = [
  {
    name: 'Imágenes generadas por IA',
    summary:
      'Crea increibles imágenes para tus artículos con generación de imágenes por IA',
    description:
      'No gastes tiempo ni dinero en fotos para tus artículos. Con Julliet, puedes crear imágenes de alta calidad para tus artículos en segundos.',
    image: screenshotContacts,
    icon: function InventoryIcon() {
      return (
        <>
          <rect width="36" height="36" rx="10" fill="none" />
          <path
            d="M10 22L14.5858 17.4142C15.3668 16.6332 16.6332 16.6332 17.4142 17.4142L22 22M20 20L21.5858 18.4142C22.3668 17.6332 23.6332 17.6332 24.4142 18.4142L26 20M20 14H20.01M12 26H24C25.1046 26 26 25.1046 26 24V12C26 10.8954 25.1046 10 24 10H12C10.8954 10 10 10.8954 10 12V24C10 25.1046 10.8954 26 12 26Z"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      );
    }
  },
  {
    name: 'Auto generación de artículos',
    summary: 'Dame un titulo y algo de texto y te genero un artículo',
    description:
      'Si no tienes tiempo para escribir artículos, Julliet te ayuda a crear artículos de alta calidad en segundos.',
    image: screenshotProfitLoss,
    icon: function ContactsIcon() {
      let id = useId();
      return (
        <>
          <rect id={id} width="36" height="36" rx="10" fill="none" />
          <path
            d="M21.2322 11.2322L24.7678 14.7678M22.7322 9.73223C23.7085 8.75592 25.2915 8.75592 26.2678 9.73223C27.2441 10.7085 27.2441 12.2915 26.2678 13.2678L12.5001 27.0355H9.00006V23.4644L22.7322 9.73223Z"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      );
    }
  },
  {
    name: 'Editor de texto simple y fácil de usar',
    summary:
      'El editor de texto de Julliet es simple y fácil de usar. No necesitas ser un experto en edición de texto para usarlo.',
    description:
      'Utiliza bloques de texto, imágenes, videos, listas, tablas y más para crear artículos de alta calidad.',
    image: screenshotInventory,
    icon: function ReportingIcon() {
      let id = useId();
      return (
        <>
          <rect width="36" height="36" rx="10" fill="none" />
          <path
            d="M17 10C17 8.89543 17.8954 8 19 8C20.1046 8 21 8.89543 21 10V11C21 11.5523 21.4477 12 22 12H25C25.5523 12 26 12.4477 26 13V16C26 16.5523 25.5523 17 25 17H24C22.8954 17 22 17.8954 22 19C22 20.1046 22.8954 21 24 21H25C25.5523 21 26 21.4477 26 22V25C26 25.5523 25.5523 26 25 26H22C21.4477 26 21 25.5523 21 25V24C21 22.8954 20.1046 22 19 22C17.8954 22 17 22.8954 17 24V25C17 25.5523 16.5523 26 16 26H13C12.4477 26 12 25.5523 12 25V22C12 21.4477 11.5523 21 11 21H10C8.89543 21 8 20.1046 8 19C8 17.8954 8.89543 17 10 17H11C11.5523 17 12 16.5523 12 16V13C12 12.4477 12.4477 12 13 12H16C16.5523 12 17 11.5523 17 11V10Z"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      );
    }
  }
];

function Feature({ feature, isActive, className, ...props }) {
  return (
    <div
      className={clsx(className, !isActive && 'opacity-75 hover:opacity-100')}
      {...props}
    >
      <div
        className={clsx(
          'w-9 rounded-lg',
          isActive ? 'bg-violet-600' : 'bg-slate-300'
        )}
      >
        <svg aria-hidden="true" className="h-9 w-9" fill="none">
          <feature.icon />
        </svg>
      </div>
      <h3
        className={clsx(
          'mt-6 text-sm font-medium',
          isActive ? 'text-blue-600' : 'text-slate-600'
        )}
      >
        {feature.name}
      </h3>
      <p className="mt-2 text-xl font-display text-slate-900">
        {feature.summary}
      </p>
      <p className="mt-4 text-sm text-slate-600">{feature.description}</p>
    </div>
  );
}

function FeaturesMobile() {
  return (
    <div className="flex flex-col px-4 mt-20 -mx-4 overflow-hidden gap-y-10 sm:-mx-6 sm:px-6 lg:hidden">
      {features.map((feature) => (
        <div key={feature.name}>
          <Feature feature={feature} className="max-w-2xl mx-auto" isActive />
          <div className="relative pb-10 mt-10">
            <div className="absolute bottom-0 -inset-x-4 top-8 bg-slate-200 sm:-inset-x-6" />
            <div className="relative mx-auto w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10">
              <Image
                className="w-full"
                src={feature.image}
                alt=""
                sizes="52.75rem"
                quality={75}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function FeaturesDesktop() {
  return (
    <Tab.Group as="div" className="hidden lg:mt-20 lg:block">
      {({ selectedIndex }) => (
        <>
          <Tab.List className="grid grid-cols-3 gap-x-8">
            {features.map((feature, featureIndex) => (
              <Feature
                key={feature.name}
                feature={{
                  ...feature,
                  name: (
                    <Tab className="[&:not(:focus-visible)]:focus:outline-none">
                      <span className="absolute inset-0" />
                      {feature.name}
                    </Tab>
                  )
                }}
                isActive={featureIndex === selectedIndex}
                className="relative"
              />
            ))}
          </Tab.List>
          <Tab.Panels className="relative py-16 mt-20 overflow-hidden rounded-4xl bg-slate-200 px-14 xl:px-16">
            <div className="flex -mx-5">
              {features.map((feature, featureIndex) => (
                <Tab.Panel
                  static
                  key={feature.name}
                  className={clsx(
                    'px-5 transition duration-500 ease-in-out [&:not(:focus-visible)]:focus:outline-none',
                    featureIndex !== selectedIndex && 'opacity-60'
                  )}
                  style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
                  aria-hidden={featureIndex !== selectedIndex}
                >
                  <div className="w-[52.75rem] overflow-hidden rounded-xl bg-white shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10">
                    <Image
                      className="w-full"
                      src={feature.image}
                      alt=""
                      sizes="52.75rem"
                    />
                  </div>
                </Tab.Panel>
              ))}
            </div>
            <div className="absolute inset-0 pointer-events-none rounded-4xl ring-1 ring-inset ring-slate-900/10" />
          </Tab.Panels>
        </>
      )}
    </Tab.Group>
  );
}

export function SecondaryFeatures() {
  return (
    <section
      id="secondary-features"
      aria-label="Features for simplifying everyday business tasks"
      className="pt-20 pb-14 sm:pb-20 sm:pt-32 lg:pb-32"
    >
      <Container>
        <div className="max-w-2xl mx-auto md:text-center">
          <h2 className="text-3xl tracking-tight font-display text-slate-900 sm:text-4xl">
            Crea textos de marketing con inteligencia artificial en 1 clic.
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Con Julliet, puedes crear contenido de marketing de forma rápida y
            sencilla para tu tienda en línea, blog o cuentas de redes sociales.
          </p>
        </div>
        <FeaturesMobile />
        <FeaturesDesktop />
      </Container>
    </section>
  );
}
