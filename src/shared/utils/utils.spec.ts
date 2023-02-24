import { extractUrlsFromString } from '.';

describe('extractUrlsFromString', () => {
  test('extract google meet urls', () => {
    const description =
      'Microsoft Teams meetingコンピューターまたはモバイル アプリで参加できます会議に参加するにはここをクリックしてください<https://teams.microsoft.com/l/meetup-join/19%3ameeting_MWJlZjUzOTUtMTEwMy00Yjg5LWE4NmYtNTBiNTA2Yjk0ZTkx%40thread.v2/0?context=%7b%22Tid%22%3a%2268941627-0400-4744-9e93-68fb975cf595%22%2c%22Oid%22%3a%22a7fdeeb5-8bc8-4eb2-8692-d55a0c9f2926%22%7d>';
    const meetingUrls = extractUrlsFromString(description);

    expect(meetingUrls.length).toEqual(1);
  });
});
