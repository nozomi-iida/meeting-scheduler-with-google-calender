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
  Spinner,
  VStack,
} from '@chakra-ui/react';

import { useAuth } from '../hooks/useAuth';
import { Calender } from '../shared/google-calender/types';
import { getActiveCalenderIds, getCalenders } from '../shared/utils';

const Options = (): ReactElement => {
  const [calenders, setCalenders] = useState<Calender[]>();
  const [selectedCalenderIds, setSelectedCalenderIds] = useState<string[]>();
  const { token, onSignIn, onSignOut } = useAuth();
  const onChangeCalenders = (calenderIds: string[]) => {
    chrome.storage.sync.set({ calenderIds }, () => {
      setSelectedCalenderIds(calenderIds);
    });
  };

  useEffect(() => {
    (async () => {
      if (!token) return;

      const calenders = await getCalenders();
      setCalenders(calenders);
      const activeCalenderIds = await getActiveCalenderIds();
      setSelectedCalenderIds(activeCalenderIds);
    })();
  }, [token]);

  return (
    <ChakraProvider>
      <Box maxW="530px" w="full" mx="auto" py={14}>
        <Heading fontWeight="normal">Meeting Scheduler</Heading>
        <Heading my={12} fontWeight="normal" as="h3" size="lg">
          Settings
        </Heading>
        <Box border="solid 1px #dde2e7" p={8} borderRadius="sm">
          {token ? (
            <Flex flexDir="column" gap={4}>
              {calenders?.length && selectedCalenderIds?.length ? (
                <FormControl>
                  <FormLabel fontSize="lg" fontWeight="bold">
                    Calenders List
                  </FormLabel>
                  <VStack align="start">
                    <CheckboxGroup value={selectedCalenderIds} onChange={onChangeCalenders}>
                      {calenders.map((calender) => (
                        <Checkbox value={calender.id} key={calender.id}>
                          {calender.summary}
                        </Checkbox>
                      ))}
                    </CheckboxGroup>
                  </VStack>
                </FormControl>
              ) : (
                <Spinner color="blue.500" mx="auto" />
              )}
              <Box>
                <Button colorScheme="red" onClick={onSignOut}>
                  Sign Out
                </Button>
              </Box>
            </Flex>
          ) : (
            <Button colorScheme="blue" onClick={onSignIn}>
              Sign In
            </Button>
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Options;
