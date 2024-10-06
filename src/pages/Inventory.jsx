import React, { useState, useEffect } from 'react'
import { useStore } from '../providers/GlobalProvider'

const InventoryProduct = (props) => {

  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const isOpen = useStore((state) => state.sidebar);
  useEffect(() => {
    // Para establecer en el módulo en el que nos encontramos
    props.setTitle("Inventario");
  }, []);





      //inicio logica paginacion
      // const itemsPerPage = 10;
      // const totalPages = Math.ceil(filteredinvetoryprod.length / itemsPerPage)
      // const [currentPage, setCurrentPage] = useState(1)
    
      // const handlePageChange = (newPage) => {
      //   setCurrentPage(newPage)
      // }
    
      // const startIndex = (currentPage - 1) * itemsPerPage
      // const endIndex = startIndex + itemsPerPage
      // const visibleUsuarios = filteredinvetoryprod.slice(startIndex, endIndex)
      //fin logica paginacion
  return (
    <div className={isOpen ? 'wrapper' : 'side'}>
      <div className="container-fluid mt-4">
        

        <div className="row mt-4">
          <h1>INVENTARIO</h1>
        </div>
 

        
      </div>
    </div>
  );
}

export default InventoryProduct;
