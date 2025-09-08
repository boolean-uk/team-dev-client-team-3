import { useState } from 'react';
import './style.css';
import Button from '../button';
import useModal from '../../hooks/useModal';
import ProfileCircle from '../profileCircle';
import useAuth from '../../hooks/useAuth';

const CreatePostModal = ({ onPostSubmit }) => {
  const { closeModal } = useModal();
  const [text, setText] = useState('');
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(null);
  const { user } = useAuth();
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const name = storedUser ? `${storedUser.firstName} ${storedUser.lastName}` : 'Unknown User';

  const onChange = (e) => {
    setText(e.target.value);
    if (e.target.value.length && error) {
      setError(false);
    }
  };

  const onSubmit = () => {
    closeModal();
    if (!text.length) {
      setError(true);
      return;
    }

    onPostSubmit(text);
  };

  return (
    <>
      <section className="create-post-user-details">
        <div className="profile-icon">
          <ProfileCircle fullName={`${user.firstName} ${user.lastName}`} />
        </div>
        <div className="post-user-name">
          <p>
            {user.firstName} {user.lastName.slice(0, 1)}
          </p>
        </div>
      </section>

      <section>
        <textarea onChange={onChange} value={text} placeholder="What's on your mind?" />
      </section>

      <section>
        {text.length === 0 ? (
          <p className="error-message">No text provided, please provide text to create a post!</p>
        ) : (
          message && <p className="success-message">{message}</p>
        )}
      </section>

      <section className="create-post-actions">
        <Button
          onClick={onSubmit}
          text="Post"
          classes={`${text.length ? 'blue' : 'offwhite'} width-full`}
          disabled={!text.length}
        />
      </section>
    </>
  );
};

export default CreatePostModal;
