import Layout from '@/components/landing/Layout';
import { Footer } from '@/components/landing/Footer';
import { Header } from '@/components/landing/Header';
import Privacy from '@/components/landing/Privacy';

export default function Home() {
  return (
    <Layout>
      <Header />
      <main>
        <Privacy />
      </main>
      <Footer />
    </Layout>
  );
}
