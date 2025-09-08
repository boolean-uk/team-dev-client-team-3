import useAuth from '../../hooks/useAuth';
import Post from '../post';

const Posts = ({ posts, onDelete }) => {
  const { user } = useAuth();

  const commentsTest = [
    {
      name: 'Jonatan Berg',
      content: 'Dette er en kommentar'
    },
    {
      name: 'Vegard Stigen',
      content: 'Dårlig post!!'
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
