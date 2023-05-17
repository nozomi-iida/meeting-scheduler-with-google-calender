import { useEffect, useState } from 'react';

import { getGoogleAuthToken } from '../shared/utils';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const onSignIn = () => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      setToken(token);
    });
  };

  const onSignOut = () => {
    if (!token) return;

    chrome.identity.removeCachedAuthToken({ token }, function () {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://accounts.google.com/o/oauth2/revoke?token=' + token);
      xhr.send();

      setToken(null);
    });
  };

  useEffect(() => {
    (async () => {
      const token = await getGoogleAuthToken();
      if (!token) return;

      setToken(token);
    })();
  }, []);

  return { token, onSignIn, onSignOut };
};
