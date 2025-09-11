import Form from '../../../components/form';
import TextInput from '../../../components/form/textInput';

const ProfileProfessionalInfo = ({ role, specialization, title, getInputClass }) => {
  return (
    <Form>
      <section>
        <h3>Professional info</h3>
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
            label="Job Title"
            name="job-title"
            value={title}
            className={getInputClass ? getInputClass('job-title') : ''}
            readOnly
            disabled
          />
        </div>
      </section>
    </Form>
  );
};

export default ProfileProfessionalInfo;
