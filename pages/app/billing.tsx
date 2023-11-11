import {
  Container,
} from '@chakra-ui/react';
import Pricing from '@/components/landingV2/Pricing';
import {PaddleLoader} from '@/components/Paddle';
import Layout from '@/components/app/Layout';

const BillingsPage = () => {
  return (
    <Layout showBanner={false}>
      <PaddleLoader />
      <Container py="0" flex="1">
        <Pricing
          className="py-5"
          title="Genera contenido ilimitado por un pago mensual 😇"
          subtitle="Chat con Julliet, Artículos ilimitados, Integración con WordPress y más funciones"
          showHeading={true}
        />
      </Container>
    </Layout >
  );
};

export default BillingsPage;
