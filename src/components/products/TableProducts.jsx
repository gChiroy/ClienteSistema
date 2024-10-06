import React, { useState } from "react"
import { AiFillDelete } from "react-icons/ai"
import { FiEdit3 } from "react-icons/fi"
import { Alert, Button, Card, CardBody, CardImg, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from "reactstrap"
import '../../styles/Compañias/tr.scss'
import Mg from '../../assets/images/LOGO.png'



const TableProduct = (props)=>{

    // const { filteredProduct, handleComDelete, handleEditProvider } = props

    const {
      data,
      // data1,
      // currentPage,
      // itemsPerPage,
      // status,
      // modalOpen,
      // toggleModal,
      handleComDelete,
      // fetchUpdatedUsuarios,
      handleEditProvider,
      // startDate,
      startIndex,
      isActive,
      hasDataInRange,
      // handleShowAllData,
      filteredData,
   
    } = props

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

  
    const toggleModalsEL = () => {
      setModalOpen(!modalOpen);
    };
  
    const handleRowClick = (product) => {
      setSelectedProduct(product);
      toggleModalsEL();
    };

    

    return(

        <>
        <Modal isOpen={modalOpen} toggle={toggleModalsEL} >
        <ModalHeader toggle={toggleModalsEL}>Detalles del Producto</ModalHeader>
        <ModalBody>
          {selectedProduct && (
            <div>
                <Card>
                  <CardBody>
                    <Row>
                      <Col xs="12" sm="6" className="d-flex align-items-center justify-content-center">
                        <CardImg
                          top
                          src={selectedProduct.url_product}
                          alt="Logo"
                          style={{ height: 'auto', maxWidth: '100%' }}
                        />
                      </Col>
                      <Col xs="12" sm="6" className="d-flex align-items-center justify-content-center">
                        <p>
                          Producto: <b>{selectedProduct.name}</b> <br />
                          Detalle: <b>{selectedProduct.detail}</b> <br />
                          Categoria:{' '}
                          <b>
                            {selectedProduct.category && selectedProduct.category.type
                              ? selectedProduct.category.type
                              : 'Categoria Eliminado'}
                          </b>{' '}
                          <br />
                          Fecha de creacion: {selectedProduct.createdAt} <br />
                          {/* Ultima Actualizacion: {selectedProduct.updatedAt} */}
                        </p>
                      </Col>
                    </Row>
                  </CardBody>
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
        
  
        <Table
        responsive
        style={{
          // display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* <div style={{width: '100%', background:'red', padding:'10px'}}> */}
        <thead >
          <tr style={{width:'200rem'}}>
            <th>No.</th>
            <th>Imagen</th>
            <th>Codigo</th>
            <th>
              Producto <br /> -Detalles-
            </th>
            <th>Categoria</th>
            <th>Margen Ben</th>
            <th>Fecha</th>
            <th>Accion</th>
          </tr>
        </thead>
        {/* </div> */}

        <>
        {isActive && (
          hasDataInRange  ? (
        <tbody>
          {filteredData.map((product, index) => (
            // const createdAt = new Date(usuario.createdAt);
            // if (createdAt >= startDate && createdAt <= endDate) {
            //   return (
           
            <tr id="dat-f"  key={index} onClick={() => handleRowClick(product)}>
            <td>{startIndex + index + 1}</td>

            <td>
            {product.url_product ? (
                <Card style={{ width: '5rem' }}>
                  <img src={product.url_product} alt="Name Products" />
                </Card>
              ) : (
                <Card style={{ width: '5rem', background: 'pink' }}>
                  <span style={{ fontSize: '40px' }}>?</span>
                  {/* {product.name} */}
                </Card>
              )}
            </td>
            <td>{Math.round(product.profit_porc * 100)}</td>
            <td>
              <p>
                <b>{product.name}</b> <br /> {product.detail}
              </p>
            </td>
            {/* <td>{product.brand.name}</td> */}
         
            <td>
                {product.category && product.category.type
                    ? product.category.type
                    : 'Categoria Eliminado'}
            </td>

            <td>{product.profit_porc}%</td>
            <td>{product.createdAt}</td>
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
                          handleEditProvider(product);
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
                      handleComDelete(product?.id_product ? product.id_product : 0)
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
              <td colSpan="8"><Alert color='warning'>No se encontraron registros</Alert></td>
            </tr>
          </tbody>
        )
      )}
      {!isActive && (
        <tbody>
          {data
          // .sort((a, b) => new Date(b.users.createdAt) - new Date(a.users.createdAt))
          .map((product, index) => (
            <tr id="dat-f"  key={index} onClick={() => handleRowClick(product)}>
            <td>{startIndex + index + 1}</td>
            <td>
              {product.url_product ? (
                <Card style={{ width: '5rem' }}>
                  <img src={product.url_product} alt="Name Products" />
                </Card>
              ) : (
                <Card style={{ width: '5rem', background: 'pink' }}>
                  <span style={{ fontSize: '40px' }}>?</span>
                  {/* {product.name} */}
                </Card>
              )}
            </td>
            <td>{product.code_product}</td>
            <td>
              <p>
                <b>{product.name}</b> <br /> {product.detail}
              </p>
            </td>
            {/* <td>{product.brand.name}</td> */}
            {/* <td>{product.brand.map((brand, ind)=> (
            <span key={ind}>{brand.name}</span>
          ))}</td> */}
            <td>
            {product.category && product.category.type
                    ? product.category.type
                    : 'Categoria Eliminado'}
            </td>
            <td>{product.profit_porc}%</td>
            <td>{product.createdAt}</td>
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
                          handleEditProvider(product);
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
                      handleComDelete(product?.id_product ? product.id_product : 0)
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
        </>
      
    )

}

export default TableProduct;