import { useState } from 'react';
import './style.css';
import useModal from '../../hooks/useModal';
import Button from '../button';
import ProfileCircle from '../profileCircle';
import TextInput from '../form/textInput';

const EditPostModal = ({ initialText = '', onSubmit, onDelete }) => {
  const { closeModal } = useModal();
  const [text, setText] = useState(initialText);
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const name = storedUser ? `${storedUser.firstName} ${storedUser.lastName}` : 'Unknown User';

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
      <section style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="profile-icon">
          <ProfileCircle fullName={name} photoUrl={storedUser.photo} />
        </div>
        <div className="post-user-name">
          <p>{name}</p>
        </div>
      </section>

      <section>
        <TextInput
          type="textarea"
          name="postContent"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Edit your post"
          maxLength={280}
          className="create-post-user-details"
        />
      </section>

      <section style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
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
