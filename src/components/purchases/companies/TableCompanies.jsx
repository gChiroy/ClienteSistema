import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { Alert, Button, Card, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import { HiPencilAlt } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import dayjs from "dayjs";
import { FiEdit3 } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
// import '../../styles/Compañias/tabla.scss'
// import Mg from '../../assets/images/MG_LOGO.png'
import Mg from '../../../assets/images/LOGO.png'

// import '../../styles/Compañias/tr.scss'
import '../../../styles/Compañias/tr.scss'

function TableCompanies(props) {
  const URL = import.meta.env.VITE_URL_API;

  // const { filteredUsuarios, handleComDelete , companies , handleDelete, handleEditProvider, handleEditCompany } = props;

  const {
    update,
    data,
    handleDelete,
    handleEditProvider,
    startIndex,
    isActive,
    hasDataInRange,
    filteredData,
 
  } = props

  const { isAuth } = useSelector((state) => state.auth);
  const userRole = localStorage.getItem('userRole'); // Obtén el rol del localStorage
  const userName = localStorage.getItem('name'); // Obtén el rol del localStorage

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpenDetail, setModalOpen] = useState(false);


  const toggleModalsEL = () => {
    setModalOpen(!modalOpenDetail);
  };

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    toggleModalsEL();
  };

  const [switchState, setSwitchState] = useState(false); // Inicialmente desactivado


  // const handleDevolutionStatus = async (id) => {
  //   try {
  //     const response = await fetch(
  //       `${URL}/api/is_deleted/${id}`,
  //       {
  //         method: 'PATCH',
  //         credentials: 'include',
  //       },
  //     )
  
  //     if (response.ok) {    
  //       filteredData()
  //       setSwitchState(true);


  //     } else {
  //       console.error('Error updating status');
  //     }
  //   } catch (error) {
  //     console.error('Error updating status:', error);
  //   }
  // };
  useEffect(() => {
    if (selectedProduct) {
      setSwitchState(selectedProduct.is_deleted);
    }
  }, [selectedProduct]);

  const handleDevolutionStatus = async (id) => {
    try {
      const response = await fetch(`${URL}/api/is_deleted/${id}`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (response.ok) {
        // Cambia el estado del interruptor en la base de datos y luego en el estado local
        // await fetch(`${URL}/api/is_deleted/${id}`);
        setSwitchState(!switchState); // Cambia el estado local del interruptor
        update();
        // lteredData();
      } else {
        console.error('Error updating status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    
    <>

<Modal isOpen={modalOpenDetail} toggle={toggleModalsEL} >
        <ModalHeader toggle={toggleModalsEL}>Detalles de categoria</ModalHeader>
        <ModalBody>
          {selectedProduct && (
            <div>
              <Card>
              <div className='row' style={{display:'flex', alignItems:'center'}}>
              <div className='col-md-6 col-sm-12 d-flex justify-content-center align-items-center'>
              <img src={Mg} alt="MG Comerciales" style={{ height: 'auto', width: '100%' }} />
              </div>
              <div className='col-md-6 col-sm-12'>
              <p>Categoria: <b>{selectedProduct.name}</b> <br />
              Fecha de creacion: {selectedProduct.createdAt} <br />
              Ultima Actualizacion: {selectedProduct.updatedAt}
              
              </p>

              </div>
              </div>


              <div className='mt-3' style={{display:'flex', justifyContent:'center'}}>
                  <Form>
                    <FormGroup switch>
                      <Input
                        type="switch"
                        role="switch"
                        checked={switchState} // Establece el estado del interruptor
                        onClick={() => handleDevolutionStatus(selectedProduct.id_category_providers)} // Maneja el cambio de estado
                      />
                      <Label check>{switchState ? 'Activo' : 'Desactivo'}</Label>
                    </FormGroup>
                  </Form>
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

    {isAuth && (
      <div>
      {/* <ModalRegistCompany update={getComanies}/> */}
      <Table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Nombre Categoria</th>
            <th>Estado</th>
            <th>Accion</th>
        
          </tr>
        </thead>
        <>
        {isActive && (
          hasDataInRange  ? (
        <tbody>
          {filteredData.map((item, index) => (
            // const createdAt = new Date(usuario.createdAt);
            // if (createdAt >= startDate && createdAt <= endDate) {
            //   return (
           
                <tr id="dat-f" key={index} onClick={() => handleRowClick(item)}>
                <td>{startIndex + index + 1}</td>
                <td>{item.name}</td>
                <td>
                  <strong >
                    {item.is_deleted ? 'Activo' : 'Desactivo'}
                  </strong>
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
                          handleEditProvider(item);
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
                      handleDelete(item?.id_category_providers ? item.id_category_providers : 0)
                    }}
                  >
                    <AiFillDelete />
                  </Button>
              </td>
                
                </tr>
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
          .map((item, index) => (
                <tr id="dat-f" key={index} onClick={() => handleRowClick(item)}>
                <td>{startIndex + index + 1}</td>
                <td>{item.name}</td>
                <td>
                  <strong >
                    {item.is_deleted ? 'Activo' : 'Desactivo'}
                  </strong>
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
                          handleEditProvider(item);
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
                      handleDelete(item?.id_category_providers ? item.id_category_providers : 0)
                    }}
                  >
                    <AiFillDelete />
                  </Button>
              </td>
                {/* <td>{item.SupplierCompany.name}</td> */}            
                </tr>
           
           
          ))}
        </tbody>

      )}
        </>
      </Table>
  </div>
    )}
    </>
  );
  
}


export default TableCompanies;


