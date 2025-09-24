import { MdTask } from 'react-icons/md';

function exerciseIcon({ isActive }) {
  const color = isActive ? 'var(--color-blue)' : 'var(--color-blue1)';
  return <MdTask className="exercise-icon" size={40} style={{ fill: color }} />;
}

export default exerciseIcon;
