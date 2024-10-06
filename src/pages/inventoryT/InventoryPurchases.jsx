import React, { useState, useEffect } from 'react'
// import { useStore } from '../providers/GlobalProvider'
import { useStore } from '../../providers/GlobalProvider'


const InventoryPurchases = (props) => {

  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const isOpen = useStore((state) => state.sidebar);
  useEffect(() => {
    // Para establecer en el módulo en el que nos encontramos
    props.setTitle("Inventario de Compras");
  }, []);


  return (
    <div className={isOpen ? 'wrapper' : 'side'}>
      <div className="container-fluid mt-4">
        <div className="row">
          <h1>inteario compras</h1>
        </div>
      </div>
    </div>
  );
}

export default InventoryPurchases;
