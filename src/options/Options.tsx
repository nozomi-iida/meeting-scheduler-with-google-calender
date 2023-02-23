import { ReactElement, useEffect, useState } from 'react';

const Options = (): ReactElement => {
  const [calenders, setCalenders] = useState([]);

  useEffect(() => {
    chrome.storage.local.get('token', async (item) => {
      if (!item.token) return;

      const calendersData = await fetch(
        'https://www.googleapis.com/calendar/v3/users/me/calendarList',
        {
          headers: {
            Authorization: `Bearer ${item.token}`,
          },
        }
      ).then((res) => res.json());

      const eventsData = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/iida19990106@gmail.com/events',
        {
          headers: {
            Authorization: `Bearer ${item.token}`,
          },
        }
      ).then((res) => res.json());
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl">Options</h1>
      <ul></ul>
    </div>
  );
};

export default Options;
