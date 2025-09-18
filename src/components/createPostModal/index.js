import { useState } from 'react';
import './style.css';
import Button from '../button';
import useModal from '../../hooks/useModal';
import ProfileCircle from '../profileCircle';
import useAuth from '../../hooks/useAuth';
import TextInput from '../form/textInput';

const CreatePostModal = ({ onPostSubmit }) => {
  const { closeModal } = useModal();
  const [text, setText] = useState('');

  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth(); // always use this

  const onSubmit = () => {
    if (!text.length) {
      return;
    }

    onPostSubmit(text);
    closeModal();
  };

  return (
    <>
      <section>
        <div className="profile-icon">
          <ProfileCircle fullName={`${user.firstName} ${user.lastName}`} photoUrl={user.photo} />
        </div>
        <div className="post-user-name">
          <p>
            {user.firstName} {user.lastName}
          </p>
        </div>
      </section>

      <section>
        <TextInput
          type="textarea"
          name="postContent"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          style={{ width: '100%', resize: 'vertical' }}
          maxLength={280}
          className="create-post-user-details"
        />
      </section>

      <section>
        {text.length === 0 && (
          <p className="error-message">No text provided, please provide text to create a post!</p>
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
