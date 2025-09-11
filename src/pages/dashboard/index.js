import { useState } from 'react';
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

const Dashboard = () => {
  const { user } = useAuth();
  const { openModal, setModal } = useModal();

  const [searchVal, setSearchVal] = useState('');
  const [posts, setPosts] = useState([]); // TODO: Replace with API-call
  const userCohort = TEST_DATA_GET_USER_COHORT; // TODO: Replace with API-call

  const onChange = (e) => {
    setSearchVal(e.target.value);
  };

  const showModal = () => {
    const handlePostSubmit = (text) => {
      setPosts((prev) => [{ id: Date.now(), text }, ...prev]);
    };

    setModal('Create a post', <CreatePostModal onPostSubmit={handlePostSubmit} />);
    openModal();
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

        <Posts posts={posts} onDelete={(id) => setPosts(posts.filter((post) => post.id !== id))} />
      </main>

      <aside>
        <Card>
          <form onSubmit={(e) => e.preventDefault()}>
            <TextInput icon={<SearchIcon />} value={searchVal} name="Search" onChange={onChange} />
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
