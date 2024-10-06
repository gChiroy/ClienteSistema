import React, { useEffect, useState } from 'react'
import { useStore } from '../providers/GlobalProvider'
import '../styles/Select.scss'


function Purchases(props) {
  useEffect(() => {
    // Para establecer en el módulo en el que nos encontramos
    props.setTitle('Compras')
  }, [])
  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const isOpen = useStore((state) => state.sidebar)

  return (
    <div className={isOpen ? 'wrapper' : 'side'}>
      <div className="container-fluid mt-4">
        <div className="row">
          <h1>compras</h1>
          </div>      
      </div>
    </div>
  )
}

export default Purchases
