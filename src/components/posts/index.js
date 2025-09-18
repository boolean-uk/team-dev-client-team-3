import Post from '../post';

const Posts = ({ posts = [], onDelete, onUpdate }) => {
  return (
    <>
      {posts.map((post) => (
        <Post
          key={post.id}
          postId={post.id}
          userId={post.user?.id}
          fullName={`${post.user?.firstName || 'Unknown'} ${post.user?.lastName || ''}`}
          photo={post.user?.photo}
          date={post.createdAt}
          content={post.content}
          onDelete={() => onDelete(post.id)}
          onUpdate={onUpdate}
          comments={post.comments || []}
          likes={post.numLikes || 0}
        />
      ))}
    </>
  );
};

export default Posts;
