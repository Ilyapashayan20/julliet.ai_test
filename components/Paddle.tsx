import Script from 'next/script';

export function PaddleLoader() {
  const sandbox = process.env.NEXT_PUBLIC_PADDLE_SANDBOX === 'true';
  console.log('sandbox', sandbox);

  return (
    <Script
      src="https://cdn.paddle.com/paddle/paddle.js"
      onLoad={() => {
        if (sandbox) {
          //@ts-ignore
          Paddle.Environment.set('sandbox');
        }
        // @ts-ignore
        Paddle.Setup({
          vendor: Number(process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID),
          debug: sandbox
        });
      }}
    />
  );
}
