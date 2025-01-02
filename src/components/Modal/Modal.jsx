import "./Modal.scss";

const Modal = ({ modal_p }) => {
  return (
    <modal className="modalContainer">
      <div className="modal-header-p">
        <p>{modal_p}</p>
      </div>
      <div className="modal-icons">
        <button>
          <i class="bi bi-check2"></i>
        </button>
        <button>
          <i class="bi bi-x"></i>
        </button>
      </div>
    </modal>
  );
};

export default Modal;
