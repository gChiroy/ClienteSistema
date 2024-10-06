import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import { TbShoppingCartPlus } from 'react-icons/tb'
import Swal from 'sweetalert'


const EditModalCompany = ( props) => {
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
    fetch(`${URL}/api/campany/${provider.id_category_providers}`, {
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
      swal({
        title: "Con exito",
        text: "La accion resulto correcto!",
        icon: "success",
        // button: "Esta bien!",
        showConfirmButton: false,
        timer: 2000,
      });
    })
    .catch(error => console.error(error));
  };
  // console.log('nombre',provider)



  return (
    <Modal isOpen={isOpen} toggle={toggle}   centered={true}>
      <ModalHeader toggle={toggle}>
        <TbShoppingCartPlus size={30}/>Editar Categoria
        </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit} className="container mt-3">
        <FormGroup>
          <Label for="name">Nombre</Label>
          <Input type="text" name="name" id="name" value={editedProvider.name || ''} onChange={(e) => handleInputChange(e)} />
        </FormGroup>
        <div className='d-flex justify-content-center p-2'>
        <Button className='mx-1' color="danger" onClick={toggle}>Cancelar</Button>

        <Button color="primary" type='submit'>Guardar</Button>
        </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default EditModalCompany;