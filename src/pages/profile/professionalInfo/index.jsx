import Form from '../../../components/form';
import TextInput from '../../../components/form/textInput';
import useAuth from '../../../hooks/useAuth';
import { getInputClass, canEditField } from '../helpers';

const ProfileProfessionalInfo = ({ role, specialism, title, isEditing, onChange }) => {
  // We need the logged in user so that we can check if they can edit.
  const { user } = useAuth();

  // Consider making a cute select component.
  return (
    <Form>
      <section>
        <h3>Professional info</h3>

        <div className="welcome-form-inputs">
          <label className="block">
            Role
            <br />
            <select
              name="role"
              value={role}
              onChange={(e) => onChange('role', parseInt(e.target.value, 10))}
              className={getInputClass('role', isEditing, user.role)}
              disabled={!canEditField('role', isEditing, user.role)}
            >
              <option value={0}>Student</option>
              <option value={1}>Teacher</option>
            </select>
          </label>

          <TextInput
            label="Specialism"
            name="specialism"
            value={specialism}
            onChange={(e) => onChange('specialism', e.target.value)}
            className={getInputClass('specialism', isEditing, user.role)}
            disabled={!canEditField('specialism', isEditing, user.role)}
          />

          <TextInput
            label="Job Title"
            name="title"
            value={title}
            onChange={(e) => onChange('title', e.target.value)}
            className={getInputClass('title', isEditing, user.role)}
            disabled={!canEditField('title', isEditing, user.role)}
          />
        </div>
      </section>
    </Form>
  );
};

export default ProfileProfessionalInfo;
