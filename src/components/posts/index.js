import useAuth from '../../hooks/useAuth';
import Post from '../post';

const Posts = ({ posts, onDelete }) => {
  const { user } = useAuth();

  const commentsTest = [
    {
      id: 1,
      name: 'Jonatan Berg',
      content: 'Dette er en kommentar',
      photo: null
    },
    {
      id: 2,
      name: 'Vegard Stigen',
      content: 'Dårlig post!!',
      photo: null
    }
  ];

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
            comments={commentsTest}
          />
        );
      })}
    </>
  );
};

export default Posts;
