import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { Alert, Button, Card, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import { HiPencilAlt } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import dayjs from "dayjs";
import { FiEdit3 } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import Mg from '../../assets/images/LOGO.png'

import '../../styles/Compañias/tr.scss'
// import '../../styles/Compañias/tabla.scss'

function TableProviders(props) {
  const {
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


  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpenDetail, setModalOpen] = useState(false);


  const toggleModalsEL = () => {
    setModalOpen(!modalOpenDetail);
  };

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    toggleModalsEL();
  };

  return (
    
    
    <>
    <Modal isOpen={modalOpenDetail} toggle={toggleModalsEL} >
        <ModalHeader toggle={toggleModalsEL}>Detalles del Trabajador Proveedor</ModalHeader>
        <ModalBody>
          {selectedProduct && (
            <div>
              <Card>
              <div className='row' style={{display:'flex', alignItems:'center'}}>
                <div className='col-md-6 col-sm-12 d-flex justify-content-center align-items-center'>
                  <img src={Mg} alt="Logo" style={{ height: 'auto', width: '100%' }} />
                </div>
                <div className='col-md-6 col-sm-12'>
                  <p>
                    Trabajador: <b>{selectedProduct?.name ? selectedProduct.name : 'NA'}</b> <br />
                    NIT: <b>{selectedProduct?.nit ? selectedProduct.nit : 'NA'}</b> <br/>
                    Telefono: <b>{selectedProduct?.phone ? selectedProduct.phone : 'NA'}</b> <br />
                    Fecha de creacion: {selectedProduct?.createdAt ? selectedProduct.createdAt : 'NA'} <br />
                  </p>
                </div>
              </div>
              </Card>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={toggleModalsEL}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>  

    {isAuth && (
        <Table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Nombre</th>
            <th>Telefono</th>
            <th>NIT</th>
            <th>Categoria</th>
            <th>Accion</th>
          </tr>
        </thead>
       
        {isActive && (
          hasDataInRange  ? (
        <tbody>
          {filteredData.map((item, index) => (
            <tr id="dat-f" key={index} onClick={() => handleRowClick(item)}>
              <td>{startIndex + index + 1}</td>
              <td>{item?.name ? item.name : 'NA'}</td>
              <td>{item?.phone ? item.phone : 'NA'}</td>
              <td>{item?.nit ? item.nit : 'NA'}</td>
              <td>
                <p>
                  {item?.CategoryProvider ? (item.CategoryProvider.is_deleted ? item.CategoryProvider.name : `${item.CategoryProvider.name}-Desactivado`) : <i color='red'>Elimanado Permamente </i>}
                </p>
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
                      handleDelete(item?.id_provider ? item.id_provider : 0)
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
          .map((item, index) => (
            <tr id="dat-f" key={index} onClick={() => handleRowClick(item)}>
              <td>{index + 1}</td>
              <td>{item?.name ? item.name : 'NA'}</td>
              <td>{item?.phone ? item.phone : 'NA'}</td>
              <td>{item?.nit ? item.nit : 'NA'}</td>
              <td>
                <p>
                  {item?.CategoryProvider ? (item.CategoryProvider.is_deleted ? item.CategoryProvider.name : `${item.CategoryProvider.name}-Desactivado`) : <i color='red'>Elimanado Permamente </i>}
                </p>
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
                      handleDelete(item?.id_provider ? item.id_provider : 0)
                    }}
                  >
                    <AiFillDelete />
                  </Button>
              </td>
            </tr>
          ))}
        </tbody>

      )}
     
      </Table>
   
  
    )}
    </>


  
  );
  
}


export default TableProviders;
