import useAuth from '../../hooks/useAuth';
import Post from '../post';

const Posts = ({ posts, onDelete }) => {
  const { user } = useAuth();
  console.log(user);

  return (
    <>
      {posts.map((post) => {
        return (
          <Post
            key={post.id}
            name={`${user.firstName} ${user.lastName}`}
            date={post.id}
            content={post.text}
            onDelete={() => onDelete(post.id)}
            comments={[]}
          />
        );
      })}
    </>
  );
};

export default Posts;
