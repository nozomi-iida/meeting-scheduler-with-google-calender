import { ReactElement, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import qs from 'qs';

import { AlarmConfig } from '../background';
import { CalenderEvent } from '../shared/google-calender/types';
import { extractUrlsFromString } from '../shared/utils';

const Popup = (): ReactElement => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [alarms, setAlarms] = useState<AlarmConfig[]>([]);

  const onSignIn = () => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      chrome.storage.local.set({ token });
      setIsSignIn(!!token);
    });
  };
  const onSetMeetings = () => {
    chrome.storage.local.get('token', async (item) => {
      if (!item.token) return;

      const query = qs.stringify({
        timeMax: dayjs().endOf('day').toISOString(),
        timeMin: dayjs().startOf('day').toISOString(),
      });
      const eventsData = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/iida19990106@gmail.com/events?${query}`,
        {
          headers: {
            Authorization: `Bearer ${item.token}`,
          },
        }
      ).then((res) => res.json());
      const calenderItems: CalenderEvent[] = eventsData.items;

      calenderItems.forEach((item) => {
        if (new Date().getTime() > new Date(item.start.dateTime).getTime()) return;

        const meetingUrls = extractUrlsFromString(item.description);
        if (item.hangoutLink) {
          meetingUrls.push(item.hangoutLink);
        }
        const alarmConfigs: AlarmConfig[] = [];

        meetingUrls.forEach((meetingUrl) => {
          const alarmConfig: AlarmConfig = {
            name: 'meeting',
            title: item.summary,
            meetingUrl: meetingUrl,
            startTime: item.start.dateTime,
          };
          alarmConfigs.push(alarmConfig);

          const alarmTitles = alarms.map((alarm) => alarm.title);
          if (!alarmTitles.includes(item.summary)) return;

          chrome.alarms.create(JSON.stringify(alarmConfig), {
            when: new Date(item.start.dateTime).getTime(),
          });
        });
        setAlarms(alarmConfigs);
      });
    });
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
