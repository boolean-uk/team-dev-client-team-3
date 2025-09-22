import './style.css';
import ProfileCircle from '../profileCircle';
import EditCommentModal from '../editCommentModal';

const Comment = ({
  commentId,
  postId,
  userId,
  fullName,
  content,
  photo,
  canEdit,
  setModal,
  openModal,
  onCommentUpdate,
  onCommentDelete
}) => {
  const showCommentModal = () => {
    setModal(
      'Edit comment',
      <EditCommentModal
        initialText={content}
        onSubmit={(newText) => onCommentUpdate(postId, newText)}
        onDelete={() => onCommentDelete(postId)}
      />
    );
    openModal();
  };

  return (
    <div
      className="comment"
      data-comment-id={commentId}
      data-post-id={postId}
      data-user-id={userId}
    >
      <ProfileCircle fullName={fullName} photoUrl={photo} />
      <div>
        <p className="comment-user-name">{fullName}</p>
        <p>{content}</p>
      </div>
      {/* Edit/Delete button only if allowed */}
      {canEdit && (
        <div className="edit-icon">
          <p onClick={showCommentModal}>...</p>
        </div>
      )}
    </div>
  );
};

export default Comment;
