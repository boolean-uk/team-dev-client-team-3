import Form from '../../../components/form';
import SelectInput from '../../../components/form/selectInput/SelectInput';
import TextInput from '../../../components/form/textInput';
import useAuth from '../../../hooks/useAuth';
import { getInputClass, canEditField } from '../helpers';

const ProfileProfessionalInfo = ({ role, specialism, title, isEditing, onChange }) => {
  const { user } = useAuth();

  return (
    <Form>
      <section>
        <h3>Professional info</h3>

        <div className="welcome-form-inputs">
          <SelectInput
            label="Role"
            name="role"
            value={role}
            onChange={(e) => onChange('role', parseInt(e.target.value, 10))}
            className={getInputClass('role', isEditing, user.role)}
            disabled={!canEditField('role', isEditing, user.role)}
            options={[
              { value: 0, label: 'Student' },
              { value: 1, label: 'Teacher' }
            ]}
          />

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
