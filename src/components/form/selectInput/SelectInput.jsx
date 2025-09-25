import { useState } from 'react';
import './style.css';

const SelectInput = ({
  label,
  name,
  value,
  onChange,
  className = '',
  disabled = false,
  options = []
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`inputwrapper select-wrapper`}>
      {label && <label htmlFor={name}>{label}</label>}
      <div className={`select-container ${isOpen ? 'open' : ''}`}>
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={className}
          disabled={disabled}
          style={{ cursor: disabled ? 'default' : 'pointer' }}
          onClick={() => setIsOpen((prev) => !prev)}
          onBlur={() => setIsOpen(false)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="dropdown-icon">▼</span>
      </div>
    </div>
  );
};

export default SelectInput;
