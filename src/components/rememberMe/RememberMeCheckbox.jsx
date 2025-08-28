import { useState } from 'react';
// import './rememberMeCheckbox.css';

const RememberMeCheckbox = ({ checked, onChange }) => {
  return (
    <div className="remember-me">
      <input
        type="checkbox"
        id="rememberMe"
        name="rememberMe"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor="rememberMe">Remember me</label>
    </div>
  );
};

export default RememberMeCheckbox;
