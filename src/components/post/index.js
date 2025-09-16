import { useState, useEffect } from 'react';
import useModal from '../../hooks/useModal';
import Card from '../card';
import Comment from '../comment/comment';
import EditPostModal from '../editPostModal';
import ProfileCircle from '../profileCircle';
import TextInput from '../form/textInput';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';
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

  const onChange = (e) => setCommentContent(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!commentContent.trim() || commentContent === 'Add a comment...') return;

      // Temporary local comment
      const newComment = {
        // TODO: Use comment ID from API.
        id: Date.now(),
        name: fullName,
        content: commentContent,
        photo: storedUser.photo
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

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  return (
    <Card>
      <article className="post">
        {/* Post details */}
        <section className="post-details">
          {storedUser ? (
            <ProfileCircle fullName={name} photoUrl={storedUser.photo} />
          ) : (
            <ProfileCircle fullName={name} />
          )}
          <div className="post-user-name">
            <p>{fullName}</p>
            <small>{`${day} ${month} at ${hours}:${minutes}`}</small>
          </div>
          <div className="edit-icon">
            <p onClick={showModal}>...</p>
          </div>
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
              {hasLiked ? (
                <FaHeart style={{ color: 'black', marginRight: '6px' }} />
              ) : (
                <FaRegHeart style={{ color: 'white', marginRight: '6px' }} />
              )}
              <span>Like{numLikes > 0 && ` (${numLikes})`}</span>
            </div>

            <div className="interaction" onClick={() => setShowComments((prev) => !prev)}>
              <FaComment style={{ marginRight: '6px' }} />
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
      photo={comment.user?.photo || comment.photo} // <-- add this
    />
  ))}
  {showComments && (
    <div className="write-comment">
      <ProfileCircle fullName={fullName} />
      <TextInput type="text" />
    </div>
  )}
</section>
      </article>
    </Card>
  );
};

export default Post;
