export type AlarmConfig = {
  name: 'meeting';
  meetingUrl: string;
};
chrome.alarms.onAlarm.addListener((alarm) => {
  const alarmConfig: AlarmConfig = JSON.parse(alarm.name);

  if (alarmConfig.name === 'meeting') {
    chrome.tabs.create({
      url: alarmConfig.meetingUrl,
    });
  }
});

export {};
