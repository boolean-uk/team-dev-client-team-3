import { useState, useEffect } from 'react';
import useModal from '../../hooks/useModal';
import Card from '../card';
import Comment from '../comment/comment';
import EditPostModal from '../editPostModal';
import ProfileCircle from '../profileCircle';
import TextInput from '../form/textInput';
import { FaHeart, FaRegHeart, FaComment } from 'react-icons/fa';
import './style.css';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Post = ({
  postId,
  userId,
  fullName,
  photo,
  date,
  content: initialContent,
  onDelete,
  onUpdate,
  onCommentPost,
  onCommentDelete,
  onCommentUpdate,
  comments = [],
  likes = 0
}) => {
  const { openModal, setModal } = useModal();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Current logged-in user
  const isPostOwner = String(user.id) === String(userId);
  const canEdit = user.role === 1 || isPostOwner; // 0 = student, 1 = teacher

  // Date stuff
  const datetime = new Date(date);
  const day = datetime.getUTCDate();
  const month = datetime.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  const hours = String(datetime.getUTCHours()).padStart(2, '0');
  const minutes = String(datetime.getUTCMinutes()).padStart(2, '0');

  // States
  const [content, setContent] = useState(initialContent);
  const [showComments, setShowComments] = useState(false);
  const [numLikes, setLikes] = useState(likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentContent, setCommentContent] = useState('');

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const onChange = (e) => setCommentContent(e.target.value);

  // TODO: Connect to API to add comment to a post
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!commentContent.trim() || commentContent === 'Add a comment...') return;

      onCommentPost(postId, commentContent);
      // Optimistic update
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
        {/* Post header */}
        <section className="post-details">
          <ProfileCircle
            fullName={fullName}
            photoUrl={photo}
            onClick={() => navigate(`/profile/${userId}`)}
          />

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
          className={`post-interactions-container border-top ${comments.length ? 'border-bottom' : ''}`}
        >
          <div className="post-interactions">
            <div
              className="interaction"
              onClick={() => {
                setLikes((prev) => (hasLiked ? prev - 1 : prev + 1));
                setHasLiked(!hasLiked);
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
              <span>{showComments ? 'Hide Comment' : `Add Comment`}</span>
            </div>
          </div>
          {numLikes === 0 && <p>Be the first to like this</p>}
        </section>

        {/* Comments */}
        <section className="post-comments">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              commentId={comment.id}
              postId={postId}
              userId={comment.user?.id}
              fullName={
                comment.user ? `${comment.user.firstName} ${comment.user.lastName}` : 'Unknown User'
              }
              content={comment.content}
              photo={comment.user?.photo || null}
              setModal={setModal}
              openModal={openModal}
              onCommentUpdate={(postId, newText) => onCommentUpdate(postId, comment.id, newText)}
              onCommentDelete={() => onCommentDelete(postId, comment.id)}
            />
          ))}

          {/* Input for new comment */}
          {showComments && (
            <div className="write-comment">
              <ProfileCircle
                fullName={`${user.firstName} ${user.lastName}`}
                photoUrl={user.photo}
              />
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
