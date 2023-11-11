import Link from 'next/link';

import { Container } from '@/components/landing/Container';

export function CallToAction() {
  return (
    <section
      id="get-started-today"
      className="relative py-32 overflow-hidden bg-[url(/gradient-bg.jpg)] bg-cover"
    >
      <Container className="relative">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-3xl tracking-tight text-white font-display sm:text-4xl">
            ¿Qué esperas para empezar a usar Julliet?
          </h2>
          <p className="mt-4 text-lg tracking-tight text-white">
            Puedes crear tus primeros artículos <strong>GRATIS</strong> y sin
            compromiso, solo tienes que registrarte.
          </p>
          <Link
            href="/login"
            className="inline-block animate-border rounded-full bg-white from-violet-600 via-purple-500 to-bittersweet bg-[length:400%_400%] p-0.5 transition bg-gradient-to-r hover:shadow-lg focus:outline-none focus:ring my-4"
          >
            <span className="block px-10 py-4 font-semibold text-black bg-white rounded-full text-md ">
              {' '}
              Empieza GRATIS{' '}
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
