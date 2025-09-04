import { useState } from 'react';
import useModal from '../../hooks/useModal';
import './style.css';
import Button from '../button';
import Card from '../card'; // the post card

const CreatePostModal = ({ onPostSubmit }) => {
  const { closeModal } = useModal();
  const [text, setText] = useState('');
  const [message, setMessage] = useState(null);

  const onChange = (e) => setText(e.target.value);

  const onSubmit = () => {
    if (!text.length) return;

    // Call the callback passed from Dashboard
    onPostSubmit(text);

    setMessage('Post created! Closing modal in 2 seconds...');
    setTimeout(() => {
      setMessage(null);
      closeModal();
      setText('');
    }, 2000);
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
        <textarea onChange={onChange} value={text} placeholder="What's on your mind?" />
      </section>

      <section className="create-post-actions">
        <Button
          onClick={onSubmit}
          text="Post"
          classes={`${text.length ? 'blue' : 'offwhite'} width-full`}
          disabled={!text.length}
        />
      </section>

      {message && <p>{message}</p>}
    </>
  );
};

export default CreatePostModal;
