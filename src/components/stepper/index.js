import Steps from './steps';
import Card from '../card';
import Button from '../button';
import './style.css';
import { useEffect, useState } from 'react';

const Stepper = ({ header, children, onComplete, isUsernameValid, isGithubValid }) => {
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
    if (isGithubValid && isUsernameValid && currentStep === 0) {
      setDisableNextButton(false);
    } else {
      setDisableNextButton(true);
    }
  }, [isGithubValid, isUsernameValid]);

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
