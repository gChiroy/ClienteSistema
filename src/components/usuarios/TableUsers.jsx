import React, { useState, useEffect } from 'react'
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
  Alert
} from 'reactstrap'
import { FiEdit3 } from 'react-icons/fi'
import { AiFillDelete } from 'react-icons/ai'
import ModalDel1 from './ModalDelete'
import Swal from 'sweetalert'
import { ModalEditUsers } from './ModalEditUsers'
import dayjs from "dayjs";
// import Swal from 'sweetalert'

const TableUsers = (props) => {
  const URL = import.meta.env.VITE_URL_API;
  const {
    data,
    data1,
    currentPage,
    itemsPerPage,
    status,
    modalOpen,
    toggleModal,
    handleDelete,
    handleDeleteConfirmed,
    fetchUpdatedUsuarios,
    startDate,
    startIndex,
    isActive,
    hasDataInRange,
    handleShowAllData,
    filteredData,
 
  } = props
  // const { data, status  } = props;


  // const [startIndex, setStartIndex] = useState(0)
  // useEffect(() => {
  //   setStartIndex((currentPage - 1) * itemsPerPage)
  // }, [currentPage, itemsPerPage])



  const [modal, setModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [editedUser, setEditedUser] = useState({});

  const toggleModal1 = () => setModal(!modal);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditedUser({ ...user });
    toggleModal1();
  };




  const handleSave = async () => {
    try {
      const response = await fetch(`${URL}/api/useredit/${selectedUser.user_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        user: editedUser.users,
        password: editedUser.password,
        rol: editedUser.rol,
      }),
    });

    if (response.ok) {
      toggleModal1();
      fetchUpdatedUsuarios();

      // Swal({
      //   title: 'Registro editado correctamente',
      //   type: 'success',
      // });
      
      swal({
        title: "Salio todo bien",
        text: "Registro editado correctamente!",
        icon: "success",
        // button: "Esta bien!",
        showConfirmButton: false,
        timer: 2000,
      });
      // "Good job!", "You clicked the button!", "success");
   
    } else {
      console.error('Error:', response.statusText);
      Swal({
        title: 'Registro editado correctamente',
        text: "Hubo un problema!",
        icon: "warning",
        button: "Esta bien!",
        
      });
    }
      
    } catch (error) {
      swal({
        title: "Sin exito",
        text: "Hubo un problema!",
        icon: "warning",
        // button: "Esta bien!",
        showConfirmButton: false,
        timer: 2000,
      });
      
    }
    }
  

  

// Formato de fecha
const format = 'DD/MM/YYYY';
  
  return (
    <>
      {/* <ModalDel1/> */}

      {/* INICIO MODAL ELIMINAR */}

      <ModalDel1
        toggleModal={toggleModal}
        modalOpen={modalOpen}
        handleDeleteConfirmed={handleDeleteConfirmed}
      />
      {/* FIN ELIMINAR USUARIO */} 
      

      <Table hover responsive>
        <thead>
          <tr>
            <th>No.</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Fecha de creacion</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <>
        {isActive && (
          hasDataInRange  ? (
        <tbody>
          {filteredData.map((usuario, index) => (
            // const createdAt = new Date(usuario.createdAt);
            // if (createdAt >= startDate && createdAt <= endDate) {
            //   return (
           
                <tr key={index}>
                  <td>{startIndex + index + 1}</td>
                  <td>{usuario.users}</td>
                  <td>{usuario.rol}</td>
                  <td>{(dayjs(usuario.createdAt).format(format))}</td>
                  <td>
                    <Button
                    outline
                      onClick={() => status(usuario.user_id, usuario.status, index)} //actualizar estado para bloquear o desbloquear
                      // disabled={updatingIndex === index} // Deshabilitar el botón mientras se actualiza
                      style={{
                        color: usuario.status ? 'green' : 'red',
                        // borderRadius: '10px',
                        // border: "1px solid",
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: 'transparent', // Quita el relleno
                        // color: 'black',
                        border: 'none', // Quita el contorno
                        // background: usuario.status ? 'green' : 'red',
                      }}
                    >
                      {usuario.status ? 'Activo' : 'Inactivo'}
                    </Button>
                  </td>
                  <td>
                  <Button
                    color="primary"
                    title="Editar"
                    style={{
                      cursor: 'pointer',
                      backgroundColor: 'transparent', // Quita el relleno
                      color: 'black',
                      border: 'none', // Quita el contorno
                      }}
                    onClick={(event) => {
                          handleEdit(usuario);
                          event.stopPropagation();
                      }}
                  >
                    <FiEdit3 title="Editar" />
                  </Button>
                  <Button
                    color="danger"
                    title="Eliminar"
                    style={{
                      marginRight:'12px',
                      cursor: 'pointer',
                      backgroundColor: 'transparent', // Quita el relleno
                      color: 'black',
                      border: 'none', // Quita el contorno
                      }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // setModalOpen(false); // Cierra el modal de detalles
                      handleDelete(usuario?.user_id ? usuario.user_id : 0)
                    }}
                  >
                    <AiFillDelete />
                  </Button>
                  </td> 
                </tr>
            //  )
            // }
            // return null;
          ))}
        </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan="7"><Alert color='warning'>No se encontraron registros</Alert></td>
            </tr>
          </tbody>
        )
      )}
      {!isActive && (
        <tbody>
          {data
          .sort((a, b) => new Date(b.users.createdAt) - new Date(a.users.createdAt))
          .map((usuario, index) => (
                <tr key={index}>
                  <td>{startIndex + index + 1}</td>
                  <td>{usuario.users}</td>
                  <td>{usuario.rol}</td>
                  <td>{(dayjs(usuario.createdAt).format(format))}</td>

                  <td>
                    <Button
                    outline
                      onClick={() => status(usuario.user_id, usuario.status, index)} //actualizar estado para bloquear o desbloquear
                      // disabled={updatingIndex === index} // Deshabilitar el botón mientras se actualiza
                      style={{
                        color: usuario.status ? 'green' : 'red',
                        // borderRadius: '10px',
                        // border: "1px solid",
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: 'transparent', // Quita el relleno
                        // color: 'black',
                        border: 'none', // Quita el contorno
                        // background: usuario.status ? 'green' : 'red',
                      }}
                    >
                      {usuario.status ? 'Activo' : 'Inactivo'}
                    </Button>
                  </td>
                  
                  <td>
                  <Button
                    color="primary"
                    title="Editar"
                    style={{
                      cursor: 'pointer',
                      backgroundColor: 'transparent', // Quita el relleno
                      color: 'black',
                      border: 'none', // Quita el contorno
                      }}
                    onClick={(event) => {
                          handleEdit(usuario);
                          event.stopPropagation();
                      }}
                  >
                    <FiEdit3 title="Editar" />
                  </Button>
                  <Button
                    color="danger"
                    title="Eliminar"
                    style={{
                      marginRight:'12px',
                      cursor: 'pointer',
                      backgroundColor: 'transparent', // Quita el relleno
                      color: 'black',
                      border: 'none', // Quita el contorno
                      }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // setModalOpen(false); // Cierra el modal de detalles
                      handleDelete(usuario?.user_id ? usuario.user_id : 0)
                    }}
                  >
                    <AiFillDelete />
                  </Button>
                  </td> 
                </tr>
           
           
          ))}
        </tbody>

      )}
          
        </>
      </Table>


      <ModalEditUsers
      modal={modal}
      toggleModalEdit={toggleModal1}
      handleSave={handleSave}
      editedUser={editedUser}
      setEditedUser={setEditedUser}
      />





    

    </>
  )
}

export default TableUsers
