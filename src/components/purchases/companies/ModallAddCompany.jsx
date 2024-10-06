import React, { useEffect, useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import {
  InputGroup,
  InputGroupText,
  Form,
  Label,
  Input,
  Button,
} from 'reactstrap'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { IoIosAddCircle } from 'react-icons/io'
import swal from 'sweetalert'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModalRegistCompany = ( props) => {
  const URL = import.meta.env.VITE_URL_API;
  const { update } = props

  const [modalOpen, setmodalOpen] = useState(false)
  const toggleModal = () => setmodalOpen(!modalOpen)



  const [values, setValues] = useState({
    name: ''

  })

  const [companies, setCompanies] = useState([])

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // setLoading(true)
    const  fetchCompanies = async () => {
      try {
        const response = await fetch(`${URL}/api/allCompanies`,{
          credentials:'include'
        })

        if (!response.ok) {
          throw new Error('No se pueden listar las categria')
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: value,
    })
    // setIsValid(newPassword.length >= 9 && newPassword.length <= 15);
  }

  const isValidUs =
    /[A-Z]/.test(values.name) && // al menos una mayúscula
    /[a-z]/.test(values.name) // al menos una minúscula // al menos un dígito numérico

  const UsuValidacion = 'El nombre es obligatorio'




  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`${URL}/api/campany`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: values.name
        }),
      })

      const data = await response.json()
      // if (!response.ok) {
      //   const errorData = await response.json()
      //   // setSuccess(data.message)
      //   throw new Error(errorData.message)
      // }
      if (response.ok) {
        // setError('')
        // setSuccess(data.message)
        setValues({ name: '', address: '', phone: '' })
        toggleModal()
        update()
  
         toast.success(`Se registró correctamente: ${values.name}`, {
          // position: 'bottom-center',
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

      } else {
        // setSuccess(data.message)
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
        // throw new Error(errorData.message)
      }
     
       
  } catch (error) {
      console.log(error)
      toast.error(`No se inserto correctamente: ${values.name}`, {
        // position: 'bottom-center',
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
    }
  }

  if (loading) {
    return (
      <div>
        <h1>Cargando...</h1>
      </div>
    )
  }

  
  
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
            Registrar Categoria Proveedores
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
          <AiOutlineUserAdd size={30} /> Ingresar nueva categorias
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}  className="container mt-3">
            <div className="mb-3">
              <Label htmlFor="name" className="form-label">
                Nombre categoria
              </Label>
              <InputGroup>
                <Input
                  // onChange={(e) => onChange(e)}
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  // id="name"
                  name="name"
                  value={values.name}
                  placeholder="categoria"
                  valid={isValidUs}
                  // invalid={values.password && !isValid}
                  invalid={!!(values.name && !isValidUs)} // Aquí usamos !! para convertir a booleano
                  required
                />

                {values.name && !isValidUs && (
          <div className="invalid-feedback">
            {UsuValidacion}
          </div>
        )}
              </InputGroup>
            </div>
           

            {/* <div style={{color:'red', margin:'10px 0'}}>{error}</div>
          <div style={{color:'green', margin:'10px 0'}}>{success}</div> */}
          <div className='d-flex justify-content-center p-2'>
          <Button color="danger" className='mx-1' onClick={toggleModal}>
            Cancelar
          </Button>
          <Button
          
            color="success"
            // onClick={(e) => handleSubmit(e)}
            // onClick={handleSubmit(e)}
            // onClick={(e) => handleSubmit(e)}
            type="submit"
            disabled={!isValidUs}
          >
            Registrar
          </Button>
          </div>
          </Form>
        </ModalBody>
        
      </Modal>
      <ToastContainer/>

    </>
  )
}

export default ModalRegistCompany
