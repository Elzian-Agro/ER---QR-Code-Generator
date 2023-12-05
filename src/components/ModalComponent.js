import React from "react";
import { Modal } from "react-bootstrap"; 
import PropTypes from 'prop-types';

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

ModalComponent.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  screen: PropTypes.bool,
  modalHeader: PropTypes.string,
  modalContent: PropTypes.node,
};

export default ModalComponent;
