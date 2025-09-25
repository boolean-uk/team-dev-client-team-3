import Form from '../../../components/form';
import SelectInput from '../../../components/form/selectInput/SelectInput';
import TextInput from '../../../components/form/textInput';
import useAuth from '../../../hooks/useAuth';
import { canEditField, getInputClass } from '../helpers';

const ProfileTrainingInfo = ({
  role,
  specialism,
  cohort,
  startDate,
  endDate,
  isEditing,
  onChange
}) => {
  const { user } = useAuth();

  return (
    <Form>
      <section>
        <h3>Training info</h3>

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
            className={getInputClass('specialism', isEditing, user.specialism)}
            disabled={!canEditField('specialism', isEditing, user.specialism)}
          />

          <TextInput
            label="Cohort"
            name="cohort"
            value={cohort?.title}
            onChange={(e) => onChange('cohort', e.target.value)}
            className={getInputClass('cohort', isEditing, user.cohort)}
            disabled={!canEditField('cohort', isEditing, user.cohort)}
          />

          <TextInput
            label="Start Date"
            name="startDate"
            value={startDate}
            onChange={(e) => onChange('startDate', e.target.value)}
            className={getInputClass('startDate', isEditing, user.startDate)}
            disabled={!canEditField('startDate', isEditing, user.startDate)}
          />

          <TextInput
            label="End Date"
            name="endDate"
            value={endDate}
            onChange={(e) => onChange('endDate', e.target.value)}
            className={getInputClass('endDate', isEditing, user.endDate)}
            disabled={!canEditField('endDate', isEditing, user.endDate)}
          />
        </div>
      </section>
    </Form>
  );
};

export default ProfileTrainingInfo;
