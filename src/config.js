const APP_ENV = process.env.NODE_ENV == 'production' ? 'prod' : 'dev';

const IS_PROD = APP_ENV === 'prod';

const IS_DEV = !IS_PROD;

const SERVER_PORT = process.env.PORT || '3000';

const YT1S_URL = 'https://ytdl-get-video-info.vercel.app' || 'https://yt1s.com';

const YT1S_INDEX = `${YT1S_URL}/api/ajaxSearch/index`;

const YT1S_CONVERT = `${YT1S_URL}/api/ajaxConvert/convert`;

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0 Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0';

module.exports = {
  APP_ENV,
  IS_PROD,
  IS_DEV,
  SERVER_PORT,
  YT1S_URL,
  YT1S_INDEX,
  YT1S_CONVERT,
  USER_AGENT,
};
