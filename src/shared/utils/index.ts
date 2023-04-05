import dayjs from 'dayjs';

import { AlarmConfig } from '../../background';
import { calenderClient } from '../google-calender/calenderClient';
import { Calender, CalenderEvent } from '../google-calender/types';

export const meetingApps: string[] = [
  'https://zoom.us/',
  'https://www.microsoft.com/',
  'https://meet.google.com/',
  'https://www.webex.com/',
  'https://www.skype.com/',
  'https://teams.microsoft.com/',
];

// get meeting urls from string
export const extractUrlsFromString = (str: string): string[] => {
  const urlRegex = /(https?|ftp)(:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+)/g;

  const urls = str.match(urlRegex) || [];

  const meetingUrls = urls.filter((url) => {
    let matched = false;
    meetingApps.forEach((app) => {
      matched = url.startsWith(app);
    });

    return matched;
  });

  return meetingUrls;
};

export const getGoogleAuthToken = (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.identity.getAuthToken({}, (token) => {
      if (token) {
        resolve(token);
      } else {
        resolve('');
      }
    });
  });
};

export const getAlarms = (): Promise<chrome.alarms.Alarm[]> => {
  return new Promise((resolve) => {
    chrome.alarms.getAll((alarms) => {
      resolve(alarms);
    });
  });
};

export const removeAlarms = async () => {
  const alarms = await getAlarms();

  alarms.forEach((alarm) => {
    chrome.alarms.clear(alarm.name);
  });
};

export const getCalenders = async (): Promise<Calender[]> => {
  const calenderData = await calenderClient<{ items: Calender[] }>('/users/me/calendarList');
  const nonReaderCalenders = calenderData.data.items.filter(
    (calender) => calender.accessRole !== 'reader'
  );
  return nonReaderCalenders;
};

export const getActiveCalenderIds = async () => {
  const activeCalenderIds = await new Promise<string[]>((resolve) => {
    chrome.storage.sync.get(['calenderIds'], (result) => {
      if (result.calenderIds) {
        resolve(result.calenderIds);
      } else {
        resolve([]);
      }
    });
  });

  if (activeCalenderIds.length) {
    return activeCalenderIds;
  } else {
    const calenders = await getCalenders();
    const calenderIds = calenders.map((calender) => calender.id);
    return calenderIds;
  }
};

export const getEvents = async (): Promise<CalenderEvent[]> => {
  const events: CalenderEvent[] = [];
  const calenderIds = await getActiveCalenderIds();

  const query = {
    timeMax: dayjs().endOf('day').toISOString(),
    timeMin: dayjs().startOf('day').toISOString(),
  };
  await Promise.all(
    calenderIds.map(async (calenderId) => {
      const eventsData = await calenderClient<{ items: CalenderEvent[] }>(
        `/calendars/${calenderId}/events`,
        { params: query }
      );
      events.push(...eventsData.data.items);
    })
  );

  events.sort((a, b) => {
    const aTime = new Date(a.start.dateTime).getTime();
    const bTime = new Date(b.start.dateTime).getTime();
    return aTime - bTime;
  });

  return events;
};

export const addAlarms = (events: CalenderEvent[]): AlarmConfig[] => {
  const alarmConfigs: AlarmConfig[] = [];
  events.forEach((event) => {
    if (new Date().getTime() > new Date(event.start.dateTime).getTime()) return;

    const meetingUrls = extractUrlsFromString(event.description ?? '');
    if (event.hangoutLink) {
      meetingUrls.push(event.hangoutLink);
    }

    meetingUrls.forEach((meetingUrl) => {
      const alarmConfig: AlarmConfig = {
        name: 'meeting',
        title: event.summary,
        htmlLink: event.htmlLink,
        meetingUrl: meetingUrl,
        startTime: event.start.dateTime,
      };

      chrome.alarms.create(JSON.stringify(alarmConfig), {
        when: new Date(event.start.dateTime).getTime(),
      });

      alarmConfigs.push(alarmConfig);
    });
  });
  return alarmConfigs;
};
