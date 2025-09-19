const SelectInput = ({
  label,
  name,
  value,
  onChange,
  className = "",
  disabled = false,
  options = [],
}) => {
  return (
    <div className="inputwrapper">
      {label && <label htmlFor={name}>{label}</label>}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={className}
        disabled={disabled}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};


export default SelectInput;
