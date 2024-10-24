import React, {useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Alert, Button, Card, Modal, ModalBody, ModalFooter, ModalHeader, Row,
    Col,
    Table,
    CardHeader,
    CardBody,
    CardImg,
    Container,
    Spinner,
    Tooltip
} from "reactstrap";
import { HiPencilAlt } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import dayjs from "dayjs";
import { FiEdit3 } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
// import '../../styles/Compañias/tabla.scss'

// import '../../styles/Compañias/tr.scss'
import '../../styles/Compañias/tr.scss'
import { FcPrint } from 'react-icons/fc';
import { BsPrinter } from 'react-icons/bs';
import { MdOutlineDownloading } from 'react-icons/md';
import { GrAscend, GrDescend } from 'react-icons/gr';
import { ImSortAmountDesc } from 'react-icons/im';


export const TablePurchase = (props) => {
  const URL = import.meta.env.VITE_URL_API;

    /*Realizar accion si caja esta abierta*/
    const [status, setStatus] = useState(null)

    useEffect(() => {
      fetch(`${URL}/api/status`, {
        credentials:'include'
      })
        .then((response) => response.json())
        .then((data) => {
          setStatus(data.status);
        })
        .catch((error) => {
          console.error(error);
        });
    }, [status]);
     /*fin */
     
    const {
        data,
        handleDelClick,
        handleEditClick,
        startIndex,
        isActive,
        hasDataInRange,
        filteredData,
        handlePdfClick
     
      } = props

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpenDetail, setModalOpen] = useState(false);
  
  
    const toggleModalsEL = () => {
      setModalOpen(!modalOpenDetail);
    };
  
    const handleRowClick = (product) => {
      setSelectedProduct(product);
      toggleModalsEL();
    };

    const [loading, setLoading] = useState(false);
    const handleGeneratePDF = () => {
      setLoading(true);
      const filename = 'invoice-' + selectedProduct.bill_number; // Nombre del archivo PDF
      const url = `${URL}/api/purchase/bill/${selectedProduct.id_shopping}/${filename}`;
      
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
        credentials: 'include',
        responseType: 'blob',
      })
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          // const pdfUrl = URL.createObjectURL(filename);
          const newWindow = window.open(url, '_blank');
          if (!newWindow) {
            throw new Error('No se pudo abrir el PDF en una pestaña nueva.');
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error:', error);
          setLoading(false);
        });
    };
    

    const [dataOrdenada, setDataOrdenada] = useState([]); // Datos ordenados
    const [ordenAscendente, setOrdenAscendente] = useState(true); // Estado para el orden
    const [tooltipOpen, setTooltipOpen] = useState(false); // Estado para el tooltip


    useEffect(() => {
      try {
        // Verifica si data no está vacío antes de clonarlo
      if (data.length > 0) {
        // Clona datos originales para mantenerlos sin alterar
        setDataOrdenada([...data]);
      } else {
        // Realiza alguna acción si data está vacío, por ejemplo, mostrar un mensaje de error o hacer algo más
        // console.log('Está vacío');
        // Puedes establecer dataOrdenada en un valor predeterminado o realizar alguna otra acción
        setDataOrdenada([]);
      }
      } catch (error) {
        console.log(error)
      }
    }, [data]);

    // Función para cambiar el orden al hacer clic en el botón
  const cambiarOrden = () => {
    // Cambia el estado de ordenAscendente
    setOrdenAscendente(!ordenAscendente);

    // Ordena de datos en función del campo 'createdAt' y el orden actual
    const datosOrdenados = [...dataOrdenada].sort((a, b) => {
      const valorA = a.createdAt;
      const valorB = b.createdAt;
      // console.log('val',valorA)

      if (ordenAscendente) {
        return new Date(valorA) - new Date(valorB);
      } else {
        return new Date(valorB) - new Date(valorA);
      }
    });

    // Actualiza el estado de los datos ordenados
    setDataOrdenada(datosOrdenados);
  };

    // Función para manejar la apertura/cierre del tooltip
    const toggleTooltip = () => {
      setTooltipOpen(!tooltipOpen);
    };



    return(
        <>
        <div>
        <Modal isOpen={modalOpenDetail} toggle={toggleModalsEL} size='lg'>
        <ModalHeader style={{
                display: 'flex',
                justifyContent: 'center', // Centrar horizontalmente
                alignItems: 'center', // Centrar verticalmente
            }} toggle={toggleModalsEL}>
            {/* <div > */}
        
              <img
                src=''
                alt="Logo"
                width="70"
                height="auto"
                style={{marginRight: '12px'}}
              />
                  Detalles de la Compra
            {/* </div> */}
        </ModalHeader>
        <ModalBody>
          {selectedProduct && (
            <>
 <Container>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className='d-flex' style={{alignItems:'center'}}><h5>Factura de Compra No. {selectedProduct.bill_number}</h5>
              <div className='col-8 d-flex justify-content-end'><strong>{selectedProduct.createdAt}</strong></div>
              </div>
              <div className='mt-3'>
              <p>Proveedor: <b>{selectedProduct?.Provider ? selectedProduct.Provider.name : 'NA'}</b></p>
              <p>Teléfono: <b>{selectedProduct?.Provider ? selectedProduct.Provider.phone : 'NA'}</b></p>
              <p>NIT: <b>{selectedProduct?.Provider ? selectedProduct.Provider.nit : 'NA'}</b></p>
              </div>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoria</th>
                    <th>Cantidad</th>
                    <th>Precio Compra</th>
                    <th>Precio Venta</th>
                    <th>Descuento</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProduct.DetailShoppings.map((detail) => (
                    <tr key={detail.id_details_shopping}>
                      <td>{detail?.Product ? detail.Product.name : 'N/A'}</td>
                      <td>{detail?.Product ? (detail.Product.category ? detail.Product.category.type : 'N/A') : 'No existe'}</td>
                      <td>{detail?.amount ? detail.amount : 0}</td>
                      <td>{detail?.purchase_price ? detail.purchase_price.toFixed(2) : 0 }</td>
                      <td>{detail?.sale_price ? detail.sale_price.toFixed(2) : 0 }</td>
                      <td>{detail?.discount.toFixed ? detail.discount.toFixed(2) : 0}</td>
                      <td>{detail.subtotal ? detail?.subtotal.toFixed(2) : 0}</td>
                    </tr>
                  ))}
                  <tr>
                    <th colSpan='6'><p style={{ fontSize: '1.2rem'}}>Total de Factura</p></th>
                    <th><span style={{ fontSize: '1.2rem'}}>{selectedProduct?.total ? selectedProduct.total.toFixed(2) : 0}</span></th>
                  </tr>
                </tbody>
              </Table>
              {/* <strong>Total de Factura: {selectedProduct?.total ? selectedProduct.total.toFixed(2) : 0}</strong> */}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
             
        
            

              

             
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={toggleModalsEL}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>  
        </div>
        <Table responsive>
              <thead>
                <tr>
                <th>
                <div className='d-flex align-items-end'>
               
                      No
                </div>
                </th>
                <th>Factura</th>
                <th>Proveedor</th>
                <th>Total</th>
                <th>Fecha</th>
                <th>Acción</th>
                </tr>
              </thead>

              <>
        {isActive && (
          hasDataInRange  ? (
        <tbody>
          { dataOrdenada.length > 0 ? (
          
          dataOrdenada.map((purchas, index) => (
            // const createdAt = new Date(usuario.createdAt);
            // if (createdAt >= startDate && createdAt <= endDate) {
            //   return (
                <tr id="dat-f" key={index} onClick={() => handleRowClick(purchas)}>
                <td>{startIndex + index + 1}</td>
                <td>{purchas?.bill_number ? purchas.bill_number : 0}</td>
                <td>{purchas?.Provider ? (purchas.Provider?.name ? purchas.Provider.name : 'NA') : 'NA'}</td>
                <td>{purchas?.total ? purchas.total : 'Null'}</td>
                {/* <td>{purchas.category ? (purchas.category.type ? product.category.type : <p style={{color:'red'}}>Sin Categoría</p>) : <p style={{color:'red'}}>Sin Categoría</p>}</td> */}

                <td>{purchas?.createdAt ? purchas.createdAt : 'NA'}</td>
                <td>
                  <Button
                  disabled={!status}
                    color="primary"
                    title="Editar"
                    style={{
                      cursor: 'pointer',
                      backgroundColor: 'transparent', // Quita el relleno
                      color: 'black',
                      border: 'none', // Quita el contorno
                      }}
                    onClick={(event) => {
                          handleEditClick(purchas.id_shopping);
                          event.stopPropagation();
                      }}
                  >
                    <FiEdit3 title="Editar" />
                  </Button>
                  <Button
                  disabled={!status}
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
                      handleDelClick(purchas?.id_shopping ? purchas.id_shopping : 0)
                    }}
                  >
                    <AiFillDelete />
                  </Button>
                  <Button 
                    title='Print' 
                    color="success" 
                    disabled={loading} 
                    style={{
                      marginRight:'12px',
                      cursor: 'pointer',
                      backgroundColor: 'transparent', // Quita el relleno
                      color: 'black',
                      border: 'none', // Quita el contorno
                      }}
                    // onClick={handleGeneratePDF}
                    onClick={(e) => {
                      e.stopPropagation();
                      // setModalOpen(false); // Cierra el modal de detalles
                      // handleGeneratePDF
                    }}
                    >
                  
                  {loading ? (
                    <>
                      <Spinner size="sm" 
                      color="success"
                      type="grow"
                      />
                      {/* <MdOutlineDownloading/> */}
                    </>
                  ) : (
                    <>
                      <BsPrinter />
                    </>
                  )}
                </Button>
                  </td> 
              </tr>
                
            //  )
            // }
            // return null;
          ))
          ): (
            <p>no hay datos</p>
          )
        }
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
          {dataOrdenada
          // .sort((a, b) => new Date(b.users.createdAt) - new Date(a.users.createdAt))
          .map((purchas, index) => (
            <tr id="dat-f" key={index} onClick={() => handleRowClick(purchas)}>
            <td>{startIndex + index + 1}</td>
            {/* <td>{purchas.bill_number}</td>
            <td>{purchas.Provider.SupplierCompany.name}</td>
            <td>{purchas.Provider.SupplierCompany.phone}</td>
            <td>{purchas.total}</td>
            <td>{purchas.createdAt}</td> */}

            <td>{purchas?.bill_number ? purchas.bill_number : 0}</td>
            <td>{purchas?.Provider ? (purchas.Provider?.name ? purchas.Provider.name : 'NA') : 'NA'}</td>
            <td>{purchas?.total ? purchas.total : 'Null'}</td>
            {/* <td>{purchas.category ? (purchas.category.type ? product.category.type : <p style={{color:'red'}}>Sin Categoría</p>) : <p style={{color:'red'}}>Sin Categoría</p>}</td> */}

            <td>{purchas?.createdAt ? purchas.createdAt : 'NA'}</td>
            <td>
                  <Button
                    disabled={!status}
                    color="primary"
                    title="Editar"
                    style={{
                      cursor: 'pointer',
                      backgroundColor: 'transparent', // Quita el relleno
                      color: 'black',
                      border: 'none', // Quita el contorno
                      }}
                    onClick={(event) => {
                          handleEditClick(purchas.id_shopping);
                          event.stopPropagation();
                      }}
                  >
                    <FiEdit3 title="Editar" />
                  </Button>
                  <Button
                    disabled={!status}
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
                      handleDelClick(purchas?.id_shopping ? purchas.id_shopping : 0)
                    }}
                  >
                    <AiFillDelete />
                  </Button>
                  <Button 
                    title='Print' 
                    color="success" 
                    disabled={loading} 
                    style={{
                      marginRight:'12px',
                      cursor: 'pointer',
                      backgroundColor: 'transparent', // Quita el relleno
                      color: 'black',
                      border: 'none', // Quita el contorno
                      }}
                    // onClick={handleGeneratePDF}
                    onClick={(e) => {
                      e.stopPropagation();
                      // setModalOpen(false); // Cierra el modal de detalles
                      // handleGeneratePDF
                    }}
                    >
                  
                  {loading ? (
                    <>
                      <Spinner size="sm" 
                      color="success"
                      type="grow"
                      />
                      {/* <MdOutlineDownloading/> */}
                    </>
                  ) : (
                    <>
                      <BsPrinter />
                    </>
                  )}
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