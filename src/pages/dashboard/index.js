import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '../../assets/icons/searchIcon';
import Button from '../../components/button';
import Card from '../../components/card';
import CreatePostModal from '../../components/createPostModal';
import TextInput from '../../components/form/textInput';
import Posts from '../../components/posts';
import useModal from '../../hooks/useModal';
import useAuth from '../../hooks/useAuth';
import ProfileCircle from '../../components/profileCircle';
import { AvatarList } from '../../components/avatarList';
import Cohorts from '../../components/cohorts';
import {
  getPosts,
  postPost,
  getCohortsForUser,
  getCohorts,
  deletePost,
  patchPost,
  postComments,
  deleteComment,
  patchComment,
  getCommentByPostId
} from '../../service/apiClient';
import './style.css';
import Skeleton, { AvatarListSkeleton, CohortSkeleton, PostSkeleton } from '../../components/skeleton/Skeleton';

const Dashboard = () => {
  const { user } = useAuth();
  const { openModal, setModal } = useModal();
  const navigate = useNavigate();

  const [searchVal, setSearchVal] = useState('');
  const [posts, setPosts] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState(null);

  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingCohorts, setLoadingCohorts] = useState(true);


  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsFromApi = await getPosts();
        setPosts(postsFromApi.reverse());
      } catch (err) {
        console.error('Failed to fetch posts', err);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, []);

  // Fetch cohorts
  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        if (user.role === 0) {
          const json = await getCohortsForUser(user.id);
          const cohortData = json.data || json;
          if (cohortData.length > 0) setSelectedCohort(cohortData[0]);
        } else {
          const json = await getCohorts();
          const cohortData = json.data || json;
          setCohorts(cohortData);
        }
      } catch (err) {
        console.error('Error fetching cohorts:', err);
      } finally {
        setLoadingCohorts(false);
      }
    };
    fetchCohorts();
  }, [user]);


  // Post modal
  const showModal = () => {
    const handlePostSubmit = async (text) => {
      try {
        const savedPost = await postPost(user.id, text);
        setPosts(prev => [savedPost, ...prev]);
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
      const refreshedComments = await getCommentByPostId(postId);

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...updatedPost, comments: refreshedComments } : post
        )
      );
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

  // Utility functions
  const getStudentsInCohort = (cohort) => cohort?.courses.flatMap(c => c.students || []) || [];
  const getTeachersInCohort = (cohort) => cohort?.courses.flatMap(c => c.teachers || []) || [];

  return (
    <>
      <main>
        <Card>
          <div className="create-post-input">
            <ProfileCircle fullName={`${user.firstName} ${user.lastName}`} photoUrl={user.photo} />
            <Button text="What's on your mind?" onClick={showModal} />
          </div>
        </Card>

        {loadingPosts ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : (
          <Posts
            posts={posts}
            onDelete={handleDeletePost}
            onUpdate={handleUpdatePost}
            onCommentPost={handleCommentPost}
            onCommentDelete={handleDeleteComment}
            onCommentUpdate={handleUpdateComment}
          />
        )}
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

        {loadingCohorts ? (
          <>
            <Card>
              <p>Cohorts</p>
              <CohortSkeleton />
            </Card>
            <Card>
              <p>Students</p>
              <AvatarListSkeleton />
            </Card>
            <Card>
              <p>Teachers</p>
              <AvatarListSkeleton />
            </Card>
          </>
        ) : (
          <>
            {/* Student view */}
            {user.role === 0 && selectedCohort && (
              <>
                <Card>
                  <h3>{selectedCohort.title}</h3>
                  <p>Students</p>
                  <div className="students-list-container">
                    <AvatarList users={getStudentsInCohort(selectedCohort)} contextButton />
                  </div>
                </Card>
                <Card>
                  <p>Teachers</p>
                  <div className="teachers-list-container">
                    <AvatarList users={getTeachersInCohort(selectedCohort)} contextButton={false} />
                  </div>
                </Card>
              </>
            )}

            {/* Teacher view */}
            {user.role === 1 && (
              <>
                <Card><Cohorts data={cohorts} /></Card>
                <Card>
                  <h4>All Students</h4>
                  <div className="students-list-container">
                    <AvatarList users={getStudentsInCohort({ courses: cohorts.flatMap(c => c.courses) })} contextButton />
                  </div>
                </Card>
                <Card>
                  <h4>All Teachers</h4>
                  <div className="teachers-list-container">
                    <AvatarList users={getTeachersInCohort({ courses: cohorts.flatMap(c => c.courses) })} contextButton={false} />
                  </div>
                </Card>
              </>
            )}
          </>
        )}
      </aside>


    </>
  );
};

export default Dashboard;
