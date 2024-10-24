import React, { useState, useEffect } from 'react'
import { Alert, Button, Modal, ModalBody, ModalFooter, ModalHeader, Table, Tooltip } from 'reactstrap'
// import '../styles/Table.scss'
// import '../styles/Table.scss'
// import '../../styles/Table.sccs'
import Skeleton from 'react-loading-skeleton'
import dayjs from 'dayjs'
import { MdOutlineAutoDelete } from 'react-icons/md'
import { GrAscend, GrDescend } from 'react-icons/gr'

const TableInvenPurchases = (props) => {
  const { data } = props
  

// const [selectedProductId, setSelectedProductId] = useState(null);
// const [movementHistory, setMovementHistory] = useState([]);
// const [isModalOpen, setIsModalOpen] = useState(false);

// const toggleModal = () => {
//   setIsModalOpen(!isModalOpen);
// };
// console.log('detalles',data.DetailShoppings)
const [dataOrdenada, setDataOrdenada] = useState([]); // Datos ordenados
const [ordenAscendente, setOrdenAscendente] = useState(true); // Estado para el orden
const [tooltipOpen, setTooltipOpen] = useState(false); // Estado para el tooltip

// useEffect(() => {
//   // Clona datos originales para mantenerlos sin alterar
//   setDataOrdenada([...data]);
// }, [data]);
// console.log('data ordenad',dataOrdenada)
useEffect(() => {
  try {
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
  } catch (error) {
    console.log(error)
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

  return (
    <>  
    <Table
      // bordered
      // hover
      // striped
      responsive
      // className="fixed-header"
    >
  <thead>
    <tr >
      <th>
      <div className='d-flex align-items-end'>
               
                      No.
                </div>
      </th>
      <th>Codigo</th>
      <th>Producto</th>
      <th>Precio Comp</th>
      <th>Precio Ven</th>
      <th>Cantidad</th>
      <th>Descuento por Prod</th>
      <th>Descuento Total</th>
      <th>Subtotal</th>
      <th>F Compra</th>
      {/* <th>Precio Compra(Q)</th> */}
      {/* <th>Porcentaje de Beneficio</th> */}
      {/* <th>Descuento(Q)</th> */}
      {/* <th>Precio Publico(Q)</th> */}
      {/* <th>Total(Q)</th> */}
      {/* <th>Accion</th> */}
    </tr>
  </thead>
  <tbody>
    { data.length > 0 ? (
      <>
       {dataOrdenada.map((inv, index) => (
        (inv.DetailShoppings.map((data, ind)=> (
          <tr key={ind}>

          <td>{index + 1}</td>
          <td>{data.Product?.code_product ? data.Product.code_product : 0}</td>
          <td>{data.Product?.name ? data.Product.name : 'NA'}</td>
          <td>{data.purchase_price ? data.purchase_price : 0}</td>
          <td>{data.sale_price ? (data.sale_price-(data.discount/data.amount)).toFixed(2) : 0}</td>
          <td>{data.amount ? data.amount : 0}</td>
          <td>{data.discount ? (data.discount/data.amount).toFixed(2) : '0'}</td>
          <td>{data.discount ? data.discount : '0'}</td>
          <td>{data.subtotal ? data.subtotal.toFixed(2) : '0' }</td>
          <td>{inv.createdAt.split(' ')[0]}</td>

      </tr>
      )))
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


// export default ;
export default TableInvenPurchases;
