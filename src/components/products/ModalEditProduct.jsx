// ModalEditProduct
import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, InputGroup, Col, Card, InputGroupText, Spinner, Row } from 'reactstrap';
import { TbShoppingCartPlus } from 'react-icons/tb'

import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import { ModalSpinner } from '../../providers/ModalSpinner';


const EditModalProduct = ( props) => {
  const URL_B = import.meta.env.VITE_URL_API;
  const { provider, isOpen, toggle, onUpdate } = props;

  const [editedProvider, setEditedProvider] = useState({ });
  const [imagePreview, setImagePreview] = useState(null);


  useEffect(() => {
    setEditedProvider(provider);
  }, [provider]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProvider({ ...editedProvider, [name] : value });
    
  };

  
  
  const [brands, setBrands] = useState([])

  const [loading, setLoading] = useState(false)


  const [categories, setCategories] = useState([])
  useEffect(() => {
    setLoading(true)
    const  fetchCategories = async () => {
      try {
        const response = await fetch(`${URL_B}/api/allCategories`,{
          credentials:'include'
        })

        if (!response.ok) {
          throw new Error('No se pueden listar las categporias')
        }
        const data = await response.json()
        // console.log('categorias',data)
        setCategories(data)
        // updCompanies()
        // setLoading(false)
      } catch (error) {
        console.log(error)
      } finally{
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])//brands despues[], esta solo por preuba


  const previewImage1 = (e) => {
    const newImage = e.target.files[0];
    setEditedProvider(prevTask => ({
      ...prevTask,
      image: newImage,
    }));
    setImagePreview(URL.createObjectURL(newImage)); // Actualiza la previsualización de la imagen
  }

  const previewImage = (e) => {
    const newImage = e.target.files[0];
    setEditedProvider((prevTask) => ({
      ...prevTask,
      image: newImage,
    }));
    setImagePreview(URL.createObjectURL(newImage));
    // console.log("imagePreview:", imagePreview); // Agrega esta línea
  };


 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
      // Enviar el formulario al servidor usando fetch
      try {

       // Clona editedProvider para evitar modificar el estado directamente
  const updatedProvider = { ...editedProvider };

  // Crea un objeto FormData para enviar la imagen como archivo
  const formData = new FormData();
  formData.append('image', editedProvider.image); // Asegúrate de que la clave 'image' coincida con la esperada en tu backend

  // Agrega otros campos de datos al FormData
      formData.append('name', updatedProvider.name);
      formData.append('detail', updatedProvider.detail);
      formData.append('code_product', updatedProvider.code_product);
      formData.append('profit_porc', updatedProvider.profit_porc);
      // formData.append('brands_id_brands', updatedProvider.brands_id_brands);
      formData.append('categories_id_category', updatedProvider.categories_id_category);

        const response = await fetch(`${URL_B}/api/product/${provider.id_product}`, {
          method: 'PUT',
          // headers: {
          //   'Content-Type': 'application/json'
          // },
          credentials: 'include',
          // body: JSON.stringify(updatedProvider)
          body: formData

        });
        const data = await response.json();
        // Mostrar el resultado como json en la consola
        // console.log("prod",data);
        toggle()
        onUpdate()
        toast.success(`Editado Correctamente`, {
          // position: 'bottom-center',
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        // navigate('/');
      } catch (error) {
        // Manejar el error
        console.error(error);
        toast.error(`No se pudo editar `, {
          // position: 'bottom-center',
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } finally{
        setLoading(false)
      }
    // }
  };




  return (

    <>   
    <Modal
      isOpen={isOpen}
      fade={false}
      toggle={toggle}
      centered={true}
    >
      <ModalHeader toggle={toggle}>
        <AiOutlineUsergroupAdd size={30} /> Editar producto
      </ModalHeader>
      <ModalBody>
        <Form className="container mt-3" onSubmit={handleSubmit} >
        <div className="mb-3">
            
            <InputGroup style={{alignItems: "center"}}>
            <Label htmlFor="image" className="form-label" style={{marginRight: "10px"}}>
              Imagen  
            </Label>
            <Input 
            type="file" 
            name="image"
            accept="image/*"
            onChange={previewImage}
            id="image"
            className="form-control"
            />
            
            {imagePreview ? (
              <Card style={{ width: "5rem", marginLeft: '10px' }}>
                <img src={imagePreview} alt="Image Preview" className="img-fluid" />
              </Card>
            ) : editedProvider.url_product ? (
              <Card style={{ width: "5rem", marginLeft: '10px' }}>
                <img src={editedProvider.url_product} alt={editedProvider.name} className="img-fluid" />
              </Card>
            ) : (
              <div>No hay imagen cargada</div>
            )}
            </InputGroup>
            {/* {errors.title && <p style={{ color: 'red' }}>{errors.title}</p>} */}
            {/* {errors.image && (
                <div className="invalid-feedback">{errors.image}</div>
              )} */}

            
          </div>
          <Col className="d-flex mb-3">
            <FormGroup className='w-100'>
            <Label htmlFor="code_product" className="form-label">
              Codigo
            </Label>
              <Input
                onChange={handleChange}
                type='number'
                value={editedProvider.code_product || ''}
                className="form-control"
                id="code_product"
                name="code_product"
                placeholder="123432"
                // valid={isValidPass}
                // invalid={values.password && !isValid}
              //   invalid={!!(values.password && !isValidPass)} // Aquí usamos !! para convertir a booleano
                required
              />
              {/* {errors.title && <p style={{ color: 'red' }}>{errors.title}</p>} */}

            </FormGroup>
          </Col>
          <Row>
          <Col md="6" className="mb-3">
          <FormGroup className='w-100'>
            <Label htmlFor="passwprofit_porcord" className="form-label">
              Margen de Beneficio
            </Label>
              <Input
                  
                onChange={handleChange}
                type='number'
                value={editedProvider.profit_porc || ''}
                className="form-control"
                id="profit_porc"
                name="profit_porc"
                placeholder="12"
                required
              />
            </FormGroup>
            
            </Col>
            <Col md="6" className="mb-3">
            <FormGroup className="">
              <Label htmlFor="name" className="form-label">
                Nombre Producto
              </Label>
              <InputGroup >
                <Input
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={editedProvider.name || ''}
                  placeholder="Licuadora"
                  required
                />
              </InputGroup>
            </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md="6" className="mb-3">
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label htmlFor="KLJ" className="form-label">
                Categoria
              </Label>
              <Input
                type="select"
                // id="categoryId"
                name="categories_id_category"
                value={editedProvider.categories_id_category}
                onChange={handleChange}
              >
                <option disabled>Slect</option>
                {categories.map((category) => (
                  <option 
                  key={category.id_category}
                  value={category.id_category}>
                    {category.type}
                  </option>
                ))}
                {/* <option disabled>Selecciona</option>
                  {categories.map((category) => (
                      <option
                      key={category.id_category}
                      value={category.id_category}
                      >
                      {category.type}
                      </option>
                  ))} */}
              </Input>

            </FormGroup>
            </Col>
          </Row>

          <div className="mb-3">
          <Label htmlFor="detail" className="form-label">
              Detalle
            </Label>
            <InputGroup >
              <Input
                onChange={handleChange}
                type='textarea'
                value={editedProvider.detail || ''}
                className="form-control"
                id="detail"
                name="detail"
                placeholder="tamaño- 50cm*20px, color- blanco"
              //   valid={isValidPass}
                // invalid={values.password && !isValid}
              //   invalid={!!(values.password && !isValidPass)} // Aquí usamos !! para convertir a booleano
                required
              />
            </InputGroup>
          </div>
          {/* <div style={{color:'red', margin:'10px 0'}}>{error}</div>
        <div style={{color:'green', margin:'10px 0'}}>{success}</div> */}

<div className='d-flex justify-content-center p-2'>
        <Button color="danger" onClick={toggle}>
          Cancelar
        </Button>
        <Button
          color="primary"
          // onClick={handleSubmit}
          className='mx-2'
          type="submit"
        > Guardar
        </Button>
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

export default EditModalProduct;