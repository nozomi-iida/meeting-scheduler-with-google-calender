import { extractUrlsFromString } from '.';

describe('extractUrlsFromString', () => {
  test('extract google meet urls', () => {
    const url = 'https://sakura.zoom.us/j/87544736063?pwd=U0l6U0V5RVJWM2l0eFRNbG1qb1Bsdz09';
    const description = `
      <br><br>
      <p>時間: 2023年4月5日 08:30 PM 大阪、札幌、東京</p>
      <p>Zoomミーティングに参加する
        <br>
        <a href=${url}>https://sakura.zoom.us/j/87544736063?pwd=U0l6U0V5RVJWM2l0eFRNbG1qb1Bsdz09</a>
      </p>
      <p>ミーティングID: 875 4473 6063<br>パスコード: 106609</p>
    `;

    const meetingUrls = extractUrlsFromString(description);

    expect(meetingUrls.length).toEqual(1);

    expect(meetingUrls[0]).toEqual(url);
  });
});
