import { API_URL } from './constants';

async function login(email, password) {
  return await post('login', { email, password }, false);
}

async function register(email, password) {
  await post('users', { email, password }, false);
  return await login(email, password);
}

async function patchProfile(userId, userData) {
  const { password, ...dataToSend } = userData;
  return await patch(`users/${userId}`, dataToSend, true, true);
}

async function getPosts() {
  const res = await get('posts');
  return res.data.posts;
}

async function getUsers() {
  return await get('users', true, true);
}
async function getUserById(id) {
  return await get(`users/${id}`, true, true);
}

async function getUsersByName(name) {
  return await get(`users?name=${name}`, true, true);
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

  console.log('request: ', `${API_URL}/${endpoint}`);
  const response = await fetch(`${API_URL}/${endpoint}`, opts);

  if (!getFullResponse) {
    return response.json();
  } else {
    return response;
  }
}

export { login, getPosts, register, patchProfile, getUsers, getUsersByName, getUserById };
