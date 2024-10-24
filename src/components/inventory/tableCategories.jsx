// import React from 'react';
// import { Alert, Button, Table } from 'reactstrap';
import React, { useState, useEffect } from 'react'
import { Alert, Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap'
// import '../styles/Table.scss'
// import '../styles/Table.scss'
import '../../styles/Table.scss'
import { FaCircle, FaHistory } from 'react-icons/fa';

const TablaProductos = ( props ) => {

  const { productosPorCategoria } = props
    const URL = import.meta.env.VITE_URL_API;
    console.log('opcion 2', productosPorCategoria)

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
 
 <div>
 {Object.keys(productosPorCategoria).length > 0 ? (
  Object.keys(productosPorCategoria).map((categoria) => (
    <div key={categoria} style={{ marginTop: '1rem' }}>
      <Table responsive>
        <thead>
          <tr>
           <th style={{borderColor:'grey', borderTopRightRadius:'5px', borderTopLeftRadius:'5px'}} colSpan={12}>
              <strong className='d-flex justify-content-center fs-4'>{categoria}</strong>
            </th>
          </tr>
          <tr>
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
          {productosPorCategoria[categoria].map((inv, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{inv.Product ? inv.Product.code_product : 'N/A'}</td>
              <td>{inv.Product ? inv.Product.name : 'N/A'}</td>
              <td>{inv.Product ? inv.Product.detail : 'N/A'}</td>
              <td>{categoria}</td>
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
              <td>{inv.purchase_price?.toFixed(2) || '0.00'}</td>
              <td>{inv.discount?.toFixed(2) || '0.00'}</td>
              <td>{inv.public_price?.toFixed(2) || '0.00'}</td>
              <td>{inv.total?.toFixed(2) || '0.00'}</td>
              <td>
                <Button
                  onClick={() =>
                    handleViewHistoryClick(inv.products_id_product || 0)
                  }
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
        </tbody>
      </Table>
    </div>
  ))
) : (
  <p>No se encontraron productos en esta categoría.</p>
)}


 </div>
    </>
  );
};

export default TablaProductos;
