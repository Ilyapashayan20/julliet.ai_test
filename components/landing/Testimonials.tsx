import Script from 'next/script';

export default function Testimonials() {
  return (
    <div className="w-full mt-8 mr-2 py-36 testimonials" id="testimonials">
      <div className="flex flex-col items-center w-full ">
        <h2 className="m-10 text-3xl text-center font-display text-smoky-black sm:text-4xl">
          Querido por escritores, estudiantes, startups y emprendedores
        </h2>
        <div
          className="items-center w-[50%] senja-frame-embed"
          data-id="a3f3889f-e3cc-4b5b-8b3c-7096741645b2"
        />
      </div>
      <div className="flex flex-col items-center w-[400px]">
        <Script src="https://widget.senja.io/embed/frame.js" />
      </div>
    </div>
  );
}
