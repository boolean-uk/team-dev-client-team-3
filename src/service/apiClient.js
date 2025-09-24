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
async function login(email, password, rememberMe = false) {
  return await post('login', { email, password, longLifeToken: rememberMe }, false);
}

async function register(email, password, longLife = false) {
  await post('users', { email, password }, false);
  return await login(email, password, longLife);
}

async function patchProfile(userId, userData) {
  const { password, ...dataToSend } = userData;
  return await patch(`users/${userId}`, dataToSend, true, true);
}

// POST
async function getPosts() {
  const res = await get('posts');
  console.log('getPosts response:', res);
  return res.data;
}

async function postPost(userId, content) {
  const res = await post('posts', { userid: userId, content });
  return res.data;
}

async function deletePost(postId) {
  const res = await del(`posts/${postId}`);
  return res.data;
}

async function patchPost(postId, content) {
  const res = await patch(`posts/${postId}`, { content });
  return res.data;
}

// comments

async function getCommentByPostId(postId) {
  const res = await get(`posts/${postId}/comments`);
  console.log('getCommentByPostId response:', res);
  return res.data;
}

async function postComments(postId, userId, content) {
  const res = await post(`posts/${postId}/comments`, { userid: userId, content });
  return res.data;
}

async function deleteComment(commentId) {
  const res = await del(`comments/${commentId}`);
  return res.data;
}

async function patchComment(commentId, content) {
  const res = await patch(`comments/${commentId}`, { content });
  return res.data;
}

// USER
async function getUsers() {
  return await get('users', true, true);
}
async function getUserById(id) {
  return await get(`users/${id}`, true, true);
}

async function getUsersByName(name) {
  return await get(`users?name=${name}`, true, true);
}

async function patchUser(id, photoUrl) {
  return await patch(`users/${id}`, { photo: photoUrl });
}

// COHORTS
async function getCohorts() {
  return await get('cohorts');
}

async function postCohort(cohortData) {
  const res = await post('cohorts', cohortData);
  console.log(res);
  return res.data;
}

async function getCohortsForUser(userId) {
  return await get(`cohorts/userId/${userId}`);
}

async function addUserToCohort(cohortId, userId, courseId) {
  const res = await post(`cohorts/cohortId/${cohortId}/userId/${userId}/courseId/${courseId}`, {});
  return res.data;
}

// OTHER
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

export {
  getPosts,
  deletePost,
  postPost,
  patchPost,
  getCommentByPostId,
  postComments,
  deleteComment,
  patchComment,
  login,
  register,
  patchProfile,
  getUsers,
  getUsersByName,
  getUserById,
  getCohorts,
  getCohortsForUser,
  patchUser,
  postCohort,
  addUserToCohort
};
