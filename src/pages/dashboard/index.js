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
import { getUsers } from '../../service/apiClient';
import Cohorts from '../../components/cohorts';
import Students from '../../components/students';
import Teachers from '../../components/teachers';
import { cohorts } from '../../service/mockData.js';

const Dashboard = () => {
  const { user } = useAuth();
  const { openModal, setModal } = useModal();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const [posts, setPosts] = useState([]); // TODO: Replace with API-call
  const userCohort = TEST_DATA_GET_USER_COHORT; // TODO: Replace with API-call
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const onChange = (e) => {
    setSearchVal(e.target.value);
  };

  // eslint-disable-next-line no-unused-vars
  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchVal)}`);
      setSearchVal('');
    }
  };

  const showModal = () => {
    const handlePostSubmit = (text) => {
      setPosts((prev) => [{ id: Date.now(), text }, ...prev]);
    };

    setModal('Create a post', <CreatePostModal onPostSubmit={handlePostSubmit} />);
    openModal();
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

        <Posts posts={posts} onDelete={(id) => setPosts(posts.filter((post) => post.id !== id))} />
      </main>

      <aside>
        <Card>
          <form onSubmit={onSearchSubmit}>
            <TextInput value={searchVal} name="search" onChange={onChange} icon={<SearchIcon />} />
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
