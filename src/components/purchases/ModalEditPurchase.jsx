import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import { TbShoppingCartPlus } from 'react-icons/tb'
import Swal from 'sweetalert'


const EditModal = ( props) => {
  const URL = import.meta.env.VITE_URL_API;
  const { provider, isOpen, toggle, onUpdate } = props;
  // const [name, setName] = useState(provider?.name || '');
  // const [phone, setPhone] = useState(provider?.phone || '');
  // const [nit, setNit] = useState(provider?.nit || '');
  // const [companyId, setCompanyId] = useState(provider?.supplier_company_id_supplier_company || '');


  const [editedProvider, setEditedProvider] = useState({});


  useEffect(() => {
    if (provider) {
      setEditedProvider(provider); // Solo actualiza editedProvider si provider tiene un valor
    }
  }, [provider]);
  
  // useEffect(() => {
  //   setEditedProvider(provider);
  // }, [provider]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProvider({ ...editedProvider, [name] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${URL}/api/provider/${provider.id_provider}`, {
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




  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    // setLoading(true)
    const  fetchCompanies = async () => {
      try {
        const response = await fetch(`${URL}/api/allCompanies`,{
          credentials:'include'
        })

        if (!response.ok) {
          throw new Error('No se pueden listar las compañias')
        }
        const data = await response.json()
        setCompanies(data)
        // setLoading(false)
      } catch (error) {
        console.log(error)
      } finally{
        setLoading(false)
      }
    }
    fetchCompanies()
  }, [])


  return (
    <Modal isOpen={isOpen} toggle={toggle}   centered={true}>
      <ModalHeader toggle={toggle}>
        <TbShoppingCartPlus size={30}/>Editar proveedor
        </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit} className="container mt-3">
        <FormGroup>
          <Label for="name">Nombre</Label>
          <Input type="text" name="name" id="name" value={editedProvider.name || ''} onChange={(e) => handleInputChange(e)} />
        </FormGroup>
        <FormGroup>
          <Label for="phone">Teléfono</Label>
          <Input type="text" name="phone" id="phone" value={editedProvider.phone || ''} onChange={(e) => handleInputChange(e)} />
        </FormGroup>
        <FormGroup>
          <Label for="nit">NIT</Label>
          <Input type="text" name="nit" id="nit" value={editedProvider.nit || ''} onChange={(e) => handleInputChange(e)} />
        </FormGroup>
        <FormGroup>
        <div className="mb-3">
              <Label htmlFor="campañia" className="form-label">
                Categoria 
              </Label>
              <Input
                bsSize="sm"
                className="mb-3"
                type="select"
                // id="companyId"
                name="category_providers_id_supplier_company"
                value={editedProvider.category_providers_id_supplier_company || ''}
                // onChange={(e) => onChange(e)}
                onChange={(e) => handleInputChange(e)}
              >
                <option>Selecciona</option>
                {companies.map((company) => (
                  <option 
                  key={company.id_category_providers} 
                  value={company.id_category_providers}>
                    {company.name}
                  </option>
                ))}
                {/* <option value="admin">Admin</option>
                <option value="empleado">Empleado</option> */}
              </Input>
            </div>
        </FormGroup>
        <div className='d-flex justify-content-center p-2'>
        <Button color="danger" className='mx-1' onClick={toggle}>Cancelar</Button>

        <Button  color="primary" type='submit'>Guardar</Button>
        </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default EditModal;