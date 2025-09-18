import Steps from './steps';
import Card from '../card';
import Button from '../button';
import './style.css';
import { useEffect, useState } from 'react';

const Stepper = ({
  header,
  children,
  onComplete,
  isFirstNameValid,
  isLastNameValid,
  isUsernameValid,
  isGithubValid,
  isRoleValid,
  isStartDateValid,
  isEndDateValid
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [disableNextButton, setDisableNextButton] = useState(false);

  const onBackClick = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onNextClick = () => {
    if (currentStep === children.length - 1) {
      onComplete();
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  useEffect(() => {
    if (currentStep === 0) {
      setDisableNextButton(
        !(isFirstNameValid && isLastNameValid && isGithubValid && isUsernameValid)
      );
    } else if (currentStep === 2) {
      setDisableNextButton(!(isRoleValid && isStartDateValid && isEndDateValid));
    } else {
      setDisableNextButton(false); // steps without validation
    }
  }, [
    currentStep,
    isFirstNameValid,
    isLastNameValid,
    isGithubValid,
    isUsernameValid,
    isRoleValid,
    isStartDateValid,
    isEndDateValid
  ]);

  return (
    <Card>
      {header}

      <div className="steps-container">
        <Steps maxSteps={children.length} currentStep={currentStep} />
      </div>

      {children[currentStep]}

      <div className="stepper-buttons">
        <Button text="Back" classes="offwhite" onClick={onBackClick} />
        <Button
          text={currentStep === children.length - 1 ? 'Submit' : 'Next'}
          classes="blue"
          onClick={onNextClick}
          disabled={disableNextButton}
        />
      </div>
    </Card>
  );
};

export default Stepper;
