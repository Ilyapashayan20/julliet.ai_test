import Layout from '@/components/landing/Layout';
import { Footer } from '@/components/landing/Footer';
import { Header } from '@/components/landing/Header';
import Terms from '@/components/landing/Terms';

export default function Home() {
  return (
    <Layout>
      <Header />
      <main>
        <Terms />
      </main>
      <Footer />
    </Layout>
  );
}
