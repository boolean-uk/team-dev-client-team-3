import { API_URL } from './constants';
const DEBUG = process.env.REACT_APP_DEBUG_API_LOGS === '1';

async function login(email, password) {
  return await post('login', { email, password }, false);
}

async function register(email, password) {
  await post('users', { email, password }, false);
  return await login(email, password);
}

async function createProfile(userId, userData) {
  const { password, ...dataToSend } = userData;
  return await patch(`users/${userId}`, dataToSend, true, true);
}

async function getPosts() {
  const res = await get('posts');
  return res.data.posts;
}

async function post(endpoint, data, auth = true, getFullResponse = false) {
  return await request('POST', endpoint, data, auth, getFullResponse);
}

async function patch(endpoint, data, auth = true, getFullResponse = false) {
  return await request('PATCH', endpoint, data, auth, getFullResponse);
}

async function get(endpoint, auth = true, getFullResponse = false) {
  return await request('GET', endpoint, null, auth, getFullResponse);
}

async function request(method, endpoint, data, auth = true, getFullResponse = false) {
  const opts = {
    headers: {
      'Content-Type': 'application/json'
    },
    method
  };

  if (method.toUpperCase() !== 'GET') {
    opts.body = JSON.stringify(data);
  }

  if (auth) {
    // eslint-disable-next-line dot-notation
    opts.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  }

  const response = await fetch(`${API_URL}/${endpoint}`, opts);
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.log('[apiClient]', method, `${API_URL}/${endpoint}`, opts);
    // eslint-disable-next-line no-console
    console.log('[apiClient] status =', response.status, response.statusText);
  }
  if (!getFullResponse) {
    return response.json();
  } else {
    return response;
  }
}

export { login, getPosts, register, createProfile };
