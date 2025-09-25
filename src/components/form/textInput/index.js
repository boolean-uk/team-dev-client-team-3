import { useState } from 'react';
import EyeIcon from '../../../assets/icons/eyeicon';
import './style.css';

const TextInput = ({
  value,
  onChange,
  onKeyDown,
  name,
  label,
  icon,
  className,
  readOnly = false,
  type = 'text',
  placeholder = '',
  onClick,
  onBlur: onBlurProp,
  disabled = false,
  maxLength = 280,
  style = {}
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const showIcon = icon && !(isFocused || value);

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlurProp?.(e);
  };

  if (type === 'password') {
    return (
      <div className="inputwrapper">
        <label htmlFor={name}>{label}</label>

        <div className="inputWithButton">
          <input
            id={name}
            type={showPassword ? 'text' : type}
            name={name}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onBlur={handleBlur}
            onClick={onClick}
            autoComplete={type === 'password' ? 'current-password' : undefined}
            className={className}
            disabled={disabled}
            placeholder={placeholder}
            readOnly={readOnly}
          />

          <button
            type="button"
            className={`showpasswordbutton formButton ${showPassword ? '__faded' : ''}`}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowPassword((s) => !s)}
          >
            <EyeIcon />
          </button>
        </div>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className="inputwrapper">
        {label && <label htmlFor={name}>{label}</label>}
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className={className}
          placeholder={placeholder}
          onBlur={handleBlur}
          disabled={disabled}
          maxLength={maxLength}
          style={{ width: '100%', resize: 'vertical', ...style }}
          readOnly={readOnly}
        />
        {icon && <span className="icon">{icon}</span>}
        <div className="charCounter">
          {value.length}/{maxLength}
        </div>
      </div>
    );
  }

  return (
    <div className="inputwrapper">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        onFocus={() => setIsFocused(true)}
        readOnly={readOnly}
        onBlur={handleBlur}
      />
      {showIcon && <span className="icon">{icon}</span>}
    </div>
  );
};

export default TextInput;
