export const API_URL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL
  : 'https://localhost:7233';

// Optional debug logging controlled by REACT_APP_DEBUG_API_LOGS
if (process.env.REACT_APP_DEBUG_API_LOGS === '1') {
  // eslint-disable-next-line no-console
  console.log('[constants] Using API_URL =', API_URL);
}
