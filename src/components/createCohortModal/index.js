import { useState } from 'react';
import './style.css';
import Button from '../button';
import useModal from '../../hooks/useModal';
// import ProfileCircle from '../profileCircle';
import useAuth from '../../hooks/useAuth';
import TextInput from '../form/textInput';

const CreateCohortModal = ({ onCohortSubmit }) => {
  const { closeModal } = useModal();
  const [text, setText] = useState('');

  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth(); // always use this

  const onSubmit = () => {
    if (!text.length) {
      return;
    }

    onCohortSubmit(text);
    closeModal();
  };

  return (
    <>
      <section>
        <TextInput
          type="textarea"
          name="postContent"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cohort Name?"
          style={{ width: '100%', resize: 'vertical', height: '4rem' }}
          maxLength={280}
          className="create-post-user-details"
        />
      </section>

      <section>
        {text.length === 0 && (
          <p className="error-message">No name provided, please provide a name to add a cohort!</p>
        )}
      </section>

      <section className="create-post-actions">
        <Button
          onClick={onSubmit}
          text="Add cohort"
          classes={`${text.length ? 'blue' : 'offwhite'} width-full`}
          disabled={!text.length}
        />
      </section>
    </>
  );
};
export default CreateCohortModal;
