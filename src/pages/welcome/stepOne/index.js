import ProfileIcon from '../../../assets/icons/profileIcon';
import Form from '../../../components/form';
import TextInput from '../../../components/form/textInput';

const StepOne = ({ data, setData }) => {
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
            onChange={setData}
            value={data.firstName}
            name="firstName"
            label={'First name*'}
          />
          <TextInput
            onChange={setData}
            value={data.lastName}
            name="lastName"
            label={'Last name*'}
            required
          />
          <TextInput
            onChange={setData}
            value={data.githubUsername}
            name="username"
            label={'Username*'}
          />
          <TextInput
            onChange={setData}
            value={data.githubUsername}
            name="githubUsername"
            label={'Github Username'}
          />
          <p className="text-blue1">*Required</p>
        </div>
      </Form>
    </>
  );
};

export default StepOne;
