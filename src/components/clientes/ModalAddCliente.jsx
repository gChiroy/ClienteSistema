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
} from 'reactstrap'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { IoIosAddCircle } from 'react-icons/io'
import swal from 'sweetalert'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import { ModalSpinner } from '../../providers/ModalSpinner'


const ModalAddCustomer = (props) => {
  const URL = import.meta.env.VITE_URL_API;
  const { getProduct } = props

  const [modalOpen, setmodalOpen] = useState(false)
  const toggleModal = () => setmodalOpen(!modalOpen)
  const [error, setError] = useState(false)




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
    nit: '',
    name: '',
    address: '',
    phone: '',

  });

  
 
  
  const [success, setSuccess] = useState(false)
  

  const [loading, setLoading] = useState(false)

    // Crear una función para manejar el cambio de los inputs
    const handleChange = (e) => {
      const { name, value } = e.target
    setValues({
      ...values,
      [name]: value,
    })
    };
    
  

  // Crear una función para enviar el formulario al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
      // Enviar el formulario al servidor usando fetch
      try {
        const response = await fetch(`${URL}/api/customer`, {
          method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          nit: values.nit,
          name: values.name,
          address: values.address,
          phone: values.phone,
        }),

        });
        const data = await response.json();
        // console.log(data)


        if (response.ok) {
          setValues({ users: '', password: '', rol: '' })
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
        });
        } else {
          setError(data.error)
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
        toast.error(`No registró correctamente: ${values.name}`, {
          // position: 'bottom-center',
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
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
            Registrar cliente
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
          <AiOutlineUserAdd size={30} /> Ingresar nuevo cliente
        </ModalHeader>
        <ModalBody>
          <Form className="container mt-3" onSubmit={handleSubmit} >
            <div className="mb-3">
            <Label htmlFor="detail" className="form-label">
                NIT
              </Label>
              <InputGroup >
                <Input
                  onChange={handleChange}
                  type='text'
                  value={values.nit || ''}
                  className="form-control"
                  id="nit"
                  name="nit"
                  placeholder="123456789"
                //   valid={isValidPass}
                  // invalid={values.password && !isValid}
                //   invalid={!!(values.password && !isValidPass)} // Aquí usamos !! para convertir a booleano
                  required
                />
              </InputGroup>
            </div>

            <div className="mb-3">
            <Label htmlFor="detail" className="form-label">
                Nombre
              </Label>
              <InputGroup >
                <Input
                  onChange={handleChange}
                  type='text'
                  value={values.name || ''}
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="Nombre Apellido"
                //   valid={isValidPass}
                  // invalid={values.password && !isValid}
                //   invalid={!!(values.password && !isValidPass)} // Aquí usamos !! para convertir a booleano
                  required
                />
              </InputGroup>
            </div>

            <div className="mb-3">
            <Label htmlFor="detail" className="form-label">
                Direccion
              </Label>
              <InputGroup >
                <Input
                  onChange={handleChange}
                  type='text'
                  value={values.address || ''}
                  className="form-control"
                  id="address"
                  name="address"
                  placeholder="Solola, Solola"
                //   valid={isValidPass}
                  // invalid={values.password && !isValid}
                //   invalid={!!(values.password && !isValidPass)} // Aquí usamos !! para convertir a booleano
                  required
                />
              </InputGroup>
            </div>

            <div className="mb-3">
            <Label htmlFor="detail" className="form-label">
                Telefono
              </Label>
              <InputGroup >
                <Input
                  onChange={handleChange}
                  type='text'
                  value={values.phone || ''}
                  className="form-control"
                  id="phone"
                  name="phone"
                  placeholder="123412"
                //   valid={isValidPass}
                  // invalid={values.password && !isValid}
                //   invalid={!!(values.password && !isValidPass)} // Aquí usamos !! para convertir a booleano
                  required
                />
              </InputGroup>
            </div>
            

          <div className='d-flex justify-content-center p-2'>
          <Button color="danger" onClick={toggleModal}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onClick={(e) => onSubmit(e)}
            type="submit"
            className='mx-1'
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

export default ModalAddCustomer
