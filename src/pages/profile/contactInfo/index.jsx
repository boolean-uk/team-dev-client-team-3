import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Form from '../../../components/form';
import TextInput from '../../../components/form/textInput';
import useAuth from '../../../hooks/useAuth';
import { getInputClass, canEditField } from '../helpers';

import {
  valEightChars,
  valCapLetter,
  valNumber,
  valSpecialChar
} from '../../register/registrationValidation';

const ProfileContactInfo = ({ email, mobile, password, onChange, isEditing }) => {
  const { id: pathParamId } = useParams();
  const { user } = useAuth();

  const [passwordCondition, setPasswordCondition] = useState(false);

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
            className={getInputClass('email', isEditing, user.role)}
            disabled={!canEditField('email', isEditing, user.role)}
          />

          <TextInput
            label="Mobile"
            name="mobile"
            value={mobile}
            onChange={(e) => onChange('mobile', e.target.value)}
            className={getInputClass('mobile', isEditing, user.role)}
            disabled={!canEditField('mobile', isEditing, user.role)}
          />

          {String(pathParamId) === String(user.id) ? (
            <div>
              <TextInput
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => onChange('password', e.target.value)}
                onClick={() => {
                  setPasswordCondition(true);
                }}
                className={getInputClass('password', isEditing, user.role)}
                disabled={!canEditField('password', isEditing, user.role)}
              />
              {passwordCondition && (
                <div className="password-hint">
                  Password must contain at least: <br />
                  <ul className="password-hint-3">
                    <li className={valEightChars(password) ? 'valid' : 'invalid'}>
                      - eight characters
                    </li>
                    <li className={valCapLetter(password) ? 'valid' : 'invalid'}>
                      - one capital letter
                    </li>
                    <li className={valNumber(password) ? 'valid' : 'invalid'}>- one number</li>
                    <li className={valSpecialChar(password) ? 'valid' : 'invalid'}>
                      - one special character
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </section>
    </Form>
  );
};

export default ProfileContactInfo;
