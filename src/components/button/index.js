const Button = ({
  text,
  onClick,
  type = 'button',
  classes = '',
  size = 'default',
  disabled = false
}) => {
  const className = `${classes} ${size === 'small' ? 'btn-small' : ''}`;
  return (
    <button type={type} onClick={onClick} className={className} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;
