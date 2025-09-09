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

const Dashboard = () => {
  const [searchVal, setSearchVal] = useState('');
  const [posts, setPosts] = useState([]);
  const { openModal, setModal } = useModal();
  const onChange = (e) => setSearchVal(e.target.value);
  const { user } = useAuth();

  const name = user ? `${user.firstName} ${user.lastName}` : 'Unknown User';

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
            <ProfileCircle fullName={name} />
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
        </Card>
      </aside>
    </>
  );
};

export default Dashboard;
