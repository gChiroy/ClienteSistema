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

const ModalRegistProviders = ( props) => {
  const URL = import.meta.env.VITE_URL_API;
  const { update, updCompanies } = props

  const [modalOpen, setmodalOpen] = useState(false)
  const toggleModal = () => setmodalOpen(!modalOpen)

  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  // const [isValid, setIsValid] = useState(false);

  // const handleTogglePassword = () => {
  //   setShowPassword(!showPassword)
  // }

  const [values, setValues] = useState({
    name: '',
    phone: '',
    nit: '',
    category_providers_id_supplier_company: '',
  })

  const [companies, setCompanies] = useState([])

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)


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
        // updCompanies()
        // setLoading(false)
      } catch (error) {
        console.log(error)
      } finally{
        setLoading(false)
      }
    }


  useEffect(() => {
    // Realiza una solicitud inicial al cargar la página
    fetchCompanies();
    // Configura una solicitud periódica cada X segundos (por ejemplo, cada 10 segundos)
    const pollingInterval = setInterval(() => {
      fetchCompanies();
    }, 5000); // Intervalo de 10 segundos

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(pollingInterval);
  }, []);

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

  const isValidPass =
    values.phone.length === 8 &&
    /\d/.test(values.phone) // al menos un dígito numérico

  const PassValidacion =
    'El telefono es obligatorio'



  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`${URL}/api/provider`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          nit: values.nit,
          category_providers_id_supplier_company: values.category_providers_id_supplier_company,
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setValues({ name: '', phone: '', nit: '', category_providers_id_supplier_company: '' })
        updCompanies()
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
            Registrar proveedor
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
          <AiOutlineUserAdd size={30} /> Ingresar nuevo proveedor
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}  className="container mt-3">
            <div className="mb-3">
              <Label htmlFor="name" className="form-label">
                Nombre proveedor
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
                  placeholder="Proveedor"
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
            <div className="mb-3">
              <Label htmlFor="telefono" className="form-label">
                Telefono
              </Label>
              <InputGroup>
                <Input
                  // onChange={(e) => onChange(e)}
                  onChange={handleChange}
                  type='text'
                  // type={showPassword ? 'text' : 'password'}
                  value={values.phone}
                  // className="form-control"
                  // id="phone"
                  name="phone"
                  placeholder="Telefono"
                  valid={isValidPass}
                  // invalid={values.password && !isValid}
                  invalid={!!(values.phone && !isValidPass)} // Aquí usamos !! para convertir a booleano
                  required
                />
                {values.phone && !isValidPass && (
                  <div className="invalid-feedback">{PassValidacion}</div>
                )}

                {/* <div className="input-group-append">
                  <Button
                    onClick={handleTogglePassword}
                    style={{ cursor: 'pointer' }}
                  >
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </Button>
                </div> */}
              </InputGroup>
            </div>

            <div className="mb-3">
              <Label htmlFor="nit" className="form-label">
                Nit
              </Label>
              <InputGroup>
                <Input
                  // onChange={(e) => onChange(e)}
                  onChange={handleChange}
                  type="text"
                  // className="form-control"
                  // id="nit"
                  name="nit"
                  value={values.nit}
                  placeholder="Nit"
                  // valid={isValidUs}
                  // invalid={values.password && !isValid}
                  // invalid={!!(values.users && !isValidUs)} // Aquí usamos !! para convertir a booleano
                  // required
                />

                {/* {values.users && !isValidUs && (
          <div className="invalid-feedback">
            {UsuValidacion}
          </div>
        )} */}
              </InputGroup>
            </div>

            <div className="mb-3">
              <Label htmlFor="campañia" className="form-label">
                Categoria
              </Label>
              <Input
                bsSize="sm"
                className="mb-3"
                type="select"
                name="category_providers_id_supplier_company"
                value={values.category_providers_id_supplier_company || ''}
                onChange={handleChange}
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
            {/* <div style={{color:'red', margin:'10px 0'}}>{error}</div>
          <div style={{color:'green', margin:'10px 0'}}>{success}</div> */}
          <div className='d-flex justify-content-center p-2'>
          <Button className='mx-1' color="danger" onClick={toggleModal}>
            Cancelar
          </Button>
          <Button
            color="success"
            type="submit"
            disabled={!isValidPass || !isValidUs || !values.category_providers_id_supplier_company}
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

export default ModalRegistProviders
