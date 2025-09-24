import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/button';
import Card from '../../components/card';
import CreatePostModal from '../../components/createPostModal';
import TextInput from '../../components/form/textInput';
import Posts from '../../components/posts';
import useModal from '../../hooks/useModal';
import useAuth from '../../hooks/useAuth';
import ProfileCircle from '../../components/profileCircle';
import Cohorts from '../../components/cohorts';
import SearchIcon from '../../assets/icons/searchIcon';
import {
  AvatarListSkeleton,
  CohortSkeleton,
  PostSkeleton
} from '../../components/skeleton/Skeleton';
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
import Students from '../../components/students';
import Teachers from '../../components/teachers';

// This class has too much responsibility and should be refactored!

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

  // Utility functions
  const getStudentsInCohort = (cohort) => cohort?.courses.flatMap((c) => c.students || []) || [];
  const getTeachersInCohort = (cohort) => cohort?.courses.flatMap((c) => c.teachers || []) || [];

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsFromApi = await getPosts();
        setPosts(postsFromApi.reverse());
      } catch (err) {
        console.error(err);
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
        let cohortData;
        if (user.role === 0) {
          const json = await getCohortsForUser(user.id);
          cohortData = json.data || json;
          if (cohortData.length > 0) setSelectedCohort(cohortData[0]);
        } else {
          const json = await getCohorts();
          cohortData = json.data || json;
          setCohorts(cohortData);
        }
      } catch (err) {
        console.error(err);
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
        setPosts((prev) => [savedPost, ...prev]);
      } catch (err) {
        console.error(err);
      }
    };
    setModal('Create a post', <CreatePostModal onPostSubmit={handlePostSubmit} />);
    openModal();
  };

  // Post / Comment handlers (simplified)
  const updatePosts = (fn) => setPosts((prev) => prev.map(fn));

  const handleDeletePost = async (postId) => {
    await deletePost(postId);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleUpdatePost = async (postId, newContent) => {
    const updatedPost = await patchPost(postId, newContent);
    const refreshedComments = await getCommentByPostId(postId);
    updatePosts((post) =>
      post.id === postId ? { ...updatedPost, comments: refreshedComments } : post
    );
  };

  const handleCommentPost = async (postId, text) => {
    const savedComment = await postComments(postId, user.id, text);
    updatePosts((post) =>
      post.id === postId ? { ...post, comments: [...post.comments, savedComment] } : post
    );
  };

  const handleDeleteComment = async (postId, commentId) => {
    await deleteComment(commentId);
    updatePosts((post) =>
      post.id === postId
        ? { ...post, comments: post.comments.filter((c) => c.id !== commentId) }
        : post
    );
  };

  const handleUpdateComment = async (postId, commentId, newContent) => {
    const updatedComment = await patchComment(commentId, newContent);
    updatePosts((post) =>
      post.id === postId
        ? { ...post, comments: post.comments.map((c) => (c.id === commentId ? updatedComment : c)) }
        : post
    );
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal)}`);
      setSearchVal('');
    }
  };

  // Flatten and sort courses for teacher view
  const sortedCourses = cohorts
    .flatMap((c) =>
      c.courses.map((course) => ({ ...course, cohortTitle: c.title, cohortId: c.id }))
    )
    .sort((a, b) => a.title.localeCompare(b.title));

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
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search for people"
              icon={<SearchIcon />}
            />
          </form>
        </Card>

        {loadingCohorts ? (
          <>
            <Card>
              <h5 aria-label="dashboardCohortHeading">Cohorts</h5>
              <CohortSkeleton />
            </Card>
            <Card>
              <h5 aria-label="dashboardStudentsHeading">Students</h5>
              <AvatarListSkeleton />
            </Card>
            <Card>
              <h5 aria-label="dashboardTeachersHeading">Teachers</h5>
              <AvatarListSkeleton />
            </Card>
          </>
        ) : user.role === 0 ? (
          <>
            <Card>
              <h3 aria-label="dashboardCohortHeading">{selectedCohort?.title || 'Cohort'}</h3>
              {selectedCohort?.courses?.length > 0 ? (
                <Students data={getStudentsInCohort(selectedCohort)} />
              ) : (
                <p>Join a cohort to see your peers.</p>
              )}
            </Card>

            <Card>
              {selectedCohort?.courses?.length > 0 ? (
                <Teachers data={getTeachersInCohort(selectedCohort)} />
              ) : (
                <>
                  <h4>Teachers</h4>
                  <p>Join a cohort to see your teachers.</p>
                </>
              )}
            </Card>
          </>
        ) : (
          <>
            <Card>
              <h3 aria-label="dashboardCohortHeading">Cohorts</h3>
              <Cohorts data={sortedCourses} onSelectCohort={() => {}} />
            </Card>

            <Card>
              {cohorts.length > 0 ? (
                <Students
                  data={getStudentsInCohort({ courses: cohorts.flatMap((c) => c.courses) })}
                />
              ) : (
                <>
                  <h4>Students</h4>
                  <p>No students available. Add a cohort to see students.</p>
                </>
              )}
            </Card>

            <Card>
              {cohorts.length > 0 ? (
                <Teachers
                  data={getTeachersInCohort({ courses: cohorts.flatMap((c) => c.courses) })}
                />
              ) : (
                <>
                  <h4>Teachers</h4>
                  <p>No teachers available. Add a cohort to see teachers.</p>
                </>
              )}
            </Card>
          </>
        )}
      </aside>
    </>
  );
};

export default Dashboard;
