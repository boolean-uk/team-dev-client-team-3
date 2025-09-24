import './style.css';

const RememberMeCheckbox = ({ checked, onChange }) => {
  return (
    <div className="remember-me">
      <label htmlFor="rememberMe">Remember me</label>
      <input
        type="checkbox"
        id="rememberMe"
        name="rememberMe"
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
};

export default RememberMeCheckbox;
