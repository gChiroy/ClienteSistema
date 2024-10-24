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

import { FcPrint } from 'react-icons/fc';
import { BsPrinter } from 'react-icons/bs';
import { MdOutlineDownloading } from 'react-icons/md';

import { GrAscend, GrDescend } from 'react-icons/gr'
import { ImSortAmountDesc } from 'react-icons/im'


export const TableSale = (props) => {
  const URL = import.meta.env.VITE_URL_API;
  /*Realizar accion si caja esta abierta*/
  const [status, setStatus] = useState(null)

  useEffect(() => {
    fetch(`${URL}/api/status`,{
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

      const { isAuth } = useSelector((state) => state.auth);
      const userRole = localStorage.getItem('userRole'); // Obtén el rol del localStorage
    

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpenDetail, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false)
  
  
    const toggleModalsEL = () => {
      setModalOpen(!modalOpenDetail);
    };
  
    const handleRowClick = (product) => {
      setSelectedProduct(product);
      toggleModalsEL();
    };
    

    const handleGeneratePDF = () => {
      setLoading(true);
      // const filename = 'invoice-' + selectedProduct.bill_number; // Nombre del archivo PDF
      const url = `${URL}/api/proforma/${selectedProduct.id_sales}`;
      
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

    // useEffect(() => {
    //   // Clona datos originales para mantenerlos sin alterar
    //   setDataOrdenada([...data]);
    // }, [data]);
    useEffect(() => {
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

                <img
                  src=''
                  alt="Logo"
                  width="70"
                  height="auto"
                  style={{marginRight: '12px'}}
                />
                    Detalles de la venta
          </ModalHeader>
          <ModalBody>
            {selectedProduct && (
              <>
          <Container>
          <Row>
          <Col>
            <Card>
              <CardBody>
                <div className="row">
                  <div className="col-6 d-flex justify-content-start">
                  <h5>Factura {selectedProduct.bill_number}</h5>
                  </div>
                  <div className="col-6 d-flex justify-content-end">
                  <strong>{selectedProduct.createdAt.split(' ')[0]}</strong>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                  <p>Cliente: <b>{selectedProduct?.Customer ? selectedProduct.Customer.name : 'NI'}</b></p>
                  <p>Teléfono: <b>{selectedProduct?.Customer ? selectedProduct.Customer.phone : 'NI'}</b></p>
                  </div>
                  <div className="col-6">
                  <p>NIT: <b>{selectedProduct?.Customer ? selectedProduct.Customer.nit : 'NI'}</b></p>
                  </div>
                </div>
                
                <Table responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio Unitario</th>
                      <th>Descuento</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProduct.DetailSales.map((detail, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{detail.inventory_product?.Product ? (detail.inventory_product.Product.name ? detail.inventory_product.Product.name : 'N/A') : 'N/A'}</td>
                        <td>{detail?.amount ? detail.amount : 0}</td>
                        <td>{detail?.price_inv_prod ? detail.price_inv_prod.toFixed(2) : 0}</td>
                        <td>{detail?.discount ? detail.discount.toFixed(2) : 0}</td>
                        <td>{detail?.subtotal ? detail.subtotal.toFixed(2) : 0}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={5}><b>Total sin importe</b></td>
                      <td><b>Q {selectedProduct?.total_no_tax ? selectedProduct.total_no_tax.toFixed(2) : 0}</b></td>
                    </tr>
                    <tr>
                      <td colSpan={5}><b>IVA</b></td>
                      <td ><b>{selectedProduct?.tax ? selectedProduct.tax : 0}%</b></td>
                    </tr>
                    <tr>
                      <td colSpan={5}><b>total_no_tax</b></td>
                      <td><b>Q {selectedProduct?.total ? selectedProduct.total : 0}</b></td>
                    </tr>
                  </tbody>
                </Table>
                <div>
              

                </div>
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
       {/* {ordenAscendente.length > 0 ? ( */}
        {/* <> */}
        <Table responsive className='custom-table'>
        <thead>
          <tr>
          <th>
                No
          </th>
          <th>Factura</th>
          <th>NIT</th>
          <th>Nombre</th>
          <th>Total</th>
          <th>F Creacion</th>
          <th>Acciones</th>
          {/* <th>F. Actualizacion</th> */}
          </tr>
        </thead>
        <>
          {isActive && (
          hasDataInRange  ? (
        <tbody>
          {data.length > 0 ? (
          
          dataOrdenada.map((sale, index) => (
        // const createdAt = new Date(usuario.createdAt);
        // if (createdAt >= startDate && createdAt <= endDate) {
        //   return (
            <tr id="dat-f" key={index} onClick={() => handleRowClick(sale)}>
            <td>{startIndex + index + 1}</td>
            <td>{sale.bill_number ? sale.bill_number : 'NI'}</td>
            <td>{sale?.Customer ? sale.Customer.nit : 'NI'}</td>
            <td>{sale?.Customer? sale.Customer.name : 'NI'}</td>
            <td>{sale?.tax ? sale.total.toFixed(2) : 0}</td>
            {/* <td>{Math.round(sale.tax * 100)}%</td> */}
            <td>{sale?.createdAt ? sale.createdAt.split(' ')[0] : 'NI'}</td>
            <td>
            <Button
                      disabled={!status}
                      color="primary"
                      outline
                      title="Editar"
                      style={{
                        cursor: 'pointer',
                        backgroundColor: 'transparent', // Quita el relleno
                        color: 'black',
                        border: 'none', // Quita el contorno
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(sale.id_sales)
                        }}
                        


                    >
                      <FiEdit3 title="Editar" />
                    </Button>
                       <Button
                       disabled={!status}
                       color="danger"
                       outline
                       title="Eliminar"
                       style={{
                        cursor: 'pointer',
                        backgroundColor: 'transparent', // Quita el relleno
                        color: 'black',
                        border: 'none', // Quita el contorno
                        }}
                       // onClick={() => handleOpen(usuario.user_id)}
                       onClick={(e) => {
                           handleDelClick(sale.id_sales)
                           e.stopPropagation();
                       }}
                       // handleDelete(user_id)
                     >
                       <AiFillDelete />
                     </Button>

                     <Button 
                  title='Print' 
                  outline 
                  color="success" 
                  disabled={loading} 
                  onClick={(e) => {
                    e.stopPropagation();
                    // setModalOpen(false); // Cierra el modal de detalles
                  }}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: 'transparent', // Quita el relleno
                    color: 'black',
                    border: 'none', // Quita el contorno
                    }}
                  >
                    <BsPrinter />
              </Button>
                  
            </td>
            {/* <td>{sale.updatedAt}</td> */}

          </tr>
            
        //  )
        // }
        // return null;
      ))

      ): (
        <tr><td><Alert color='danger'>No hay datos</Alert></td></tr>
        // <div><Alert><p>No hay datos</p></Alert></div>
      )
      }
        </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan="9"><Alert color='warning'>No se encontraron registros</Alert></td>
            </tr>
          </tbody>
        )
      )}
      {!isActive && (
        <tbody>
          {data.length > 0 ? (
          
          dataOrdenada.map((sale, index) => (
        // const createdAt = new Date(usuario.createdAt);
        // if (createdAt >= startDate && createdAt <= endDate) {
        //   return (
            <tr id="dat-f" key={index} onClick={() => handleRowClick(sale)}>
            <td>{startIndex + index + 1}</td>
           

            <td>{sale.bill_number ? sale.bill_number : 'NI'}</td>
            <td>{sale?.Customer ? sale.Customer.nit : 'NI'}</td>
            <td>{sale?.Customer? sale.Customer.name : 'NI'}</td>
            <td>{sale?.total ? sale.total.toFixed(2) : 0}</td>
            {/* <td>{Math.round(sale.tax * 100)}%</td> */}
            <td>{sale?.createdAt ? sale.createdAt.split(' ')[0] : 'NI'}</td>
            <td>
            <Button
                      disabled={!status}
                      color="primary"
                      outline
                      title="Editar"
                      style={{
                        cursor: 'pointer',
                        backgroundColor: 'transparent', // Quita el relleno
                        color: 'black',
                        border: 'none', // Quita el contorno
                        }}
                        onClick={(e) => {
                          handleEditClick(sale.id_sales)
                          e.stopPropagation();
                        }}


                    >
                      <FiEdit3 title="Editar" />
                    </Button>
                       <Button
                       disabled={!status}
                       color="danger"
                       outline
                       title="Eliminar"
                       style={{
                        cursor: 'pointer',
                        backgroundColor: 'transparent', // Quita el relleno
                        color: 'black',
                        border: 'none', // Quita el contorno
                        }}
                       // onClick={() => handleOpen(usuario.user_id)}
                       onClick={(e) => {
                           handleDelClick(sale.id_sales)
                           e.stopPropagation();
                       }}
                       // handleDelete(user_id)
                     >
                       <AiFillDelete />
                     </Button>

                     <Button 
                  title='Print' 
                  outline 
                  color="success" 
                  disabled={loading} 
                  onClick={(e) => {
                    e.stopPropagation();
                    // setModalOpen(false); // Cierra el modal de detalles
                  }}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: 'transparent', // Quita el relleno
                    color: 'black',
                    border: 'none', // Quita el contorno
                    }}
                  >
                    <BsPrinter />
              </Button>
                  
            </td>

          </tr>
            
        //  )
        // }
        // return null;
      ))

      ): (
        <tr><td><Alert color='danger'>No hay datos</Alert></td></tr>
        // <div><Alert><p>No hay datos</p></Alert></div>
      )
      }
        </tbody>

      )}
        
        </>
      </Table>
        </>

      //  ) : (
      //   <div><Alert>No hay datos</Alert></div>
      //  )}
        
        // </>
    )
}



