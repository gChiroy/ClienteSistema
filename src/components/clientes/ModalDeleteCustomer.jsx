import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { BiFoodMenu } from 'react-icons/bi';
import { MdOutlineAutoDelete } from 'react-icons/md'




const  ModalDeletCustomer = ( props) => {
  const { modalOpen, toggleModal, handleDeleteConfirmed } = props;

  return (
    <>
      <Modal isOpen={modalOpen} fade={false} toggle={toggleModal} centered={true} >
        <ModalHeader toggle={toggleModal}>
          <MdOutlineAutoDelete size={30} /> Confirme eliminar dato
        </ModalHeader>
        <ModalBody>
          ¿Esta seguro de eliminar el dato?
        </ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={toggleModal}>Cancelar</Button>
            <Button color="danger" 
            onClick={handleDeleteConfirmed}
            >Aceptar</Button>
        </ModalFooter>
      </Modal>

      
    </>
  );
}

export default ModalDeletCustomer;
