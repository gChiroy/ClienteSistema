import React, { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { FaUserEdit } from 'react-icons/fa'

export const ModalEditUsers = (props) => {
  const {
    modal,
    toggleModalEdit,
    handleSave,
    editedUser,
    setEditedUser,
  } = props
  const [showPassword, setShowPassword] = useState(false)
  // const [isValid, setIsValid] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }


  return (
    <>
      <Modal isOpen={modal} toggle={toggleModalEdit} centered={true}>
        <ModalHeader toggle={toggleModalEdit}>
          {' '}
          <FaUserEdit size={30} /> Editar usuario
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="users">Usuario</Label>
              <Input
                type="text"
                name="users"
                id="users"
                value={editedUser.users}
                onChange={(e) =>
                  setEditedUser((prevUser) => ({
                    ...prevUser,
                    users: e.target.value,
                  }))
                }
              />
            </FormGroup>

            <FormGroup>
              <Label for="password">Nueva Contraseña</Label>
              <div className='d-flex'>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                // value={editedUser.password}
                onChange={(e) =>
                  setEditedUser((prevUser) => ({
                    ...prevUser,
                    password: e.target.value,
                  }))
                }
              />
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
              </div>
          
    
            </FormGroup>

            <FormGroup>
              <Label for="rol">Rol</Label>
              <Input
                type="select"
                id="rol"
                name="rol"
                value={editedUser.rol}
                onChange={(e) =>
                  setEditedUser((prevUser) => ({
                    ...prevUser,
                    rol: e.target.value,
                  }))
                }
              >
                <option>Selecciona</option>
                <option value="admin">Administrador</option>
                <option value="empleado">Empleado</option>
              </Input>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSave}>
            Guardar cambios
          </Button>
          <Button color="secondary" onClick={toggleModalEdit}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
