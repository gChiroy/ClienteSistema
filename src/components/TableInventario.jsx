import React, { useState, useEffect } from 'react'
import { Alert, Button, Collapse, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap'
// import '../styles/Table.scss'
import '../styles/Table.scss'
import TablaProductos from './inventory/tableCategories';
import { FaCircle, FaHistory } from 'react-icons/fa';


const TableInvenProd = (props) => {
  const URL = import.meta.env.VITE_URL_API;

  const { data, update, startIndex } = props
  const getClassForStock = (stock) => {
    if (stock >= 6) {
      return "stock-green";
    } else if (stock >= 3) {
      return "stock-orange";
    } else if (stock >= 0) {
      return "stock-red";
    } else {
      return ""; // En caso de valores negativos o no válidos
    }
  }


const [selectedProductId, setSelectedProductId] = useState(null);
const [movementHistory, setMovementHistory] = useState([]);
const [isModalOpen, setIsModalOpen] = useState(false);

const toggleModal = () => {
  setIsModalOpen(!isModalOpen);
};

const handleViewHistoryClick = async (productId) => {
  try {
    if (!productId) {
      console.error(404)      
    } else {
      const response = await fetch(`${URL}/api/historyt/${productId}`, {
        credentials: 'include',
      });
      const data = await response.json();
      setMovementHistory(data.movementHistory);
      setSelectedProductId(productId);
      toggleModal(); // Abre el modal después de cargar los datos
  
      
    }
  } catch (error) {
    console.log(error);
  }
};

const [isOpen, setIsOpen] = useState(false);

const toggleAccordion = () => {
  setIsOpen(!isOpen);
};

const [productosPorCategoria, setProductosPorCategoria] = useState({});

useEffect(() => {
  // Realiza la llamada al servidor al montar el componente
  fetch(`${URL}/api/allInventoryproducts`,{
    credentials:'include'
  })
    .then(response => response.json())
    .then(data => setProductosPorCategoria(data))
    .catch(error => console.error('Error fetching data:', error));
}, []); // La dependencia vacía significa que se ejecutará solo una vez al montar el componente.

   // ******************************Eliminar
   const [isOpenDel, setIsOpenDel] = useState(false)
   const [selectedSaleIdD, setSelectedSaleIdD] = useState(null);
 
   const toggleModalDel = () => {
     setIsOpenDel(!isOpenDel)
   }
 
   const handleDelClick = (shoppingId) => {
     setSelectedSaleIdD(shoppingId);
     // setIsModalOpen(true);
     toggleModalDel()
   };
   // console.log(selectedShoppingId)
   /********************************FIN delete */
  return (
    <>



            <div>
   

      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Historial</ModalHeader>
        <ModalBody>
          <Table>
            <thead>
              <tr>
                <th>Movimiento</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {movementHistory.length > 0 ? (
                <>
                {movementHistory.map((mov, index) => (
                <tr key={index}>
                  <td>{mov.movement_type}</td>
                  <td>{mov.createdAt}</td>
                </tr>
              ))}
                </>
              ) : (
                <Alert color='danger'>Sin datos</Alert>
              )
              }
            </tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggleModal}>Cerrar</Button>
        </ModalFooter>
      </Modal>
    </div>

    <Table
      // bordered
      // hover
      // striped
      responsive
      // className="fixed-header"
    >
  <thead>
    <tr className="red">
      <th>No.</th>
      <th>Codigo</th>
      <th>Producto</th>
      <th>Detalles</th>
      <th>Categoria</th>
      <th>Existencia</th>
      <th>Precio Com</th>
      <th>Descuento(Q)</th>
      <th>Precio Ven</th>
      <th>Total</th>
      <th>Historial</th>

    </tr>
  </thead>
  <tbody>
    { data.length > 0 ? (
      <>
       {data.map((inv, index) => (
      <tr key={index}>
        <td>{startIndex + index + 1}</td>
        <td>{inv.Product ? (inv.Product.code_product ? inv.Product.code_product : 'N/I') : 'N/I'}</td>
        <td>{inv.Product ? (inv.Product.name ? inv.Product.name : 'N/A') : 'N/A'}</td>
        <td>{inv.Product ? (inv.Product.detail ? inv.Product.detail : 'N/A') : 'N/A'}</td>

      
        {/* <td>{inv.Product.category ? (inv.Product.category.type ? inv.Product.category.type : <p style={{color: 'red'}}>Eliminado</p>): <p style={{color: 'red'}}>Eliminado</p>}</td> */}
        <td>
          {inv.Product && inv.Product.category ? (
            inv.Product.category.type ? (
              inv.Product.category.type
            ) : (
              <p style={{ color: "red" }}>Eliminado</p>
            )
          ) : (
            <p style={{ color: "red" }}>Eliminado</p>
          )}
        </td>
        <td>
          <div  style={{borderRadius:'8px', width:'2.6rem', fontWeight:'bold', fontSize:'large', display:'flex', justifyContent:'center'}}>
            {inv.stock} 
            <p style={{
              marginLeft: '5px',
            color:
            inv.stock <= 1 ? 'red' :
            inv.stock < 5 ? 'orange' :
            'green',
            }}>
              <FaCircle />
            </p>
          </div>
        </td>
        {/* <td >{inv.stock}</td> */}
        <td>{inv.purchase_price ? inv.purchase_price.toFixed(2) : 0}</td>
        <td>{inv.purchase_discount.toFixed(2)}</td>
        <td>{inv.public_price ? inv.public_price.toFixed(2) : 0}</td>
        <td>{inv.total.toFixed(2)}</td>
        <td>
          <Button 
          color='info' 
          onClick={() => handleViewHistoryClick(inv.products_id_product ? inv.products_id_product : 0)}

          title='History'
                  style={{
                    cursor: 'pointer',
                    backgroundColor: 'transparent', // Quita el relleno
                    color: 'black',
                    border: 'none', // Quita el contorno
                    }}
          >
                  <FaHistory />
          </Button>
          </td>
          

      </tr>
    ))}
      </>
    ) : (

           <tr><td colSpan={12}><Alert color='danger'>No hay datos</Alert></td></tr>

    )}
  
  </tbody>
</Table>

</>
  )
}


export default TableInvenProd;