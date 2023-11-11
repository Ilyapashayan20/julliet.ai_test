import Image from 'next/image';

import { Container } from '@/components/landing/Container';
import backgroundImage from '@/images/background-faqs.jpg';

const faqs = [
  [
    {
      question: '¿Puedo cancelar en cualquier momento?',
      answer: 'Sí, puedes cancelar el plan en cualquier momento.'
    },
    {
      question: '¿Qué pasa si se me acaban los créditos?',
      answer:
        'Debes pagar tu tarifa nuevamente y tu cuota vuelve a empezar desde 0.'
    },
    {
      question: `¿Si no uso todos mis créditos, se me acumulan para el siguiente mes?`,
      answer: 'No, los créditos se reinician cada mes.'
    }
  ],
  [
    {
      question: '¿Pueden crear un plan personalizado para mi?',
      answer:
        'Sí, escríbenos desde nuestro chat o envíanos un correo a <a href="mailto:hey@julliet.ai" class="text-purple-500">hey@julliet.ai</a> '
    },
    {
      question: '¿Me cobran todas las sugerencias?',
      answer: `Si estas usando el editor de Julliet, solo se cobrarán las sugerencias que aceptes, si estas usando el generador de artículos, se cobrarán todas las sugerencias que se generen.`
    },
    {
      question: 'Tenemos una pregunta infrecuente, ¿cómo la hacemos?',
      answer: `¡Excelente! Siempre estamos disponibles para ayudarte. Puedes escribirnos a <a href="mailto:hey@julliet.ai" class="text-purple-500">hey@julliet.ai</a> o hablar con nosotros usando nuestro chat en la página.`
    }
  ],
  [
    {
      question: 'How does billing work?',
      question: '¿Cómo funciona el cobro?',
      answer:
        'Tu cuota de palabras se reinicia a 0 al final de tu periodo de suscripción y las palabras no utilizadas no se acumulan.'
    },
    {
      question: '¿Qué métodos de pago aceptan?',
      answer:
        'Aceptamos todas las tarjetas de crédito y débito principales. Tu información de pago se procesa de forma segura usando <a href="https://paddle.com/" target="_blank" class="text-purple-500">Paddle</a>.'
    },
    {
      question: '¿Ofrecen un plan prepago?',
      answer:
        'No, pero si lo necestias, escríbenos a <a href="mailto:hey@julliet.ai" class="text-purple-500">hey@julliet.ai</a> '
    }
  ]
];

export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative py-20 overflow-hidden bg-slate-50 sm:py-32"
    >
      <Image
        className="absolute top-[15rem] left-2 max-w-none translate-x-[-30%] -translate-y-1/4"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
      />
      <Container className="relative">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2
            id="faq-title"
            className="text-3xl tracking-tight font-display text-slate-900 sm:text-4xl"
          >
            Preguntas frecuentes
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Si tienes alguna duda, aquí encontrarás las respuestas. Si no
            encuentras lo que buscas, escríbenos a{' '}
            <span className="text-purple-500">
              <a href="mailto:hey@julliet.ai"> hey@julliet.ai</a>
            </span>
          </p>
        </div>
        <ul
          role="list"
          className="max-w-2xl mx-auto mt-16 grid grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="text-lg font-bold leading-7 text-slate-900">
                      {faq.question}
                    </h3>
                    <p
                      className="mt-4 text-slate-700"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
