import Head from 'next/head';
import { getURL } from '@/lib/utils/helpers';
import Link from 'next/link';

import { Provider } from '@supabase/supabase-js';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { AuthLayout } from '@/components/landing/AuthLayout';
import { Button } from '@/components/ui/Button';
import { SelectField, TextField } from '@/components/landing/Fields';
import { Logo } from '@/components/ui/Logo';
import GitHub from 'components/icons/GitHub';
import Google from 'components/icons/Google';
import Twitter from 'components/icons/Twitter';

import { User } from '@supabase/supabase-js';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { updateUserName } from '@/lib/services/users';
import { sendMessage } from '@/lib/services/slack';
import { fetchSendMessage } from '@/lib/fetchers';

export default function Register() {
  const supabaseClient = useSupabaseClient();
  const [newUser, setNewUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type?: string; content?: string }>({
    type: '',
    content: ''
  });
  const [referralSource, setReferralSource] = useState('');
  const [showForm, setShowForm] = useState(false);

  const router = useRouter();
  const user = useUser();

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage({});
    const {
      error,
      data: { user: createdUser }
    } = await supabaseClient.auth.signUp({
      email,
      password
    });
    if (error) {
      setMessage({ type: 'error', content: error.message });
    } else {
      if (createdUser) {
        await updateUserName(createdUser.id, name, referralSource);
        setNewUser(createdUser);
      } else {
        setMessage({
          type: 'note',
          content: 'Check your email for the confirmation link.'
        });
      }
    }
    setLoading(false);
  };

  const handleOAuthSignIn = async (provider: Provider) => {
    setLoading(true);
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider,
      options: { redirectTo: getURL() }
    });
    if (error) {
      setMessage({ type: 'error', content: error.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (newUser) {
      fetchSendMessage({
        channel: '#notifications',
        text: `New user registered: ${newUser?.email} ❤️`
      }).then(() => {
        console.log('Message sent');
      });
    }

    if (newUser || user) {
      router.replace('/app/docs');
    }
  }, [newUser, user, router]);

  return (
    <>
      <Head>
        <title>Sign Up - Julliet</title>
      </Head>
      <AuthLayout>
        <div className="flex flex-col">
          <Link href="/" aria-label="Home">
            <Logo className="w-40 h-14" />
          </Link>
          <div className="mt-5">
            <h2 className="text-lg font-semibold text-smoky-black">
              Empieza a escribir mejor gratis
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              ¿Ya tienes una cuenta?{' '}
              <Link
                href="/login"
                className="font-medium text-violet-600 hover:underline"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
        <form
          action="#"
          className="mt-10 grid grid-cols-1 gap-y-2 gap-x-6"
          onSubmit={handleSignup}
        >
          {message.content && (
            <div
              className={`${
                message.type === 'error' ? 'text-pink-500' : 'text-green-500'
              } border ${
                message.type === 'error'
                  ? 'border-pink-500'
                  : 'border-green-500'
              } p-3`}
            >
              {message.content}
            </div>
          )}

          <TextField
            label="Nombre"
            id="name"
            name="name"
            type="text"
            autoComplete="family-name"
            required
            onChange={setName}
          />
          <TextField
            className="col-span-full"
            label="Email"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            onChange={setEmail}
          />
          <TextField
            className="col-span-full"
            label="Contraseña"
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            onChange={setPassword}
          />
          <SelectField
            className="col-span-full"
            label="¿Cómo te enteraste de Julliet?"
            id="referral_source"
            name="referral_source"
            onChange={(e) => setReferralSource(e.target.value)}
            value={referralSource}
          >
            <option value="twitter">Twitter</option>
            <option value="google">Google</option>
            <option value="facebook">Facebook</option>
            <option value="ads">Ads</option>
          </SelectField>
          <div className="mt-4 col-span-full">
            <Button
              type="submit"
              variant="solid"
              color="violet"
              className="w-full"
            >
              <span>
                Registrate <span aria-hidden="true">➜</span>
              </span>
            </Button>
          </div>
        </form>
        <div className="flex items-center my-6">
          <div
            className="flex-grow mr-3 border-t border-zinc-600"
            aria-hidden="true"
          ></div>
          <div className="text-gray-700 ">
            O registrate usando una de tus cuentas
          </div>
          <div
            className="flex-grow ml-3 border-t border-zinc-600"
            aria-hidden="true"
          ></div>
        </div>
        <div className="flex flex-row items-center justify-center w-full mt-3 socials-signip gap-4">
          <Button
            className="h-10 text-white bg-blue-500"
            onClick={() => handleOAuthSignIn('twitter')}
          >
            <Twitter />
            <span className="pl-2">Twitter</span>
          </Button>
          <Button
            className="text-white bg-red-500"
            onClick={() => handleOAuthSignIn('google')}
          >
            <Google />
            <span className="pl-2">Google</span>
          </Button>
          <Button className="" onClick={() => handleOAuthSignIn('github')}>
            <GitHub />
            <span className="pl-2">Github</span>
          </Button>
        </div>
      </AuthLayout>
    </>
  );
}
