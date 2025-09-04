import { useState } from 'react';
import './style.css';
import Button from '../button';
import useModal from '../../hooks/useModal';

const CreatePostModal = ({ onPostSubmit }) => {
  const { closeModal } = useModal();
  const [text, setText] = useState('');

  const onChange = (e) => setText(e.target.value);

  const onSubmit = () => {
    if (!text.length) return;
    onPostSubmit(text);
    closeModal();
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
    </>
  );
};

export default CreatePostModal;
