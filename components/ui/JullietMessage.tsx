import JullietIdea from '@/images/julliet-idea.png';
import { FormHelperText, Text, useColorModeValue } from '@chakra-ui/react';
import Image from 'next/image';

interface Props {
  message: string;
  example?: string;
}

export default function JullietMessage({ message, example }: Props) {
  const color = useColorModeValue('white', 'blackAlpha.900');
  return (
    <div className="flex items-start mt-4 gap-4">
      <div className="shrink-0 w-[57px] h-[44px]">
        <Image src={JullietIdea} width={517} height={394} alt="" />
      </div>

      <FormHelperText
        as="p"
        mb="4"
        className="shrink rounded-bl-md rounded-r-md bg-[#E2D7F4] p-4"
        color={color}
      >
        {message}
        {example ? (
          <>
            <br />
            <Text
              color={color}
              as="span"
              display="block"
              fontWeight="bold"
              bg="#CFBDEC"
              my="2"
              p="2"
              rounded="md"
            >
              {'✨ Por ejemplo: ¿Cómo ser un buen escritor?'}
            </Text>
          </>
        ) : (
          <></>
        )}
      </FormHelperText>
    </div>
  );
}
