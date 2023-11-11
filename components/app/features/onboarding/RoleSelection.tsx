import {SimpleGrid, GridItem, Heading, Text, VStack, Box, HStack, Slide, useColorMode} from '@chakra-ui/react'
import NextImage from 'next/image'
import OnboardingPersonal from '@/images/onboarding/onboarding-personal.png'
import OnboardingContentCreator from '@/images/onboarding/onboarding-content-creator.png'
import OnboardingStudent from '@/images/onboarding/onboarding-student.png'
import OnboardingMarketer from '@/images/onboarding/onboarding-marketer.png'
import OnboardingSmallCompany from '@/images/onboarding/onboarding-small-company.png'
import OnboardingBigCompany from '@/images/onboarding/onboarding-big-company.png'
import JullietLogo from '@/components/ui/LogoV2';
import {useRouter} from 'next/router'


const Roles = [
  {
    id: 1,
    title: 'Personal',
    value: 'personal',
    image: OnboardingPersonal,
    alt: 'Personal Rol'
  },
  {
    id: 2,
    title: 'Creador de contenido',
    value: 'content_creator',
    image: OnboardingContentCreator,
    alt: 'Content Creator Rol'
  },
  {
    id: 3,
    title: 'Estudiante',
    value: 'student',
    image: OnboardingStudent,
    alt: 'Student Rol'
  },
  {
    id: 4,
    title: 'Marketer',
    value: 'marketer',
    image: OnboardingMarketer,
    alt: 'Marketer Rol'
  },
  {
    id: 5,
    title: 'Pequeña empresa',
    value: 'small_company',
    image: OnboardingSmallCompany,
    alt: 'Small Company Rol'
  },
  {
    id: 6,
    title: 'Gran empresa',
    value: 'big_company',
    image: OnboardingBigCompany,
    alt: 'Big Company Rol'
  }
]


function RoleItem({title, image, alt, onClick}: any) {
  return (
    <VStack
      spacing={2}
      cursor="pointer"
      onClick={onClick}
    >
      <NextImage
        src={image}
        alt={alt}
        width={250}
        height={250}
        quality={100}
      />
      <Text fontSize="lg" fontWeight="bold" textAlign="center">
        {title}
      </Text>
    </VStack>
  )
}

function RoleSelection({onClick, dispatch}: any) {

  function handleRoleSelection(role: string) {
    dispatch({type: 'add', name: 'role', value: role})
    onClick()
  }

  return (
    <VStack spacing={10}>
      <SimpleGrid
        columns={{base: 1, md: 3}}
        spacingY="220px"
        spacingX="100px"
      >
        {Roles.map((role, index) => (
          <GridItem
            key={role.id}
            colSpan={1}
            height="80px"
          >
            <RoleItem
              onClick={() => handleRoleSelection(role.value)}
              title={role.title}
              image={role.image}
              alt={role.alt}
            />
          </GridItem>
        ))}
      </SimpleGrid>
    </VStack>
  )
}

export default RoleSelection
