import Form from '../../../components/form';
import useAuth from '../../../hooks/useAuth';
import { getInputClass, canEditField } from '../helpers';

const ProfileBio = ({ bio, isEditing, onChange, maxLength = 300 }) => {
  const { user } = useAuth();

  return (
    <Form>
      <section>
        <h3>Bio</h3>
        <div className="welcome-form-inputs">
          <div>
            <label>Bio</label>
            <textarea
              maxLength={maxLength}
              id="bio"
              name="bio"
              value={bio || ''}
              onChange={(e) => onChange('bio', e.target.value)}
              className={getInputClass('bio', isEditing, user.role)}
              disabled={!canEditField('bio', isEditing, user.role)}
            />
            <span id="charCount">
              {bio?.length ?? 0}/{maxLength}
            </span>
          </div>
        </div>
      </section>

    </Form>
  );
};

export default ProfileBio;
