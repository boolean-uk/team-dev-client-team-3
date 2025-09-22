import Form from '../../../components/form';
import TextInput from '../../../components/form/textInput';

const StepAbout = ({ data, setData, maxLength = 300 }) => {
  return (
    <>
      <div className="welcome-formheader">
        <h3>About</h3>
      </div>

      <Form className="welcome-form">
        <div className="welcome-form-inputs">
          <TextInput
            onChange={setData}
            value={data.specialism || ''}
            name="specialism"
            label="Specialism"
          />

          <div className="inputwrapper">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={data.bio || ''}
              onChange={setData}
              maxLength={maxLength}
              placeholder="Write here"
            />
            <span id="charCount">
              {data.bio?.length ?? 0}/{maxLength}
            </span>
          </div>
        </div>
      </Form>
    </>
  );
};

export default StepAbout;
