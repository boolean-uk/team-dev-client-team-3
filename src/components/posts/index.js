import Post from '../post';

const Posts = ({ posts, onDelete }) => {
  console.log('Rendering Posts component with posts:', posts);
  return (
    <>
      {posts.map((post) => {
        return (
          <Post
            key={post.id}
            postId={post.id}
            userId={post.user.id}
            fullName={`${post.user.firstName} ${post.user.lastName}`}
            date={post.createdAt}
            content={post.content}
            onDelete={() => onDelete(post.id)}
            comments={post.comments}
          />
        );
      })}
    </>
  );
};

export default Posts;
