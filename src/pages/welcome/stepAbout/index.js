import Form from '../../../components/form';
import TextInput from '../../../components/form/textInput';

const StepAbout = ({ data, setData }) => {
  return (
    <>
      <div className="welcome-formheader">
        <h3>About</h3>
      </div>
      <Form className="welcome-form">
        <div className="welcome-form-inputs">
          <TextInput
            onChange={setData}
            value={data.specialism}
            name="specialism"
            label={'Specialism'}
          />
          <div className="inputwrapper">
            <label htmlFor={'bio'}>Bio</label>
            <textarea
              name="bio"
              value={data.bio}
              onChange={setData}
              placeholder="Write here"
            ></textarea>
          </div>
        </div>
      </Form>
    </>
  );
};

export default StepAbout;
