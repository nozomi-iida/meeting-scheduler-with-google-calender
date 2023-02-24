import { ReactElement, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import qs from 'qs';

import { AlarmConfig } from '../background';
import { CalenderEvent } from '../shared/google-calender/types';
import { extractUrlsFromString } from '../shared/utils';

const Popup = (): ReactElement => {
  const [isSignIn, setIsSignIn] = useState(true);

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
        // TODO: 日本時間にする
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
        const meetingUrls = extractUrlsFromString(item.description);
        if (item.hangoutLink) {
          meetingUrls.push(item.hangoutLink);
        }

        meetingUrls.forEach((meetingUrl) => {
          const alarmConfig: AlarmConfig = {
            name: 'meeting',
            meetingUrl: meetingUrl,
          };

          chrome.alarms.create(JSON.stringify(alarmConfig), {
            when: new Date(item.start.dateTime).getTime(),
          });
        });
      });
    });
  };

  useEffect(() => {
    chrome.identity.getAuthToken({}, function (token) {
      if (token) {
        chrome.storage.local.set({ token });
        setIsSignIn(!!token);
      }
    });
  }, []);

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="whitespace-nowrap text-2xl">Meeting Scheduler</h1>
      {isSignIn ? (
        <button
          onClick={onSetMeetings}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block mx-auto"
        >
          Set Meetings
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
