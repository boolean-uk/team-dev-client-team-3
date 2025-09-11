import Form from '../../../components/form';
import TextInput from '../../../components/form/textInput';

const ProfileContactInfo = ({
  email,
  mobile,
  password,
  onChange,
  isEditing,
  editableFields,
  getInputClass
}) => {
  const canEdit = (field) => editableFields.includes(field) && isEditing;

  return (
    <Form>
      <section>
        <h3>Contact info</h3>
        <div className="welcome-form-inputs">
          <TextInput
            label="Email"
            name="email"
            value={email}
            onChange={(e) => onChange('email', e.target.value)}
            className={getInputClass('email')}
            disabled={!canEdit('email')}
          />

          <TextInput
            label="Mobile"
            name="mobile"
            value={mobile}
            onChange={(e) => onChange('mobile', e.target.value)}
            className={getInputClass('mobile')}
            disabled={!canEdit('mobile')}
          />

          <TextInput
            label="Password"
            name="password"
            value={password}
            onChange={(e) => onChange('password', e.target.value)}
            className={getInputClass('password')}
            disabled={!canEdit('password')}
          />
        </div>
      </section>
    </Form>
  );
};

export default ProfileContactInfo;
