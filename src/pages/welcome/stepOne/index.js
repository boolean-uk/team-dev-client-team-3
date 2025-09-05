import ProfileIcon from '../../../assets/icons/profileIcon';
import Form from '../../../components/form';
import TextInput from '../../../components/form/textInput';
import { validateUsernameClient, validateUsernameServer } from '../welcomeValidation';

const StepOne = ({
  data,
  setData,
  isUsernameValid,
  setIsUsernameValid,
  isGithubValid,
  setIsGithubValid
}) => {
  const handleOnChange = (e) => {
    if (e.target.name === 'username') {
      setIsUsernameValid(validateUsernameClient(e.target.value));
    } else if (e.target.name === 'githubUsername') {
      setIsGithubValid(validateUsernameClient(e.target.value));
    }

    setData(e);
  };

  const handleOnBlur = (e) => {
    console.log('HandleOnBlur!');
    if (e.target.name === 'username') {
      setIsUsernameValid(validateUsernameServer(e.target.value));
    } else if (e.target.name === 'githubUsername') {
      setIsGithubValid(validateUsernameServer(e.target.value));
    }
  };

  return (
    <>
      <div className="welcome-formheader">
        <h3>Basic info</h3>
      </div>

      <Form className="welcome-form">
        <div className="welcome-form-profileimg">
          <p className="text-blue1">Photo</p>
          <div className="welcome-form-profileimg-input">
            <ProfileIcon colour="#28C846" background="#64DC78" />
            <p className="text-blue1">Add headshot</p>
          </div>
          <p className="welcome-form-profileimg-error">Please upload a valid image file</p>
        </div>

        <div className="welcome-form-inputs">
          <TextInput
            onChange={handleOnChange}
            value={data.firstName}
            name="firstName"
            label={'First name*'}
          />
          <TextInput
            onChange={handleOnChange}
            value={data.lastName}
            name="lastName"
            label={'Last name*'}
            required
          />
          <TextInput
            onChange={handleOnChange}
            onBlur={handleOnBlur}
            value={data.username}
            name="username"
            label={'Username'}
            className={!isUsernameValid ? 'inputInvalid' : 'inputValid'}
          />
          <TextInput
            onChange={handleOnChange}
            onBlur={handleOnBlur}
            value={data.githubUsername}
            name="githubUsername"
            label={'Github Username'}
            className={!isGithubValid ? 'inputInvalid' : 'inputValid'}
          />
          <p className="text-blue1">*Required</p>
        </div>
      </Form>
    </>
  );
};

export default StepOne;
