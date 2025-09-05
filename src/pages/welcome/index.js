import { useState } from 'react';
import Stepper from '../../components/stepper';
import useAuth from '../../hooks/useAuth';
import StepOne from './stepOne';
import StepTwo from './stepTwo';
import StepThree from './stepThree';
import StepFour from './stepFour';
import './style.css';

const Welcome = () => {
  const { onCreateProfile } = useAuth();
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isGithubValid, setIsGithubValid] = useState(false);

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    username: '',
    githubUsername: '',
    email: '',
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
    const { name, value } = event.target;

    setProfile({
      ...profile,
      [name]: value
    });
  };

  const onComplete = () => {
    onCreateProfile(profile.firstName, profile.lastName, profile.githubUsername, profile.bio);
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
        isGithubValid={isGithubValid}
        isUsernameValid={isUsernameValid}
      >
        <StepOne
          data={profile}
          setData={onChange}
          isUsernameValid={isUsernameValid}
          setIsUsernameValid={setIsUsernameValid}
          isGithubValid={isGithubValid}
          setIsGithubValid={setIsGithubValid}
        />
        <StepTwo data={profile} setData={onChange} />
        <StepThree data={profile} setData={onChange} />
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

// const validateStepOne = () => {
//   const validateField = (value, setValid) => {
//     if (!validateUsernameClient(value) || !validateUsernameServer(value)) {
//       setValid(false);
//       return false;
//     }
//     setValid(true);
//     return true;
//   };

//   const usernameValid = validateField(profile.username, setIsUsernameValid);
//   const githubValid = validateField(profile.githubUsername, setIsGithubValid);

//   return usernameValid && githubValid;
// };
