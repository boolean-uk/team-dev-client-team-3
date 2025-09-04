import ReactModal from 'react-modal';
import useModal from '../../hooks/useModal';
import style from './style.js';
import './style.css';
import Button from '../button/index.js';

ReactModal.setAppElement('#root');

const Modal = ({ width = '612px' }) => {
  const { isOpen, closeModal, modalComponent, modalHeader } = useModal();

  style.content.width = width;

  return (
    <ReactModal isOpen={isOpen} onRequestClose={closeModal} style={style}>
      <div className="modal-body">
        <section className="modal-header border-bottom">
          <h2>{modalHeader}</h2>
          <Button onClick={closeModal} text="✖" />
        </section>

        <section className="modal-content">{modalComponent}</section>
      </div>
    </ReactModal>
  );
};

export default Modal;
