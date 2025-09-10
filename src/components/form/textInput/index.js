import { useState } from 'react';
import EyeIcon from '../../../assets/icons/eyeicon';

const TextInput = ({
  value,
  onChange,
  onKeyDown,
  name,
  label,
  icon,
  type = 'text',
  className,
  placeholder = '',
  onBlur = null,
  disabled = false,
  maxLength = 280
}) => {
  const [showPassword, setShowPassword] = useState(false);

  if (type === 'password') {
    return (
      <div className="inputwrapper">
        <label htmlFor={name}>{label}</label>

        <div className="inputWithButton">
          <input
            onBlur={onBlur}
            id={name}
            type={showPassword ? 'text' : type}
            name={name}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            autoComplete={type === 'password' ? 'current-password' : undefined}
            className={className}
            placeholder={placeholder}
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
          onBlur={onBlur}
          disabled={disabled}
          maxLength={maxLength}
          style={{ width: '100%', resize: 'vertical' }}
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
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={className}
        placeholder={placeholder}
        onBlur={onBlur}
        disabled={disabled}
      />
      {icon && <span className="icon">{icon}</span>}
    </div>
  );
};

export default TextInput;
