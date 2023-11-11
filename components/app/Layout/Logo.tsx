import Image from 'next/image';

export const Logo = (props: any) => (
  <Image
    src={props.imagotype ? '/logo/imagotipo.png' : '/logo/julliet-logo-3d.png'}
    width={props.imagotype ? 300 : 1366}
    height={props.imagotype ? 300 : 482}
    alt="Logo"
    {...props}
  />
);
