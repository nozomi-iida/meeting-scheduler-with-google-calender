import { ReactElement, useEffect, useState } from 'react';
const Popup = (): ReactElement => {
  const [isSignIn, setIsSignIn] = useState(false);

  const onClick = () => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      setIsSignIn(!!token);
    });
  };
  useEffect(() => {
    chrome.identity.getAuthToken({}, function (token) {
      if (token) {
        setIsSignIn(!!token);
      }
    });
  }, []);

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="whitespace-nowrap text-2xl">Meeting Scheduler</h1>
      {!isSignIn && (
        <button
          onClick={onClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block mx-auto"
        >
          Sign In
        </button>
      )}
    </div>
  );
};

export default Popup;
