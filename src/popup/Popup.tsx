import { ReactElement, useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { AlarmConfig } from '../background';
import { addAlarms, getEvents, removeAlarms } from '../shared/utils';

const Popup = (): ReactElement => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [alarms, setAlarms] = useState<AlarmConfig[]>([]);

  const onSignIn = () => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      chrome.storage.local.set({ token });
      setIsSignIn(!!token);
    });
  };

  const onSetMeetings = async () => {
    removeAlarms();
    const events = await getEvents();
    const alarmConfigs = addAlarms(events);
    setAlarms(alarmConfigs);
  };

  useEffect(() => {
    chrome.identity.getAuthToken({}, function (token) {
      if (token) {
        chrome.storage.local.set({ token });
        setIsSignIn(!!token);
        chrome.alarms.getAll((alarms) => {
          const alarmConfigs: AlarmConfig[] = [];
          alarms.forEach((el) => {
            alarmConfigs.push(JSON.parse(el.name));
          });
          setAlarms(alarmConfigs);
        });
      }
    });
  }, []);

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="whitespace-nowrap text-2xl">Meeting Scheduler</h1>
      <p className="text-xl">Today Meetings</p>
      {alarms.map((alarm) => (
        <div key={alarm.title} className="flex gap-2">
          <p>{dayjs(alarm.startTime).format('A h:mm')}</p>
          <p>{alarm.title}</p>
        </div>
      ))}
      {isSignIn ? (
        <button
          onClick={onSetMeetings}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block mx-auto"
        >
          Refetch Meetings
        </button>
      ) : (
        <button
          onClick={onSignIn}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block mx-auto"
        >
          Sign In
        </button>
      )}
    </div>
  );
};

export default Popup;
