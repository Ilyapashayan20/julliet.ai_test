import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import JullietEditor from '@/images/screenshots/julliet-editor-with-bg.jpg';

export default function CallToAction1() {
  return (
    <div className="relative pt-20 overflow-hidden pb-28 sm:pt-44  bg-[url('/gradient-bg.jpg')] bg-no-repeat bg-cover">
      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-white rounded-lg shadow-xl lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="px-6 pt-10 pb-12 sm:px-16 sm:pt-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
            <div className="lg:self-center">
              <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                <span className="block">¿Listo para escribir?</span>
                <span className="block">
                  ¡Comienza con nuestro plan gratuito!
                </span>
              </h2>
              <p className="mt-4 text-lg text-gray-700 leading-6">
                Tienes 2000 palabras gratis mensuales para empezar a escribir,
                esto es equivalente a 2 entradas de blog, 2 páginas de
                contenido, 8 emails o 7 tweets.
              </p>
              {/* <a */}
              {/*   href="/login" */}
              {/*   className="inline-flex items-center px-5 py-3 mt-8 text-base font-medium text-white bg-white border border-transparent shadow rounded-md hover:bg-indigo-50 bg-gradient-to-br from-violet-600 to-bittersweet background-animate" */}
              {/* > */}
              {/*   ¡Comienza a escribir gratis! */}
              {/* </a> */}
              {/* <a */}
              {/*   href="#" */}
              {/*   className="inline-block animate-border rounded-xl bg-white from-violet-600 via-purple-500 to-bittersweet bg-[length:400%_400%] p-0.5 transition bg-gradient-to-r hover:shadow-lg focus:outline-none focus:ring" */}
              {/* > */}
              {/*   <span className="block rounded-[11px] bg-slate-900 px-10 py-4 text-xl text-white"> */}
              {/*     {' '} */}
              {/*     Get Started{' '} */}
              {/*   </span> */}
              {/* </a> */}
              <Button
                href="/login"
                className="inline-block bg-white hover:bg-gradient-to-r bg-[length:400%_400%] bg-slate-900 bg-gradient-to-br from-violet-600 to-bittersweet rounded-md animate-border text-lg text-white my-8"
              >
                Empieza GRATIS{' '}
              </Button>
            </div>
          </div>
          <div className="-mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
            <Image
              className="object-cover object-left-top translate-x-6 translate-y-6 transform rounded-md sm:translate-x-16 lg:translate-y-20"
              src={JullietEditor}
              layout="fill"
              alt="App screenshot"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
