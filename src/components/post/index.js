import { useState } from 'react';
import useModal from '../../hooks/useModal';
import Card from '../card';
import Comment from '../comment';
import EditPostModal from '../editPostModal';
import ProfileCircle from '../profileCircle';
import TextInput from '../form/textInput';
import './style.css';

const Post = ({ name, date, content: initialContent, onDelete, comments = [], likes = 0 }) => {
  const { openModal, setModal } = useModal();
  const datetime = new Date(date);
  const day = datetime.getUTCDate();
  const month = datetime.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  const hours = String(datetime.getUTCHours()).padStart(2, '0');
  const minutes = String(datetime.getUTCMinutes()).padStart(2, '0');
  const [content, setContent] = useState(initialContent);
  const [commentContent, setCommentContent] = useState('');
  const [localComments, setLocalComments] = useState(comments);

  const onChange = (e) => {
    setCommentContent(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (!commentContent.trim() || commentContent === 'Add a comment...') return;

      const newComment = {
        // id: Date.now(),
        name,
        content: commentContent
      };

      setLocalComments([...localComments, newComment]);
      setCommentContent('');
      console.log('Added comment to local comments: ', newComment);
    }
  };

  const showModal = () => {
    setModal(
      'Edit post',
      <EditPostModal
        initialText={content}
        onSubmit={(newText) => setContent(newText)}
        onDelete={onDelete}
      />
    );
    openModal();
  };

  return (
    <Card>
      <article className="post">
        <section className="post-details">
          <ProfileCircle fullName={name} />

          <div className="post-user-name">
            <p>{name}</p>
            <small>{`${day} ${month} at ${hours}:${minutes}`}</small>
          </div>

          <div className="edit-icon">
            <p onClick={showModal}>...</p>
          </div>
        </section>

        <section className="post-content">
          <p>{content}</p>
        </section>

        <section
          className={`post-interactions-container border-top ${comments.length ? 'border-bottom' : null}`}
        >
          <div className="post-interactions">
            <div className="interaction" onClick={() => console.log('Like Clicked!')}>
              <span className="icon">♡</span>
              <span>Like</span>
            </div>
            <div className="interaction" onClick={() => console.log('Comment Clicked!')}>
              <span className="icon">💬</span>
              <span>Comment</span>
            </div>
          </div>

          <p>{!likes && 'Be the first to like this'}</p>
        </section>

        <section>
          {localComments.map((comment) => (
            <Comment key={comment.id} name={comment.name} content={comment.content} />
          ))}
          <div className="write-comment">
            <ProfileCircle fullName={name} />
            <TextInput
              className="comment-post-input"
              value={commentContent}
              onChange={onChange}
              name="comment"
              onKeyDown={handleKeyDown}
              placeholder="Add a comment..."
            ></TextInput>
          </div>
        </section>
      </article>
    </Card>
  );
};

export default Post;
