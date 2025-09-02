import Post from '../post';

const Posts = ({ posts }) => {
  const posts2 = [
  {
    id: 1,
    author: { firstName: 'Alex', lastName: 'J' }, // author object as expected
    createdAt: '2025-09-02T12:00:00Z',
    content: 'This is a hardcoded test post!',
    comments: [
      {
        id: 1,
        author: { firstName: 'Sam', lastName: 'T' },
        content: 'Nice post!',
      },
    ],
  },
  {
    id: 2,
    author: { firstName: 'Maria', lastName: 'L' },
    createdAt: '2025-09-01T15:30:00Z',
    content: 'Another test post!',
    comments: [],
  },
];



  return (
    <>
      {posts2.map((post) => (
        <Post
          key={post.id}
          name={`${post.author.firstName} ${post.author.lastName}`}
          date={post.createdAt}
          content={post.content}
          comments={post.comments}
        />
      ))}
    </>
  );
};


export default Posts;
