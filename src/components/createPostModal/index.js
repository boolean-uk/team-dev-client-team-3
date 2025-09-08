import { useState } from 'react';
import './style.css';
import Button from '../button';
import useModal from '../../hooks/useModal';
import ProfileCircle from '../profileCircle';

const CreatePostModal = ({ onPostSubmit }) => {
  const { closeModal } = useModal();
  const [text, setText] = useState('');
  const [error, setError] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [message, setMessage] = useState(null);
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
          <ProfileCircle fullName={name} />
        </div>
        <div className="post-user-name">
          <p>{name}</p>
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
