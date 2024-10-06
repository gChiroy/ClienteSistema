import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Spinner } from 'reactstrap';
import { TbShoppingCartPlus } from 'react-icons/tb'
import { ToastContainer, toast } from 'react-toastify';
import { ModalSpinner } from '../../providers/ModalSpinner';



const EditModalCustomer = ( props) => {
  const URL = import.meta.env.VITE_URL_API; 
  const { provider, isOpen, toggle, onUpdate } = props;
  const [loading, setLoading] = useState(false)

  const [editedProvider, setEditedProvider] = useState(provider || '');

  useEffect(() => {
    setEditedProvider(provider);
  }, [provider]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProvider({ ...editedProvider, [name] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    fetch(`${URL}/api/customer/${provider.id_customer}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials:'include',
      body: JSON.stringify(editedProvider),
    })
    .then(response => response.json())
    .then(data => {
      // onUpdate(data);
      setLoading(false)
      toggle();
      onUpdate();
      toast.success(`Se registró correctamente: ${data.name}`, {
        // position: 'bottom-center',
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
    })
    .catch(error => {
      console.error(error);
      toast.error(`Edicion incorrecto de: ${editedProvider.name}`, {
        // position: 'bottom-center',
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    })
    // .finally(      setLoading(false)
    // );
   
  };
  // console.log('nombre',provider)



  return (
    <>
    <Modal isOpen={isOpen} toggle={toggle}   centered={true}>
      <ModalHeader toggle={toggle}>
        <TbShoppingCartPlus size={30}/>Editar Cliente
        </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit} className="container mt-3">
        <FormGroup>
          <Label for="name">NIT</Label>
          <Input type="text" name="nit" id="nit" value={editedProvider.nit || ''} onChange={(e) => handleInputChange(e)} />
        </FormGroup>
        <FormGroup>
          <Label for="name">Nombre</Label>
          <Input type="text" name="name" id="name" value={editedProvider.name || ''} onChange={(e) => handleInputChange(e)} />
        </FormGroup>
        <FormGroup>
          <Label for="address">Direccion</Label>
          <Input type="text" name="address" id="address" value={editedProvider.address || ''} onChange={(e) => handleInputChange(e)} />
        </FormGroup>
        <FormGroup>
          <Label for="phone">Telefono</Label>
          <Input type="text" name="phone" id="phone" value={editedProvider.phone || ''} onChange={(e) => handleInputChange(e)} />
        </FormGroup>
        <div className='d-flex justify-content-center p-2'>
        <Button color="danger" onClick={toggle}>Cancelar</Button>

        <Button  color="primary" type='submit' className='mx-1'>Guardar</Button>
        </div>
        </Form>
      </ModalBody>
    </Modal>
    <ToastContainer/>
                  {/* Modal de superposición */}
                  <ModalSpinner loading={loading}/>

    </>
  );
};

export default EditModalCustomer;