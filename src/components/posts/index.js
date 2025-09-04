// import { AuthContext } from '../../context/auth';
import useAuth from '../../hooks/useAuth';
import Post from '../post';
import { useState } from 'react';

const Posts = ({ posts, onDelete }) => {
  const { user } = useAuth();
  const posts2 = [
    {
      id: 1,
      author: { firstName: 'Alex', lastName: 'Jesus' }, // author object as expected
      createdAt: '2025-09-02T12:00:00Z',
      content: 'This is a hardcoded test post!',
      comments: [
        {
          id: 1,
          author: { firstName: 'Sam', lastName: 'Tissefant' },
          content: 'Nice post!'
        }
      ]
    },
    {
      id: 2,
      author: { firstName: 'Maria', lastName: 'Latter' },
      createdAt: '2025-09-01T15:30:00Z',
      content: 'Another test post!',
      comments: []
    }
  ];

  return (
    <>
      {posts.map((post) => {
        return (
          // Fake post
          // <Post
          //   key={post.id}
          //   name={`${post.author.firstName} ${post.author.lastName}`}
          //   date={post.createdAt}
          //   content={post.content}
          //   comments={post.comments}
          // />
          // Real post
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
