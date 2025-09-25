import Form from '../../../components/form';
import TextInput from '../../../components/form/textInput';
import { mobileRegex } from '../welcomeValidation';

const StepContact = ({ data, setData, isMobileValid, setIsMobileValid }) => {
  const handleOnChange = (e) => {
    if (e.target.name === 'mobile') {
      setIsMobileValid(mobileRegex.test(e.target.value));
    }

    setData(e);
  };

  return (
    <>
      <div className="welcome-formheader">
        <h3>Contact info</h3>
      </div>

      <Form className="welcome-form">
        <div className="welcome-form-inputs">
          <TextInput onChange={setData} value={data.email} name="email" label={'Email'} disabled />
          <TextInput
            onChange={handleOnChange}
            value={data.mobile}
            name="mobile"
            label={'Mobile'}
            className={!isMobileValid ? 'inputInvalid' : 'inputValid'}
          />
        </div>
      </Form>
    </>
  );
};

export default StepContact;
