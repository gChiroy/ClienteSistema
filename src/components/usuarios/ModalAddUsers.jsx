import React, { useState } from 'react'
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
import { ToastContainer, toast } from 'react-toastify';
import swal from 'sweetalert'
import { AiOutlineUserAdd } from 'react-icons/ai'

const ModalRegisterUsers = (props) => {
  const URL = import.meta.env.VITE_URL_API;

  const { fetchUpdatedUsuarios } = props

  const [modalOpen, setmodalOpen] = useState(false)
  const toggleModal = () => setmodalOpen(!modalOpen)

  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  // const [isValid, setIsValid] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  const [values, setValues] = useState({
    users: '',
    password: '',
    rol: '',
  })
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const onChange = (e) => {
    const newPassword = e.target.value
    setValues({ ...values, [e.target.name]: newPassword })
    // setIsValid(newPassword.length >= 9 && newPassword.length <= 15);
  }

  const isValidUs =
    // /[A-Z]/.test(values.users) && // al menos una mayúscula
    /[a-z]/.test(values.users) && /\d/.test(values.users) // al menos una minúscula // al menos un dígito numérico

  const UsuValidacion = 'El nombre de usuario debe tener' + ' letras y numeros'

  const isValidPass =
    values.password.length >= 6 &&
    values.password.length <= 15 &&
    /[A-Z]/.test(values.password) && // al menos una mayúscula
    /[a-z]/.test(values.password) && // al menos una minúscula
    /\d/.test(values.password) // al menos un dígito numérico

  const PassValidacion =
    'La contraseña debe tener entre 6 y 15 caracteres' +
    ' y contener al menos una letra mayúscula, una letra minúscula ' +
    'y un dígito numérico'

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(values),
      })

      const data = await res.json()
      // console.log(data)
      if (res.ok) {
        setError('')
        setSuccess(data.message)
        setValues({ users: '', password: '', rol: '' })
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
      // Cierra el modal y llama a la función de éxito del componente padre
      toggleModal()
      fetchUpdatedUsuarios()
    } catch (error) {
      console.log(error)
      toast.error(`Algo salio mal: ${error.message}`, {
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
            Registrar usuario
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
          <AiOutlineUserAdd size={30} /> Ingresar nuevo usuario
        </ModalHeader>
        <ModalBody>
          <Form className="container mt-3">
            <div className="mb-3">
              <Label htmlFor="user" className="form-label">
                Usuario
              </Label>
              <InputGroup>
                <Input
                  onChange={(e) => onChange(e)}
                  type="text"
                  className="form-control"
                  id="users"
                  name="users"
                  value={values.users}
                  placeholder="Ejemplo123"
                  valid={isValidUs}
                  // invalid={values.password && !isValid}
                  invalid={!!(values.users && !isValidUs)} // Aquí usamos !! para convertir a booleano
                  required
                />

                {values.users && !isValidUs && (
                  <div className="invalid-feedback">{UsuValidacion}</div>
                )}
              </InputGroup>
            </div>
            <div className="mb-3">
              <Label htmlFor="password" className="form-label">
                Contraseña
              </Label>
              <InputGroup>
                <Input
                  onChange={(e) => onChange(e)}
                  // type='password'
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="contraseña"
                  valid={isValidPass}
                  // invalid={values.password && !isValid}
                  invalid={!!(values.password && !isValidPass)} // Aquí usamos !! para convertir a booleano
                  required
                />
                {values.password && !isValidPass && (
                  <div className="invalid-feedback">{PassValidacion}</div>
                )}

                <div className="input-group-append">
                  <Button
                    onClick={handleTogglePassword}
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: 'transparent', // Quita el relleno
                      color: 'black',
                      border: 'none', // Quita el contorno
                    }}
                  >
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </Button>
                </div>
              </InputGroup>
            </div>

            <div className="mb-3">
              <Label htmlFor="rol" className="form-label">
                Rol
              </Label>
              <Input
                bsSize="sm"
                className="mb-3"
                type="select"
                id="rol"
                name="rol"
                value={values.rol}
                onChange={(e) => onChange(e)}
              >
                <option>Selecciona</option>
                <option value="admin">Administrador</option>
                <option value="empleado">Empleado</option>
              </Input>
            </div>
            {/* <div style={{color:'red', margin:'10px 0'}}>{error}</div>
          <div style={{color:'green', margin:'10px 0'}}>{success}</div> */}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={toggleModal}>
            Cancelar
          </Button>
          <Button
            color="primary"
            onClick={(e) => onSubmit(e)}
            type="submit"
            disabled={!isValidPass || !isValidUs}
          >
            Registrar
          </Button>
        </ModalFooter>
      </Modal>
      <ToastContainer/>
    </>
  )
}

export default ModalRegisterUsers
