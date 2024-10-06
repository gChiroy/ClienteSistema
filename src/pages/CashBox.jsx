import React, { useEffect, useState } from "react";
import { useStore } from "../providers/GlobalProvider";
import "../styles/Cash.scss";




function CashBox(props) {

  useEffect(() => {
    // Para establecer en el módulo en el que nos encontramos
    props.setTitle("Caja");
  }, []);
  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const isOpen = useStore((state) => state.sidebar);
 



  // console.table(box)
    return (
      <div className={isOpen ? "wrapper" : "side"}>
        <div className="container-fluid mt-4">
            <div className="row">
    
            </div>
            <div className="row">
              <div className="col-12">
                <h1>CAJA</h1>
              </div>
            </div>
          </div>

      </div>
    );
  
}

export default CashBox;

