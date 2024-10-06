import React, { useState, useEffect } from 'react'
import { Alert, Button, Collapse, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap'
// import '../styles/Table.scss'
import '../styles/Table.scss'
import TablaProductos from './inventory/tableCategories';
import StockManagement from './inventory/editStock';


const TableInvenProd = (props) => {
  const URL = import.meta.env.VITE_URL_API;

  const { data, update } = props
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
  fetch(`${URL}/api/invCat`,{
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
   

  <h1>ine prod</h1>
    </div>

</>
  )
}


export default TableInvenProd;