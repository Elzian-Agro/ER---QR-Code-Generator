import React from "react";
import { Modal } from "react-bootstrap"; 

const ModalComponent = ({ showModal, closeModal, screen, modalHeader, modalContent }) => {
  return (
    <Modal show={showModal} onHide={closeModal} fullscreen={screen}>
      <Modal.Header closeButton>
        <Modal.Title>{modalHeader}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalContent}</Modal.Body>
    </Modal>
  );
};

export default ModalComponent;
