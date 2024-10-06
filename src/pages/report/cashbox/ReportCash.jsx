import React, { useEffect, useState } from 'react'
// import { useStore } from '../providers/GlobalProvider'

import { useStore } from '../../../providers/GlobalProvider'





function ReportCash(props) {
  const URL = import.meta.env.VITE_URL_API;
  useEffect(() => {
    // Para establecer en el módulo en el que nos encontramos
    props.setTitle('Reporte de Caja')
  }, [])
  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const isOpen = useStore((state) => state.sidebar)

  return (
    <div className={isOpen ? 'wrapper' : 'side'}>
      <div className="container-fluid mt-4">
        <h1>reporte caja</h1>
      </div>
    </div>
  )
}

export default ReportCash;
