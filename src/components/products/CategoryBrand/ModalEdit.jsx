import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import { TbShoppingCartPlus } from 'react-icons/tb'
import { ToastContainer, toast } from 'react-toastify';

export const EditModalCategory = ( props) => {
  const URL = import.meta.env.VITE_URL_API;
    const { provider, isOpen, toggle, onUpdate } = props;
  
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
      fetch(`${URL}/api/category/${provider.id_category}`, {
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
        toggle();
        onUpdate();
        toast.success(`Editado correctamente`, {
            // position: 'bottom-center',
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })
      })
      .catch(error => {
        console.error(error)
        toast.error(`No se pudo realizar la edicion`, {
            // position: 'bottom-center',
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          })
    
    });
    };
    // console.log('nombre',provider)
  
  
  
    return (
<>
<Modal isOpen={isOpen} toggle={toggle}   centered={true}>
        <ModalHeader toggle={toggle}>
          <TbShoppingCartPlus size={30}/>Editar Categoria
          </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit} className="container mt-3">
          <FormGroup>
            <Label for="type">Nombre</Label>
            <Input type="text" name="type" id="type" value={editedProvider.type || ''} onChange={(e) => handleInputChange(e)} />
          </FormGroup>
          <div className='d-flex justify-content-center p-2'>
          <Button color="danger" onClick={toggle}>Cancelar</Button>
  
          <Button color="success" className='mx-1' type='submit'>Guardar</Button>
          </div>
          </Form>
        </ModalBody>
      </Modal>
    <ToastContainer/>
</>
    );
  };



