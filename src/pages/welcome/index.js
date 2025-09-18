import { useState } from 'react';
import Stepper from '../../components/stepper';
import useAuth from '../../hooks/useAuth';
import StepOne from './stepOne';
import StepTwo from './stepTwo';
import StepThree from './stepThree';
import StepFour from './stepFour';
import './style.css';

const Welcome = () => {
  const { user, onCreateProfile } = useAuth();
  const [isFirstNameValid, setIsFirstNameValid] = useState(false);
  const [isLastNameValid, setIsLastNameValid] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isGithubValid, setIsGithubValid] = useState(false);
  const [isStartDateValid, setIsStartDateValid] = useState(false);
  const [isEndDateValid, setIsEndDateValid] = useState(false);
  const [isRoleValid, setIsRoleValid] = useState(false);

  // When creating profile "user" state from useAuth() is updated
  const [profile, setProfile] = useState({
    id: user.id,
    photo: '',
    firstName: '',
    lastName: '',
    username: '',
    githubUsername: '',
    email: user.email,
    mobile: '',
    password: '',
    role: '',
    specialism: '',
    cohort: '',
    startDate: '',
    endDate: '',
    bio: ''
  });

  const onChange = (event) => {
    const { name, value, type } = event.target;

    if (type === 'date') {
      // only save ISO if value is a complete valid date
      const parsed = new Date(value);
      setProfile({
        ...profile,
        [name]: isNaN(parsed.getTime()) ? '' : parsed.toISOString()
      });
    } else if (name === 'role') {
      setProfile({
        ...profile,
        [name]: Number(value)
      });
    } else {
      setProfile({
        ...profile,
        [name]: value
      });
    }
  };

  const onComplete = () => {
    onCreateProfile(profile);
  };

  return (
    <main className="welcome">
      <div className="welcome-titleblock">
        <h1 className="h2">Welcome to Cohort Manager</h1>
        <p className="text-blue1">Create your profile to get started</p>
      </div>

      <Stepper
        header={<WelcomeHeader />}
        onComplete={onComplete}
        isFirstNameValid={isFirstNameValid}
        isLastNameValid={isLastNameValid}
        isGithubValid={isGithubValid}
        isUsernameValid={isUsernameValid}
        isRoleValid={isRoleValid}
        isStartDateValid={isStartDateValid}
        isEndDateValid={isEndDateValid}
      >
        <StepOne
          data={profile}
          setData={onChange}
          isFirstNameValid={isFirstNameValid}
          setIsFirstNameValid={setIsFirstNameValid}
          isLastNameValid={isLastNameValid}
          setIsLastNameValid={setIsLastNameValid}
          isUsernameValid={isUsernameValid}
          setIsUsernameValid={setIsUsernameValid}
          isGithubValid={isGithubValid}
          setIsGithubValid={setIsGithubValid}
        />
        <StepTwo data={profile} setData={onChange} />
        <StepThree
          data={profile}
          setData={onChange}
          isRoleValid={isRoleValid}
          setIsRoleValid={setIsRoleValid}
          isStartDateValid={isStartDateValid}
          setIsStartDateValid={setIsStartDateValid}
          isEndDateValid={isEndDateValid}
          setIsEndDateValid={setIsEndDateValid}
        />
        <StepFour data={profile} setData={onChange} />
      </Stepper>
    </main>
  );
};

const WelcomeHeader = () => {
  return (
    <div className="welcome-cardheader">
      <h2>Create profile</h2>
      <p className="text-blue1">Tell us about yourself to create your profile</p>
    </div>
  );
};

export default Welcome;
