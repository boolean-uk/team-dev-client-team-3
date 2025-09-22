import Form from '../../../components/form';
import TextInput from '../../../components/form/textInput';
import ProfileCircle from '../../../components/profileCircle';
import { validateUsernameClient, validateUsernameServer } from '../welcomeValidation';

const StepBasic = ({
  data,
  setData,
  isFirstNameValid,
  setIsFirstNameValid,
  isLastNameValid,
  setIsLastNameValid,
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

  const handleOnBlur = async ({ target: { name, value } }) => {
    // Checks if value is truthy, then validates with server if truthy.
    value = value.trim();

    const validationSetters = {
      username: setIsUsernameValid,
      githubUsername: setIsGithubValid,
      firstName: setIsFirstNameValid,
      lastName: setIsLastNameValid
    };

    const setValid = validationSetters[name];
    if (!setValid) return;

    if (name === 'firstName' || name === 'lastName') {
      setValid(value.length > 0);
    } else {
      setValid(value ? await validateUsernameServer(value) : false);
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
            <ProfileCircle
              id="photo"
              allowUpload={true}
              photoUrl={data.photo}
              fullName={`${data.firstName || ''} ${data.lastName || ''}`}
            />{' '}
          </div>
          <p className="welcome-form-profileimg-error">Please upload a valid image file</p>
        </div>

        <div className="welcome-form-inputs">
          <TextInput
            onChange={handleOnChange}
            onBlur={handleOnBlur}
            value={data.firstName}
            name="firstName"
            label={'First name*'}
            className={!isFirstNameValid ? 'inputInvalid' : 'inputValid'}
          />
          <TextInput
            onChange={handleOnChange}
            onBlur={handleOnBlur}
            value={data.lastName}
            name="lastName"
            label={'Last name*'}
            className={!isLastNameValid ? 'inputInvalid' : 'inputValid'}
          />
          <TextInput
            onChange={handleOnChange}
            onBlur={handleOnBlur}
            value={data.username}
            name="username"
            label={'Username*'}
            className={!isUsernameValid ? 'inputInvalid' : 'inputValid'}
          />
          <TextInput
            onChange={handleOnChange}
            onBlur={handleOnBlur}
            value={data.githubUsername}
            name="githubUsername"
            label={'Github Username*'}
            className={!isGithubValid ? 'inputInvalid' : 'inputValid'}
          />
          {!isFirstNameValid || !isLastNameValid ? (
            <p style={{ color: 'red' }}>First and last name cannot be empty.</p>
          ) : null}
          {!isGithubValid || !isUsernameValid ? (
            <p style={{ color: 'red' }}>
              Usernames can only contain letters, numbers and hyphens. Cannot start or end with
              hyphens.
            </p>
          ) : null}
          <p className="text-blue1">*Required</p>
        </div>
      </Form>
    </>
  );
};

export default StepBasic;
