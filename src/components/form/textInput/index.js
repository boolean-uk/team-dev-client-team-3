import { useState } from 'react';

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
  disabled = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  if (type === 'password') {
    return (
      <div className="inputwrapper">
        <label htmlFor={name}>{label}</label>

        <div className="inputWithButton">
          <input
            id={name}
            type={showPassword ? 'text' : 'password'}
            name={name}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            className={className}
            placeholder={placeholder}
            onBlur={onBlur}
            disabled={disabled}
          />
          <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
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
