import { ManifestV3Export } from '@crxjs/vite-plugin';
import * as dotenv from 'dotenv';
dotenv.config();

const isDev = process.env.VITE_ENV === 'dev';
const name = isDev
  ? '(dev)meeting-scheduler-with-google-calender'
  : 'meeting-scheduler-with-google-calender';

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name,
  description:
    'A google extention that works with google calender and automatically opens the meeting URL when the time comes',
  version: '0.3',
  background: {
    service_worker: 'src/background/index.ts',
  },
  host_permissions: ['<all_urls>'],
  options_ui: {
    page: 'src/options/options.html',
    open_in_tab: true,
  },
  action: {
    default_popup: 'src/popup/popup.html',
    default_icon: {
      '16': 'images/meeting_16.png',
      '32': 'images/meeting_32.png',
      '48': 'images/meeting_48.png',
      '128': 'images/meeting_128.png',
    },
  },
  icons: {
    '16': 'images/meeting_16.png',
    '32': 'images/meeting_32.png',
    '48': 'images/meeting_48.png',
    '128': 'images/meeting_128.png',
  },
  permissions: ['storage', 'identity', 'alarms', 'notifications'],
  oauth2: {
    client_id: '864721882424-mjqtouoq25u43pb2d8cbvvfsdg5shnq5.apps.googleusercontent.com',
    scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  },
};

export default manifest;
