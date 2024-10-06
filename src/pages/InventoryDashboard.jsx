import React, { useEffect } from "react";
import { useStore } from "../providers/GlobalProvider";
import { Card, CardTitle, CardText, CardImg, CardBody, Button, Container } from 'reactstrap';
import { MdAssignmentAdd, MdCreditScore } from "react-icons/md";
import { FaTruckArrowRight } from "react-icons/fa6";
import { BsFillInboxFill } from "react-icons/bs";
import { Link } from "react-router-dom";


// const squareCardStyle = {
//   width: '30%', // Ancho relativo
//   // paddingTop: '30%', // Alto relativo
//   margin: '10px', // Margen para separar las tarjetas
//   display: 'inline-block', // Hacer que las tarjetas estén en la misma línea
// };

function InventoryDashboar(props) {
  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const isOpen = useStore((state) => state.sidebar);
  useEffect(() => {
    // Para establecer en el módulo en el que nos encontramos
    props.setTitle("Reportes");
  }, []);
  return (
    <div className={isOpen ? "wrapper" : "side"}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>INVENTARIO</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryDashboar;
