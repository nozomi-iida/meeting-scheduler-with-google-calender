export const isDev = process.env.NODE_ENV === 'development';

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
