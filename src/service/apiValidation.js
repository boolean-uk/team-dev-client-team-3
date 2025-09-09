import { API_URL } from './constants';

export const validatePassword = async (password) => {
  return await post('validation/password/', { password }, false);
};

export const validateEmail = async (email) => {
  return await get('validation/email/' + email, false);
};

export const validateUsername = async (username) => {
  return await get(`validation/username/?username=${username}`, false);
};

async function post(endpoint, data, auth = true) {
  return await request('POST', endpoint, data, auth);
}

// eslint-disable-next-line no-unused-vars
async function patch(endpoint, data, auth = true) {
  return await request('PATCH', endpoint, data, auth);
}

async function get(endpoint, auth = true) {
  return await request('GET', endpoint, null, auth);
}
async function request(method, endpoint, data, auth = true) {
  const opts = { headers: { 'Content-Type': 'application/json' }, method };
  if (method.toUpperCase() !== 'GET') {
    opts.body = JSON.stringify(data);
  }
  if (auth) {
    opts.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  const response = await fetch(`${API_URL}/${endpoint}`, opts);
  return response;
}
