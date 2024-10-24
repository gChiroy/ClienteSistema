import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { BiFoodMenu } from 'react-icons/bi';
import { MdOutlineAutoDelete } from 'react-icons/md'
import { ToastContainer, toast } from 'react-toastify'
import { ModalSpinner } from '../../providers/ModalSpinner';

export const ModalDeleteSale = (props)=> {
  const URL = import.meta.env.VITE_URL_API;
    const { modalOpen, toggleModal, shoppingId, Update } = props;

    const [loading, setLoading] = useState(false)
  
    const handleDeleteConfirmedCom = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${URL}/api/sale/${shoppingId}`, {
          method: 'DELETE',
          credentials: 'include',
        })
        const data = await res.json()
        // console.log(data)
        toggleModal()
        Update()
        toast.success(`venta eliminada`, {
          // position: 'bottom-center',
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } catch (error) {
        console.log(error)
        toast.success(`No se pudo elimininar!!!`, {
          // position: 'bottom-center',
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }
      finally{
        setLoading(false)
      }
    } 

    return(

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
              onClick={handleDeleteConfirmedCom}
              >Aceptar</Button>
          </ModalFooter>
        </Modal>
        <ToastContainer/>
        <ModalSpinner loading={loading}/>
      </>

    )
}