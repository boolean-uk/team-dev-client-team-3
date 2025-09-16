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
import { getPosts, postPost, deletePost, patchPost } from '../../service/apiClient';

const Dashboard = () => {
  const { user } = useAuth();
  const { openModal, setModal } = useModal();
  const [searchVal, setSearchVal] = useState('');
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const userCohort = TEST_DATA_GET_USER_COHORT; // TODO: Replace with API-call

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
    setPosts(prev => prev.map(post => (post.id === postId ? updatedPost : post)));
  } catch (err) {
    console.error('Failed to update post', err);
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

  return (
    <>
      <main>
        <Card>
          <div className="create-post-input">
            <ProfileCircle fullName={`${user.firstName} ${user.lastName}` || 'Unknown User'} />
            <Button text="What's on your mind?" onClick={showModal} />
          </div>
        </Card>

        <Posts 
          posts={posts} 
          onDelete={handleDeletePost} 
          onUpdate={handleUpdatePost} 
        />
      </main>

      <aside>
        <Card>
          <form onSubmit={onSearchSubmit}>
            <TextInput value={searchVal} name="search" onChange={onChange} icon={<SearchIcon />} />
          </form>
        </Card>

        <Card>
          <h4>My Cohort</h4>
          <AvatarList subtitle={userCohort.cohortName} users={userCohort.people} contextButton />
        </Card>
      </aside>
    </>
  );
};

export default Dashboard;
