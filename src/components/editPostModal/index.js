import { useState } from 'react';
import './style.css';
import useModal from '../../hooks/useModal';
import Button from '../button';

const EditPostModal = ({ initialText = '', onSubmit, onDelete }) => {
  const { closeModal } = useModal();
  const [text, setText] = useState(initialText);

  const handleSubmit = () => {
    if (onSubmit) onSubmit(text); 
    closeModal();                  
  };

  const handleDelete = () => {
    if (onDelete) onDelete(); 
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
        <textarea 
          onChange={(e) => setText(e.target.value)} 
          value={text} 
          placeholder="Edit your post"
        />
      </section>

      <section style={{ display: 'flex', justifyContent: 'center', gap: '10px'}}
      >
        <Button
          onClick={handleSubmit}
          text="Confirm"
          classes={`${text.length ? 'blue' : 'offwhite'} flex-1`}
          disabled={!text.length}
        />

        <Button
          onClick={handleDelete}
          text="Delete"
          classes={`${text.length ? 'blue' : 'offwhite'} flex-1`}
          disabled={!text.length}
        />
      </section>
    </>
  );
};

export default EditPostModal;
