import './style.css';
import ProfileCircle from '../profileCircle';

const Comment = ({ commentId, postId, userId, fullName, content, photo }) => {
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
    </div>
  );
};

export default Comment;
