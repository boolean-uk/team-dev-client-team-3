import Post from '../post';

const Posts = ({ posts = [], onDelete }) => {
  return (
    <>
      {posts.map((post) => (
        <Post
          key={post.id}
          postId={post.id}
          userId={post.user?.id}
          fullName={`${post.user?.firstName || 'Unknown'} ${post.user?.lastName || ''}`}
          date={post.createdAt}
          content={post.content}
          onDelete={() => onDelete(post.id)}
          comments={post.comments?.map((c) => ({
            commentId: c.id,
            postId: post.id,
            userId: c.user?.id,
            fullName: `${c.user?.firstName || 'Unknown'} ${c.user?.lastName || ''}`,
            content: c.content
          })) || []}
          likes={post.numLikes || 0}
        />
      ))}
    </>
  );
};

export default Posts;
