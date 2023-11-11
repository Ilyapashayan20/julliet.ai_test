import Link from 'next/link';
import clsx from 'clsx';
import LoadingDots from '@/components/ui/LoadingDots';

const baseStyles = {
  solid:
    'group inline-flex items-center justify-center rounded-full py-2 px-4 font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2',
  outline:
    'group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 focus:outline-none'
};

interface ButtonVariant {
  solid: any;
  outline: any;
}

const variantStyles: ButtonVariant = {
  solid: {
    slate:
      'bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900',
    blue: 'bg-blue-600 text-white hover:text-slate-100 hover:bg-blue-500 active:bg-blue-800 active:text-blue-100 focus-visible:outline-blue-600',
    violet:
      'bg-violet-600 text-white hover:text-slate-100 hover:bg-violet-500 active:bg-violet-800 active:text-violet-100 focus-visible:outline-violet-600',
    'smoky-black':
      'bg-smoky-black-600 text-white hover:text-slate-100 hover:bg-smoky-black-500 active:bg-smoky-black-800 active:text-smoky-black-100 focus-visible:outline-smoky-black-600',
    white:
      'bg-white text-slate-900 hover:bg-blue-50 active:bg-blue-200 active:text-slate-600 focus-visible:outline-white'
  },
  outline: {
    slate:
      'ring-slate-200 text-slate-700 hover:text-slate-900 hover:ring-slate-300 active:bg-slate-100 active:text-slate-600 focus-visible:outline-blue-600 focus-visible:ring-slate-300',
    white:
      'ring-slate-700 text-white hover:ring-slate-500 active:ring-slate-700 active:text-slate-400 focus-visible:outline-white'
  }
};

interface ButtonProps {
  variant?: 'solid' | 'outline';
  color?: string;
  href?: string;
  className?: string;
  props?: any;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  loading?: boolean;
}

export function Button({
  variant = 'solid',
  color = 'slate',
  loading = false,
  className,
  href,
  children,
  ...props
}: ButtonProps) {
  const toAddColor = className?.includes('bg-')
    ? ''
    : variantStyles[variant][color];

  className = clsx(baseStyles[variant], toAddColor, className);

  return href ? (
    <Link href={href} className={`button ${className}`} {...props}>
      {children}
      {loading && (
        <i className="flex pl-2 m-0">
          <LoadingDots />
        </i>
      )}
    </Link>
  ) : (
    <button className={`button ${className}`} {...props}>
      {children}
      {loading && (
        <i className="flex pl-2 m-0">
          <LoadingDots />
        </i>
      )}
    </button>
  );
}
