import { API_URL } from './constants';

// Helper functions for HTTP methods
async function post(endpoint, data, auth = true, getFullResponse = false) {
  return await request('POST', endpoint, data, auth, getFullResponse);
}

async function patch(endpoint, data, auth = true, getFullResponse = false) {
  return await request('PATCH', endpoint, data, auth, getFullResponse);
}

async function get(endpoint, auth = true, getFullResponse = false) {
  return await request('GET', endpoint, null, auth, getFullResponse);
}

async function del(endpoint, data, auth = true, getFullResponse = false) {
  return await request('DELETE', endpoint, data, auth, getFullResponse);
}


// API functions
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

// funky name
async function postPost(userId, content) {
  const res = await post('posts', { userid: userId, content });
  return res.data;
}

async function deletePost(postId) {
  const res = await del(`posts/${postId}`);
  return res.data;
}

async function getPosts() {
  const res = await get('posts');
  console.log('getPosts response:', res);
  return res.data;
}

async function getUsers() {
  return await get('users', true, true);
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

export { login, getPosts, register, createProfile, getUsers, postPost, deletePost };
