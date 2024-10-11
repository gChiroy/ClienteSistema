import React, { useState, useEffect } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import {
  InputGroup,
  InputGroupText,
  Form,
  Label,
  Input,
  Button,
  FormGroup,
  Col,
  Card,
  Spinner,
  Row,
} from 'reactstrap'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { IoIosAddCircle } from 'react-icons/io'
import swal from 'sweetalert'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import { ModalSpinner } from '../../providers/ModalSpinner'


const ModalAddProduct = (props) => {
  const URL_B = import.meta.env.VITE_URL_API;
  const { getProduct } = props

  const [modalOpen, setmodalOpen] = useState(false)
  const toggleModal = () => setmodalOpen(!modalOpen)



//   const isValidUs =
//     // /[A-Z]/.test(values.users) && // al menos una mayúscula
//     /[a-z]/.test(values.users) && /\d/.test(values.users) // al menos una minúscula // al menos un dígito numérico

  const UsuValidacion = 'El nombre de usuario debe tener' + ' letras y numeros'

//   const isValidPass =
//     values.password.length >= 6 &&
//     values.password.length <= 15 &&
//     /[A-Z]/.test(values.password) && // al menos una mayúscula
//     /[a-z]/.test(values.password) && // al menos una minúscula
//     /\d/.test(values.password) // al menos un dígito numérico

  const PassValidacion =
    'La contraseña debe tener entre 6 y 15 caracteres' +
    ' y contener al menos una letra mayúscula, una letra minúscula ' +
    'y un dígito numérico'
   // Crear un estado para los valores del formulario
   const [values, setValues] = useState({
    code_product: '',
    name: '',
    categoryId: '',
    detail: '',
    image: null,    

  });

  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    setImagePreview(URL.createObjectURL(selectedFile));
  };

 
  

  // Crear un estado para los errores del formulario
  const [errors, setErrors] = useState({});




  const [loading, setLoading] = useState(false)


  const [categories, setCategories] = useState([])

    const  fetchCategories = async () => {
      // setLoading(true)
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
    useEffect(()=>{
      fetchCategories();
    },[])

    
    const handleChange = (e) => {
      const { name, value, files } = e.target;
    
      // Si el campo debe aceptar solo números, reemplaza los caracteres no numéricos
      if (name === 'code_product' ) {
        const numericValue = value.replace(/[^0-9.]/g, ''); // Permitir también puntos decimales
        setValues({ ...values, [name]: numericValue });
      } else {
        if (files && files.length > 0) {
          const selectedFile = files[0];
          setImagePreview(URL.createObjectURL(selectedFile));
        }
        setValues({
          ...values,
          [name]: files ? files[0] : value,
        });
      }
    };
    
    
  

  // Crear una función para enviar el formulario al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    // Validar el formulario antes de enviarlo
    // if (validate()) {
      // Crear un objeto FormData con los valores del formulario
      // const formData = new FormData();
      // formData.append('image', values.image);
      // formData.append('code_product', values.code_product);
      // formData.append('name', values.name);
      // formData.append('brands_id_brands', values.brandId);
      // formData.append('categories_id_category', values.categoryId);
      // formData.append('detail', values.detail);

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('detail', values.detail);
      formData.append('code_product', values.code_product);
      formData.append('brands_id_brands', values.brandId);
      formData.append('categories_id_category', values.categoryId);
      formData.append('image', values.image);

      // Enviar el formulario al servidor usando fetch
      try {
        const response = await fetch(`${URL_B}/api/product`, {
          method: 'POST',
        body: formData,
        credentials:'include'

        });
        const data = await response.json();
        if(response.ok){
          setValues({ code_product: '',
          name: '',
          brandId: '',
          categoryId: '',
          detail: '',
          image: null,    })
          toggleModal()
          getProduct()
          toast.success(`Se registró correctamente: ${values.name}`, {
          // position: 'bottom-center',
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          })
      }
        else{
          // setError(data.error)
          toast.error(`Algo salio mal: ${data.errors[0].msg}`, {
            // position: 'bottom-center',
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

        }
        // Mostrar el resultado como json en la consola
        // console.log("prod",data);
        
        // navigate('/');
      } catch (error) {
        // Manejar el error
        console.error(error);
      } finally{
        setLoading(false)
      }
    // }
  };


  return (
    <>
      {/* <Button onClick={modalOpen}>
        Agregar
    </Button> */}

      {/* <div color='success' style={{display:"flex", alignItems:'center', border: '1px solid green', borderRadius:"8px"}}> */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >

          <Button 
          color="primary" 
          onClick={toggleModal}
          >
            Registrar producto
          </Button>
 
      </div>

      {/* </div> */}
      {/* size="lg" */}
      <Modal
        isOpen={modalOpen}
        fade={false}
        toggle={toggleModal}
        centered={true}
      >
        <ModalHeader toggle={toggleModal}>
          <AiOutlineUserAdd size={30} /> Ingresar nuevo producto
        </ModalHeader>
        <ModalBody>
        <Form className="container mt-3" onSubmit={handleSubmit}>
          <div className="mb-3">
            <Label htmlFor="image" className="form-label">
              Imagen
            </Label>
            <InputGroup>
              <Input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                id="image"
                className="form-control"
              />

              {imagePreview && (
                <Card style={{ width: "5rem", marginLeft: '10px' }}>
                  <img src={imagePreview} alt="Image Preview" className="img-fluid" />
                </Card>
              )}
            </InputGroup>
            {errors.image && <div className="invalid-feedback">{errors.image}</div>}
          </div>

          <FormGroup className='mb-3'>
            <Label htmlFor="code_product" className="form-label">
              Codigo
            </Label>
            <Input
              onChange={handleChange}
              type='number'
              value={values.code_product || ''}
              className="form-control"
              id="code_product"
              name="code_product"
              placeholder="123432"
              required
            />
            {errors.code_product && <div className="invalid-feedback">{errors.code_product}</div>}
          </FormGroup>          

          <Row>
            
            <Col md="6" className="mb-3">
            <Label htmlFor="name" className="form-label">
              Nombre Producto
            </Label>
            <Input
              onChange={handleChange}
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={values.name || ''}
              placeholder="Producto"
              required
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </Col>

            <Col md="6" className="mb-3">
              <Label htmlFor="categoryId" className="form-label">
                Categoria
              </Label>
              <Input
                type="select"
                id="categoryId"
                name="categoryId"
                value={values.categoryId}
                onChange={handleChange}
              >
                <option>Selecciona</option>
                {categories.map((category) => (
                  <option
                    key={category.id_category}
                    value={category.id_category}
                  >
                    {category.type}
                  </option>
                ))}
              </Input>
              {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
            </Col>
          </Row>



          <div className="mb-3">
            <Label htmlFor="detail" className="form-label">
              Detalle
            </Label>
            <InputGroup>
              <Input
                onChange={handleChange}
                type='textarea'
                value={values.detail || ''}
                className="form-control"
                id="detail"
                name="detail"
                placeholder="Detalles especificos del producto"
                required
              />
            </InputGroup>
          </div>

          <div className='d-flex justify-content-center p-2'>
            <Button color="danger" onClick={toggleModal}>
              Cancelar
            </Button>
            <Button
              color="success"
              className='mx-1'
              type="submit"
            >
              Registrar
            </Button>
          </div>
        </Form>

        </ModalBody>
        
      </Modal>
      <ToastContainer/>

      <ModalSpinner loading={loading}/>

      
    </>
  )
}

export default ModalAddProduct
