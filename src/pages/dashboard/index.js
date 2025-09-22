import { useState, useEffect } from 'react';
import SearchIcon from '../../assets/icons/searchIcon';
import Button from '../../components/button';
import Card from '../../components/card';
import CreatePostModal from '../../components/createPostModal';
import TextInput from '../../components/form/textInput';
import Posts from '../../components/posts';
import useModal from '../../hooks/useModal';
import './style.css';
import ProfileCircle from '../../components/profileCircle';
import useAuth from '../../hooks/useAuth';
import { TEST_DATA_GET_USER_COHORT } from './testData';
import { AvatarList } from '../../components/avatarList';
import { useNavigate } from 'react-router-dom';
import Cohorts from '../../components/cohorts';
import Students from '../../components/students';
import Teachers from '../../components/teachers';
import { cohorts } from '../../service/mockData.js';
import {
  getUsers,
  getPosts,
  postPost,
  deletePost,
  patchPost,
  postComments,
  deleteComment,
  patchComment
} from '../../service/apiClient';

const Dashboard = () => {
  const { user } = useAuth();
  const { openModal, setModal } = useModal();
  const [searchVal, setSearchVal] = useState('');
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const userCohort = TEST_DATA_GET_USER_COHORT; // TODO: Replace with API-call
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);

  // **GET posts**
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsFromApi = await getPosts();
        setPosts(postsFromApi.reverse());
      } catch (err) {
        console.error('Failed to fetch posts', err);
      }
    };
    fetchPosts();
  }, []);

  // **POST post**
  const showModal = () => {
    const handlePostSubmit = async (text) => {
      try {
        const savedPost = await postPost(user.id, text);
        setPosts((prev) => [savedPost, ...prev]);
      } catch (err) {
        console.error('Failed to save post', err);
      }
    };

    setModal('Create a post', <CreatePostModal onPostSubmit={handlePostSubmit} />);
    openModal();
  };

  // **DELETE post**
  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      console.error('Failed to delete post', err);
    }
  };

  // **UPDATE post**
  const handleUpdatePost = async (postId, newContent) => {
    try {
      const updatedPost = await patchPost(postId, newContent);
      setPosts((prev) => prev.map((post) => (post.id === postId ? updatedPost : post)));
    } catch (err) {
      console.error('Failed to update post', err);
    }
  };

  // **POST comments**
  const handleCommentPost = async (postId, text) => {
    console.log('PostID:', postId, 'Text:', text, 'User:', user.id);
    try {
      const savedComment = await postComments(postId, user.id, text);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, comments: [...post.comments, savedComment] } : post
        )
      );
    } catch (err) {
      console.error('Failed to save comment', err);
    }
  };
  // **DELETE comments**
  const handleDeleteComment = async (postId, commentId) => {
    try {
      await deleteComment(commentId);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, comments: post.comments.filter((c) => c.id !== commentId) }
            : post
        )
      );
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };
  // **UPDATE comments**
  const handleUpdateComment = async (postId, commentId, newContent) => {
    try {
      const updatedComment = await patchComment(commentId, newContent);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map((c) => (c.id === commentId ? updatedComment : c))
              }
            : post
        )
      );
    } catch (err) {
      console.error('Failed to update comment', err);
    }
  };

  // Search input
  const onChange = (e) => setSearchVal(e.target.value);
  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchVal)}`);
      setSearchVal('');
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        const jsonData = await response.json();
        console.log(jsonData);

        // Student -> role 0
        const studentsData = jsonData.data.users.filter((u) => u.role === 0);
        setStudents(studentsData);
        // Teacher -> role 1
        const teachersData = jsonData.data.users.filter((u) => u.role === 1);
        setTeachers(teachersData);
      } catch (err) {
        console.error('Error getting users: ', err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <>
      <main>
        <Card>
          <div className="create-post-input">
            <ProfileCircle
              fullName={`${user.firstName} ${user.lastName}` || 'Unknown User'}
              photoUrl={user.photo}
            />
            <Button text="What's on your mind?" onClick={showModal} />
          </div>
        </Card>

        <Posts
          posts={posts}
          onDelete={handleDeletePost}
          onUpdate={handleUpdatePost}
          onCommentPost={handleCommentPost}
          onCommentDelete={handleDeleteComment}
          onCommentUpdate={handleUpdateComment}
        />
      </main>

      <aside>
        <Card>
          <form onSubmit={onSearchSubmit}>
            <TextInput
              value={searchVal}
              name="search"
              onChange={onChange}
              placeholder="Search for people"
              icon={<SearchIcon />}
            />
          </form>
        </Card>

        {user.role === 0 && (
          <Card>
            <h4>My Cohort</h4>
            <AvatarList subtitle={userCohort.cohortName} users={userCohort.people} contextButton />
          </Card>
        )}
        {user.role === 1 && (
          <div>
            <Card>
              <Cohorts data={cohorts} />
            </Card>
            <Card>
              <Students data={students} />
            </Card>
            <Card>
              <Teachers data={teachers} />
            </Card>
          </div>
        )}
      </aside>
    </>
  );
};

export default Dashboard;
