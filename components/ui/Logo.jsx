import Image from 'next/image';
import logoImage from '@/images/logo.png';

export function Logo(props) {
  return (
    <div className={`relative ${props.className}`}>
      <Image layout="responsive" alt="Julliet.ai logo" src={logoImage} />
    </div>
  );
}
