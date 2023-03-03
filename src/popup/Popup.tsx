import { ReactElement, useEffect, useState } from 'react';
import { Box, Button, ChakraProvider, Flex, Heading, Icon, Link, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { ExternalLink } from 'tabler-icons-react';

import { AlarmConfig } from '../background';
import { useAuth } from '../hooks/useAuth';
import { addAlarms, getEvents, removeAlarms } from '../shared/utils';

const Popup = (): ReactElement => {
  const { token, onSignIn } = useAuth();
  const [alarms, setAlarms] = useState<AlarmConfig[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onSetMeetings = async () => {
    setIsLoading(true);
    removeAlarms();
    const events = await getEvents();
    const alarmConfigs = addAlarms(events);
    setAlarms(alarmConfigs);
    setIsLoading(false);
  };

  const onOpenEvent = (htmlLink: string) => {
    chrome.tabs.create({ url: htmlLink });
  };

  useEffect(() => {
    if (!token) return;

    chrome.alarms.getAll((alarms) => {
      const alarmConfigs: AlarmConfig[] = [];
      alarms.forEach((el) => {
        alarmConfigs.push(JSON.parse(el.name));
      });
      setAlarms(alarmConfigs);
    });
  }, [token]);

  return (
    <ChakraProvider>
      <Flex flexDir="column" gap={2} p={4}>
        <Heading whiteSpace="nowrap">Meeting Scheduler</Heading>
        <Text fontSize="lg" fontWeight="bold">
          Today Meetings
        </Text>
        <Box>
          {alarms.map((alarm) => (
            <Flex fontSize="md" align="center" key={alarm.htmlLink}>
              <Link mr="4px" onClick={() => onOpenEvent(alarm.htmlLink)}>
                {dayjs(alarm.startTime).format('A h:mm')} {alarm.title}
              </Link>
              <Icon as={ExternalLink} />
            </Flex>
          ))}
        </Box>
        {token ? (
          <Button colorScheme="blue" onClick={onSetMeetings} isLoading={isLoading}>
            Refetch Meetings
          </Button>
        ) : (
          <Button colorScheme="blue" onClick={onSignIn}>
            Sign In
          </Button>
        )}
      </Flex>
    </ChakraProvider>
  );
};

export default Popup;
