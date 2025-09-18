import { FiLoader } from 'react-icons/fi';
import './style.css'; 

function Loader({ isLoading }) {
  if (isLoading) {
    return (
      <div className="loader">
        <FiLoader size={40} />
      </div>
    );
  }
}

export default Loader;
