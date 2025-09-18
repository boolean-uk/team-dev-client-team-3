import Form from '../../../components/form';
import TextInput from '../../../components/form/textInput';

const StepThree = ({
  data,
  setData,
  isRoleValid,
  setIsRoleValid,
  isStartDateValid,
  setIsStartDateValid,
  isEndDateValid,
  setIsEndDateValid
}) => {
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    // Might be updated later if backend decides to use strings
    if (name === 'role') {
      setIsRoleValid(value >= 0 && value <= 1);
    }

    if (name === 'startDate') {
      const parsed = new Date(value);
      setIsStartDateValid(!isNaN(parsed.getTime()));
    }

    if (name === 'endDate') {
      const parsed = new Date(value);
      setIsEndDateValid(!isNaN(parsed.getTime()));
    }

    setData(e);
  };

  return (
    <>
      <div className="welcome-formheader">
        <h3>Training info</h3>
      </div>

      <Form className="welcome-form">
        <div className="welcome-form-inputs">
          <TextInput
            type="number"
            onChange={handleOnChange}
            value={data.role}
            name="role"
            label={'Role*'}
            className={!isRoleValid ? 'inputInvalid' : 'inputValid'}
          />
          <TextInput
            onChange={handleOnChange}
            value={data.specialism}
            name="specialism"
            label={'Specialism'}
          />
          <TextInput onChange={setData} value={data.cohort} name="cohort" label={'Cohort'} />
          <TextInput
            onChange={handleOnChange}
            value={data.startDate ? data.startDate.split('T')[0] : ''}
            name="startDate"
            label={'Start Date*'}
            type="date"
            className={!isStartDateValid ? 'inputInvalid' : 'inputValid'}
          />
          <TextInput
            onChange={handleOnChange}
            value={data.endDate ? data.endDate.split('T')[0] : ''}
            name="endDate"
            label={'End Date*'}
            type="date"
            className={!isEndDateValid ? 'inputInvalid' : 'inputValid'}
          />

          {(!isRoleValid || !isStartDateValid || !isEndDateValid) && (
            <p style={{ color: 'red' }}>
              Role must be an integer. Start and End Date must be valid dates.
            </p>
          )}

          <p className="text-blue1">*Required</p>
        </div>
      </Form>
    </>
  );
};

export default StepThree;
