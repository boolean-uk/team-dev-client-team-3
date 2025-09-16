import { useState, useEffect } from 'react';
import useModal from '../../hooks/useModal';
import Card from '../card';
import Comment from '../comment/comment';
import EditPostModal from '../editPostModal';
import ProfileCircle from '../profileCircle';
import TextInput from '../form/textInput';
import './style.css';

const Post = ({
  postId,
  userId,
  fullName,
  date,
  content: initialContent,
  onDelete,
  onUpdate,
  comments = [],
  likes = 0
}) => {
  const { openModal, setModal } = useModal();

  // Current logged-in user
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const currentUserId = storedUser.id;
  const currentUserRole = storedUser.role; // 0 = student, 1 = teacher
  const isPostOwner = String(currentUserId) === String(userId);
  const canEdit = currentUserRole === 1 || isPostOwner;

  // Date stuff
  const datetime = new Date(date);
  const day = datetime.getUTCDate();
  const month = datetime.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  const hours = String(datetime.getUTCHours()).padStart(2, '0');
  const minutes = String(datetime.getUTCMinutes()).padStart(2, '0');

  // States
  const [content, setContent] = useState(initialContent);
  const [commentContent, setCommentContent] = useState('');
  const [localComments, setLocalComments] = useState(comments);
  const [showComments, setShowComments] = useState(false);
  const [numLikes, setLikes] = useState(likes);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const onChange = (e) => setCommentContent(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!commentContent.trim() || commentContent === 'Add a comment...') return;

      const newComment = {
        id: Date.now(),
        postId,
        userId: currentUserId,
        fullName: 'You',
        content: commentContent
      };

      setLocalComments([...localComments, newComment]);
      setCommentContent('');
    }
  };

  const showModal = () => {
    setModal(
      'Edit post',
      <EditPostModal
        initialText={content}
        onSubmit={(newText) => onUpdate(postId, newText)}
        onDelete={() => onDelete(postId)}
      />
    );
    openModal();
  };

  return (
    <Card>
      <article className="post">
        {/* Post details */}
        <section className="post-details">
          <ProfileCircle fullName={fullName} />
          <div className="post-user-name">
            <p>{fullName}</p>
            <small>{`${day} ${month} at ${hours}:${minutes}`}</small>
          </div>

          {/* Edit/Delete button only if allowed */}
          {canEdit && (
            <div className="edit-icon">
              <p onClick={showModal}>...</p>
            </div>
          )}
        </section>

        {/* Post content */}
        <section className="post-content">
          <p>{content}</p>
        </section>

        {/* Likes + Comment toggle */}
        <section
          className={`post-interactions-container border-top ${localComments.length ? 'border-bottom' : ''}`}
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
              <span className="icon">❤️</span>
              <span>Like{numLikes > 0 && ` (${numLikes})`}</span>
            </div>
            <div className="interaction" onClick={() => setShowComments((prev) => !prev)}>
              <span className="icon">💬</span>
              <span>Comment</span>
            </div>
          </div>
          {numLikes === 0 && <p>Be the first to like this</p>}
        </section>

        {/* Comments */}
        <section>
          {localComments.map((comment) => (
            <Comment
              key={comment.id}
              commentId={comment.id}
              postId={postId}
              userId={comment.user?.id || comment.userId}
              fullName={
                comment.user
                  ? `${comment.user.firstName} ${comment.user.lastName}`
                  : comment.fullName || 'Unknown User'
              }
              content={comment.content}
            />
          ))}
          {showComments && (
            <div className="write-comment">
              <ProfileCircle fullName="You" />
              <TextInput
                type="textarea"
                className="comment-post-input"
                value={commentContent}
                onChange={onChange}
                name="comment"
                onKeyDown={handleKeyDown}
                placeholder="Add a comment..."
              />
            </div>
          )}
        </section>
      </article>
    </Card>
  );
};

export default Post;
