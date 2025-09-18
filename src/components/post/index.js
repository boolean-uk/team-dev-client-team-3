import { useState } from 'react';
import useModal from '../../hooks/useModal';
import Card from '../card';
import Comment from '../comment/comment';
import EditPostModal from '../editPostModal';
import ProfileCircle from '../profileCircle';
import TextInput from '../form/textInput';
import './style.css';

const Post = ({ name, date, content: initialContent, onDelete, comments = [], likes = 0 }) => {
  const { openModal, setModal } = useModal();

  // Date stuff
  const datetime = new Date(date);
  const day = datetime.getUTCDate();
  const month = datetime.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  const hours = String(datetime.getUTCHours()).padStart(2, '0');
  const minutes = String(datetime.getUTCMinutes()).padStart(2, '0');
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const fullName = storedUser ? `${storedUser.firstName} ${storedUser.lastName}` : 'Unknown User';

  // States
  const [content, setContent] = useState(initialContent);
  const [commentContent, setCommentContent] = useState('');
  const [localComments, setLocalComments] = useState(comments);
  const [showComments, setShowComments] = useState(false);
  const [numLikes, setLikes] = useState(likes);
  const [hasLiked, setHasLiked] = useState(false);

  const onChange = (e) => {
    setCommentContent(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (!commentContent.trim() || commentContent === 'Add a comment...') return;

      // TODO: Replace with API call.
      const newComment = {
        // TODO: Use comment ID from API.
        id: Date.now(),
        name: fullName,
        content: commentContent,
        photo: storedUser.photo
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
          {storedUser ? (
            <ProfileCircle fullName={name} photoUrl={storedUser.photo} />
          ) : (
            <ProfileCircle fullName={name} />
          )}

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
            <div
              className="interaction"
              onClick={() => {
                if (!hasLiked) {
                  setLikes((prev) => prev + 1);
                  setHasLiked(true);
                } else {
                  setLikes((prev) => prev - 1);
                  setHasLiked(false);
                }
              }}
            >
              <span className="icon">
                {hasLiked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="red"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1 4.13 2.44h.74C13.09 5 14.76 4 16.5 4 19 4 21 6 21 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1 4.13 2.44h.74C13.09 5 14.76 4 16.5 4 19 4 21 6 21 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                )}
              </span>

              <span>Like{numLikes > 0 && ` (${numLikes})`}</span>
            </div>
            <div className="interaction" onClick={() => setShowComments((prev) => !prev)}>
              <span className="icon">💬</span>
              <span>Comment</span>
            </div>
          </div>
          {numLikes === 0 && <p>Be the first to like this</p>}
        </section>

        <section>
          {localComments.map((comment) => (
            <Comment
              key={comment.id}
              name={comment.name}
              content={comment.content}
              photo={comment.photo}
            />
          ))}
          {showComments && (
            <div className="write-comment">
              {storedUser ? (
                <ProfileCircle fullName={name} photoUrl={storedUser.photo} />
              ) : (
                <ProfileCircle fullName={name} />
              )}
              <TextInput
                type="textarea"
                className="comment-post-input"
                value={commentContent}
                onChange={onChange}
                name="comment"
                onKeyDown={handleKeyDown}
                placeholder="Add a comment..."
              ></TextInput>
            </div>
          )}
        </section>
      </article>
    </Card>
  );
};

export default Post;
