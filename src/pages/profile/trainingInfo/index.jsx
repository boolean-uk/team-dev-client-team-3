import Form from '../../../components/form';
import TextInput from '../../../components/form/textInput';

const ProfileTrainingInfo = ({
  role,
  specialization,
  cohort,
  startDate,
  endDate,
  getInputClass
}) => {
  return (
    <Form>
      <section>
        <h3>Training info</h3>
        <div className="welcome-form-inputs">
          <TextInput
            label="Role"
            name="role"
            value={role}
            className={getInputClass ? getInputClass('role') : ''}
            readOnly
            disabled
          />
          <TextInput
            label="Specialization"
            name="specialization"
            value={specialization}
            className={getInputClass ? getInputClass('specialization') : ''}
            readOnly
            disabled
          />
          <TextInput
            label="Cohort"
            name="cohort"
            value={cohort}
            className={getInputClass ? getInputClass('cohort') : ''}
            readOnly
            disabled
          />
          <TextInput
            label="Start Date"
            name="startDate"
            value={startDate}
            className={getInputClass ? getInputClass('startDate') : ''}
            readOnly
            disabled
          />
          <TextInput
            label="End Date"
            name="endDate"
            value={endDate}
            className={getInputClass ? getInputClass('endDate') : ''}
            readOnly
            disabled
          />
        </div>
      </section>
    </Form>
  );
};

export default ProfileTrainingInfo;
