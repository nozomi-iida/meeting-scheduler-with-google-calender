import { ReactElement, useEffect, useState } from 'react';
import {
  Box,
  Button,
  ChakraProvider,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  VStack,
} from '@chakra-ui/react';

import { Calender } from '../shared/google-calender/types';
import { getCalenders } from '../shared/utils';

const Options = (): ReactElement => {
  const [calenders, setCalenders] = useState<Calender[]>([]);

  useEffect(() => {
    (async () => {
      const calenders = await getCalenders();
      setCalenders(calenders);
    })();

    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      console.log(token);
    });
  }, []);

  return (
    <ChakraProvider>
      <Box maxW="530px" w="full" mx="auto" py={14}>
        <Heading fontWeight="normal">Meeting Scheduler</Heading>
        <Heading my={12} fontWeight="normal" as="h3" size="lg">
          Settings
        </Heading>
        <Flex flexDir="column" gap={4} border="solid 1px #dde2e7" p={8} borderRadius="sm">
          <FormControl>
            <FormLabel fontSize="lg" fontWeight="bold">
              Calenders List
            </FormLabel>
            <VStack align="start">
              <CheckboxGroup>
                {calenders.map((calender) => (
                  <Checkbox value={calender.id} key={calender.id}>
                    {calender.summary}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </VStack>
          </FormControl>
          <Box>
            <Button colorScheme="red">Sign Out</Button>
          </Box>
        </Flex>
      </Box>
    </ChakraProvider>
  );
};

export default Options;
