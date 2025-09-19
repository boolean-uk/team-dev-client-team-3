import Form from '../../../components/form';
import useAuth from '../../../hooks/useAuth';

const StepFour = ({ data, setData, maxLength = 300 }) => {

  return (
    <>
      <div className="welcome-formheader">
        <h3>Bio</h3>
      </div>
      <Form>
        <section>
          <div className="welcome-form-inputs">
            <div>
              <textarea
                maxLength={maxLength}
                id="bio"
                name="bio"
                value={data.bio || ''}
                onChange={setData}
                placeholder="Write here"
              />
              <span id="charCount">
                {data.bio?.length ?? 0}/{maxLength}
              </span>
            </div>
          </div>
        </section>
      </Form>
    </>
  );
};

export default StepFour;
