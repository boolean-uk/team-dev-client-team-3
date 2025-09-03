import { useState } from 'react';
import useModal from '../../hooks/useModal';
import './style.css';
import Button from '../button';

const CreatePostModal = () => {
  // Use the useModal hook to get the closeModal function so we can close the modal on user interaction
  const { closeModal } = useModal();

  const [message, setMessage] = useState(null);
  const [text, setText] = useState('');

  const [error, setError] = useState(false);

  const onChange = (e) => {
    setText(e.target.value);
    if (e.target.value.length && error) {
      setError(false);
    }
  };

  const onSubmit = () => {
    if (text.length) {
      setMessage('Submit button was clicked! Closing modal in 2 seconds...');

      setTimeout(() => {
        setMessage(null);
        closeModal();
      }, 2000);
    }
    if (!text.length) {
      setError(true);
    }
  };

  return (
    <>
      <section className="create-post-user-details">
        <div className="profile-icon">
          <p>AJ</p>
        </div>
        <div className="post-user-name">
          <p>Alex J</p>
        </div>
      </section>

      <section>
        <textarea onChange={onChange} value={text} placeholder="What's on your mind?"></textarea>
      </section>

      <section>
        {error ? (
          <p className="error-message">No text provided, please provide text to create a post!</p>
        ) : (
          <p> </p>
        )}
      </section>

      <section className="create-post-actions">
        <Button
          onClick={onSubmit}
          text="Post"
          classes={`${text.length ? 'blue' : 'offwhite'} width-full`}
          // disabled={!text.length}
        />
      </section>

      {message && <p>{message}</p>}
    </>
  );
};

export default CreatePostModal;
