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
  Alert,
  Card
} from 'reactstrap'
import { FiEdit3 } from 'react-icons/fi'
import { AiFillDelete } from 'react-icons/ai'
import dayjs from "dayjs";
import Mg from '../../assets/images/LOGO.png'

import '../../styles/Compañias/tr.scss'

const TableCustomers = (props) => {
  const URL = import.meta.env.VITE_URL_API;
  const {
    data,
    // data1,
    // currentPage,
    // itemsPerPage,
    // status,
    // modalOpen,
    // toggleModal,
    handleDelete,
    // fetchUpdatedUsuarios,
    handleEditProvider,
    // startDate,
    startIndex,
    isActive,
    hasDataInRange,
    // handleShowAllData,
    filteredData,
 
  } = props
  // const { data, status  } = props;


  // const [startIndex, setStartIndex] = useState(0)
  // useEffect(() => {
  //   setStartIndex((currentPage - 1) * itemsPerPage)
  // }, [currentPage, itemsPerPage])

  

  const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpenDetail, setModalOpen] = useState(false);

  
    const toggleModalsEL = () => {
      setModalOpen(!modalOpenDetail);
    };
  
    const handleRowClick = (product) => {
      setSelectedProduct(product);
      toggleModalsEL();
    };




  

  

// Formato de fecha
const format = 'DD/MM/YYYY';
  
  return (
    <>
      <Modal isOpen={modalOpenDetail} toggle={toggleModalsEL} >
        <ModalHeader toggle={toggleModalsEL}>Detalles del Cliente</ModalHeader>
        <ModalBody>
          {selectedProduct && (
            <div>
              <Card>
                <div className='row'>
                  <div className='col-md-6 col-sm-12 d-flex justify-content-center align-items-center'>
                    <img src={Mg} alt="MG Comerciales" style={{ height: 'auto', width: '100%' }} />
                  </div>
                  <div className='col-md-6 col-sm-12'>
                    <p>
                      Cliente: <b>{selectedProduct.name}</b> <br />
                      NIT: <b>{selectedProduct.nit}</b> <br />
                      Direccion: <b>{selectedProduct.address}</b> <br />
                      Telefono: <b>{selectedProduct.phone}</b> <br />
                      Fecha de creacion: {selectedProduct.createdAt} <br />
                      Ultima Actualizacion: {selectedProduct.updatedAt}
                    </p>
                  </div>
                </div>

              </Card>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color='primary' outline onClick={toggleModalsEL}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>      

      <Table hover responsive>
        <thead>
          <tr>
            <th>No.</th>
            <th>NIT</th>
            <th>Nombre</th>
            <th>Direccion</th>
            <th>Telefono</th>
            <th>F Creacion</th>
            <th>Accion</th>
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
           
                <tr id="dat-f" key={index} onClick={() => handleRowClick(usuario)}>
                  <td>{startIndex + index + 1}</td>
                  <td>{usuario.nit}</td>
                  <td>{usuario.name}</td>
                  <td>{usuario.address}</td>
                  <td>{usuario.phone}</td>
                  {/* <td>{usuario.rol}</td> */}
                  <td>{(dayjs(usuario.createdAt).format(format))}</td>
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
                          handleEditProvider(usuario);
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
                      handleDelete(usuario?.id_customer ? usuario.id_customer : 0)
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
          // .sort((a, b) => new Date(b.users.createdAt) - new Date(a.users.createdAt))
          .map((usuario, index) => (
                <tr id="dat-f" key={index} onClick={() => handleRowClick(usuario)}>
                  <td>{startIndex + index + 1}</td>
                  <td>{usuario.nit}</td>
                  <td>{usuario.name}</td>
                  <td>{usuario.address}</td>
                  <td>{usuario.phone}</td>
                  {/* <td>{usuario.rol}</td> */}
                  <td>{(dayjs(usuario.createdAt).format(format))}</td>
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
                          handleEditProvider(usuario);
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
                      handleDelete(usuario?.id_customer ? usuario.id_customer : 0)
                    }}
                  >
                    <AiFillDelete />
                  </Button>
                  </td>   
                  {/* <td>
                    <div style={{ fontSize: '20px' }}>
                      <Button
                        color="danger"
                        outline
                        title="Eliminar"
                        // onClick={() => handleOpen(usuario.user_id)}
                        onClick={() => handleDelete(usuario.id_customer)}
                      >
                        <AiFillDelete />
                      </Button>
    
                      <Button
                        color="primary"
                        outline
                        title="Editar"
                        // onClick={() => handleEdit(usuario.users)}
                        // onClick={() => handleOpenEditModal(usuario)}
                        onClick={() => handleEditProvider(usuario)}
                      >
                        <FiEdit3 title="Editar" />
                      </Button>
                    </div>
                  </td> */}
                </tr>
           
           
          ))}
        </tbody>

      )}
          
        </>
      </Table>
    </>
  )
}

// const TableUsers = (props) => {
//   const { data, currentPage, itemsPerPage, status } = props;
//   const [startIndex, setStartIndex] = useState(0);

//   useEffect(() => {
//     setStartIndex((currentPage - 1) * itemsPerPage);
//   }, [currentPage, itemsPerPage]);

//   // const handleToggleStatus = async (userId, status, index) => {
//   //   try {
//   //     const response = await fetch(`${URL}/api/users/${userId}/controlestado`, {
//   //       method: 'PATCH',
//   //       credentials: 'include',
//   //       cache: 'no-cache'
//   //     });

//   //     if (response.ok) {
//   //       // No necesitamos actualizar el estado local aquí, ya que se actualizará a través de SSE
//   //     } else {
//   //       console.error('Error updating status:', response.statusText);
//   //     }
//   //   } catch (error) {
//   //     console.error('Error updating status:', error);
//   //   }
//   // };

//   return (
//     <Table>
//       <thead>
//         <tr>
//           <th>No.</th>
//           <th>Usuario</th>
//           <th>Rol</th>
//           <th>Fecha de creacion</th>
//           <th>Fecha de actualizacion</th>
//           <th>Estado</th>
//           <th>Acciones</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((usuario, index) => (
//           <tr key={index}>
//             <td>{startIndex + index + 1}</td>
//             <td>{usuario.users}</td>
//             <td>{usuario.rol}</td>
//             <td>{usuario.createdAt}</td>
//             <td>{usuario.updatedAt}</td>
//             <td>
//               <button
//                 onClick={() => handleToggleStatus(usuario.user_id, usuario.status, index)}
//                 style={{
//                   color: usuario.status ? 'white' : 'white',
//                   borderRadius: '10px',
//                   textAlign: 'center',
//                   background: usuario.status ? 'green' : 'red',
//                 }}
//                 // disabled={status === 'updating' && index === props.updatingIndex}
//               >
//                 {usuario.status ? 'Activo' : 'Inactivo'}
//               </button>
//             </td>
//             <td>
//               <i>Borrar</i> <i>Editar</i>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </Table>
//   );
// };

export default TableCustomers
