import {Box, RadioGroup, Center, Radio, Stack, Text, useColorMode} from '@chakra-ui/react'


const DiscoveryOptions = [
  {
    id: 1,
    title: 'Google',
    value: 'google'
  },
  {

    id: 2,
    title: 'Tiktok',
    value: 'tiktok'
  },
  {
    id: 3,
    title: 'Facebook',
    value: 'facebook'
  },
  {
    id: 4,
    title: 'Instagram',
    value: 'instagram'
  },
  {
    id: 5,
    title: 'Twitter',
    value: 'twitter'
  },
  {
    id: 6,
    title: 'Linkedin',
    value: 'linkedin'
  },
  {
    id: 7,
    title: 'Youtube',
    value: 'youtube'
  },
  {
    id: 8,
    title: 'Un amigo',
    value: 'friend'
  },
  {
    id: 9,
    title: 'Otro',
    value: 'other'
  },
]

function WhereHeFoundUs({onClick, dispatch}: any) {
  const {colorMode} = useColorMode()

  function handleChange(value: string) {
    console.log(value)
    dispatch({type: 'add', name: 'howHeFoundUs', value})
    onClick()
  }

  return (
    < Center w="full" alignItems="flex-start" >
      <Box
        bgColor={colorMode === 'light' ? 'gray.100' : 'gray.700'}
        boxShadow="sm"
        borderRadius="lg" p={{base: '4', md: '2'}}
        w={{base: '90%', md: '50%'}}
      >
        <RadioGroup defaultValue='1'>
          {DiscoveryOptions.map((option) => (
            <Stack
              bgColor={colorMode === 'light' ? 'white' : 'gray.800'}
              m={{base: '1', md: '3'}}
              boxShadow="md"
              borderRadius="lg"
              key={option.id}
              direction={{base: 'column', md: 'row'}}
              spacing={{base: '2', md: '2'}}
              justify="space-between"
              my={{base: '0', md: '2'}}
            >
              <Box
                borderWidth="1px"
                borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
                borderRadius="lg"
                p={{base: '2', md: '2'}}
                flex="1"
              >
                <Radio
                  borderColor={colorMode === 'light' ? 'gray.300' : 'gray.600'}
                  colorScheme="blue"
                  size='sm' name='1'
                  value={option.value}
                  onChange={(e) => handleChange(e.target.value)}
                >
                  <Text fontSize="lg" fontWeight="bold">
                    {option.title}
                  </Text>
                </Radio>
              </Box>
            </Stack>
          ))}
        </RadioGroup>
      </Box>
    </Center >
  )
}




export default WhereHeFoundUs
