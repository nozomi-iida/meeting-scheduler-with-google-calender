import { addAlarms, getEvents, removeAlarms } from '../shared/utils';

export type AlarmConfig = {
  name: 'meeting';
  title: string;
  htmlLink: string;
  meetingUrl: string;
  startTime: string;
};

chrome.alarms.onAlarm.addListener((alarm) => {
  const alarmConfig: AlarmConfig = JSON.parse(alarm.name);

  if (alarmConfig.name === 'meeting') {
    chrome.tabs.create(
      {
        url: alarmConfig.meetingUrl,
      },
      () => {
        chrome.notifications.create(alarmConfig.name, {
          type: 'basic',
          iconUrl: '/images/meeting_32.png',
          title: 'Meeting',
          message: `Meeting: ${alarmConfig.title} is starting now!`,
        });
      }
    );
    return;
  }
});

chrome.runtime.onStartup.addListener(async () => {
  await removeAlarms();
  const events = await getEvents();
  await addAlarms(events);
});

export {};
