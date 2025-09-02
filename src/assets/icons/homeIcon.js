const HomeIcon = ({ isActive }) => {
  const colour = isActive ? 'var(--color-blue)' : 'var(--color-blue1)';
  return (
    <svg width="33" height="36" viewBox="0 0 33 36" fill="none">
      <path d="M0.5 36V12L16.6 0L32.5 12V36H20.8V21.75H12.15V36H0.5Z" fill={colour} />
    </svg>
  );
};

export default HomeIcon;
