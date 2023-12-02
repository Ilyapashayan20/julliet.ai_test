import { Fragment } from 'react';

import Link from 'next/link';
import { Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';

import { Button } from '@/components/ui/Button';
import { Container } from '@/components/landing/Container';
import { Logo } from '@/components/ui/Logo';
import { NavLink } from '@/components/landing/NavLink';
import { useUser } from '@supabase/auth-helpers-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

interface MobileNavProps {
  href: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

function MobileNavLink({ href, children }: MobileNavProps) {
  return (
    <Popover.Button as={Link} href={href} className="block w-full p-2">
      {children}
    </Popover.Button>
  );
}

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          'origin-center transition',
          open && 'scale-90 opacity-0'
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          'origin-center transition',
          !open && 'scale-90 opacity-0'
        )}
      />
    </svg>
  );
}

function MobileNavigation(user: any, router: any) {
  const supabaseClient = useSupabaseClient();

  return (
    <Popover>
      <Popover.Button
        className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 flex flex-col p-4 mt-4 text-lg tracking-tight bg-white shadow-xl top-full origin-top rounded-2xl text-slate-900 ring-1 ring-slate-900/5"
          >
            <MobileNavLink href="#features">Características</MobileNavLink>
            <MobileNavLink href="#testimonials">Testimonios</MobileNavLink>
            <MobileNavLink href="#faq">FAQ</MobileNavLink>
            <MobileNavLink href="/pricing">Precios</MobileNavLink>
            <MobileNavLink href="/blog">Blog</MobileNavLink>
            <hr className="m-2 border-slate-300/40" />
            {user ? (
              <MobileNavLink
                href="#"
                onClick={async () => {
                  await supabaseClient.auth.signOut();
                  router.push('/app/docs');
                }}
              >
                Log out
              </MobileNavLink>
            ) : (
              <MobileNavLink href="/login">Log in</MobileNavLink>
            )}
            {user ? (
              <MobileNavLink href="/app/docs">Dashboard</MobileNavLink>
            ) : (
              <MobileNavLink href="/app/docs">
                <span>
                  Try{' '}
                  <span className="hidden lg:inline">{`Comienza GRATIS ➜`}</span>
                </span>
              </MobileNavLink>
            )}
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
}

export function Header() {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  return (
    <header className="py-10">
      <Container>
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="/" aria-label="Home">
              <Logo className="w-40 h-14" />
            </Link>
            <div className="hidden md:flex md:gap-x-6">
              <NavLink href="#features">Características</NavLink>
              <NavLink href="#testimonials">Testimonios</NavLink>
              <NavLink href="#faq">FAQ</NavLink>
              <NavLink href="/pricing">Precios</NavLink>
              <NavLink href="/blog">Blog</NavLink>
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            {user ? (
              <div className="hidden md:block">
                <NavLink
                  href="#"
                  onClick={async () => {
                    console.log('signing out');
                    const response = await supabaseClient.auth.signOut();
                    console.log(response);
                    router.push('/login');
                  }}
                >
                  Cerrar sesión
                </NavLink>
              </div>
            ) : (
              <div className="hidden md:block">
                <NavLink href="/login">Iniciar sesión</NavLink>
              </div>
            )}
            {!user ? (
              <Button
                href="/app/docs"
                color="violet"
                className="hidden lg:block"
              >
                <span>Escritorio ➜</span>
              </Button>
            ) : (
              <Button
                href="/app/docs"
                color="violet"
                className="hidden lg:block"
              >
                <span>
                  Comienza ahora{' '}
                  <span className="hidden lg:inline">GRATIS ➜</span>
                </span>
              </Button>
            )}
            <div className="-mr-1 md:hidden">
              <MobileNavigation user={user} router={router} />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}
