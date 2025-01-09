import "./Modal.scss";

const Modal = ({component}) => {
  return (
    <div className="modal">
      <div className="modalWindow">
        {component}
      </div>
    </div>
  );
};

export default Modal;

