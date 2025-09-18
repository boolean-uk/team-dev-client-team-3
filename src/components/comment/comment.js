import './style.css';
import ProfileCircle from '../profileCircle';

const Comment = ({ name, content }) => {
  return (
    <div className="comment">
      <ProfileCircle fullName={name} />
      <div>
        <p className="comment-user-name">{name}</p>
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Comment;
