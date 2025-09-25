import { useState } from 'react';
import Card from '../card';
import TextInput from '../form/textInput';
import Button from '../button';
import useModal from '../../hooks/useModal';

const AddCohortModal = ({ onConfirm }) => {
  const { closeModal } = useModal();
  const [cohortName, setCohortName] = useState('');

  const handleConfirm = () => {
    if (!cohortName.trim()) return;
    onConfirm(cohortName.trim());
    closeModal();
  };

  return (
    <div className="add-cohort-modal">
      <Card>
        <h2>Add Cohort</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <TextInput
            placeholder="Cohort Name"
            value={cohortName}
            onChange={(e) => setCohortName(e.target.value)}
          />
        </form>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
          <Button text="Cancel" classes="offwhite" onClick={closeModal} />
          <Button text="Confirm" classes="blue" onClick={handleConfirm} disabled={!cohortName.trim()} />
        </div>
      </Card>
    </div>
  );
};

export default AddCohortModal;
