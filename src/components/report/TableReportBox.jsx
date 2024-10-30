import React, {useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Alert, Button, Card, Modal, ModalBody, ModalFooter, ModalHeader, Row,
    Col,
    Table,
    CardHeader,
    CardBody,
    CardImg,
    Container,
    Spinner,
    Tooltip
} from "reactstrap";

import dayjs from "dayjs";

import '../../styles/Compañias/tr.scss'
import { FcPrint } from 'react-icons/fc';
import { BsPrinter } from 'react-icons/bs';
import { MdOutlineDownloading } from 'react-icons/md';

import { GrAscend, GrDescend } from 'react-icons/gr'
import { ImSortAmountDesc } from 'react-icons/im'
import { ModalSpinner } from '../../providers/ModalSpinner';


export const TableReportBox = (props) => {
  const URL = import.meta.env.VITE_URL_API;

    const {
        data,
        handleDelClick,
        handleEditClick,
        
        startIndex,
        isActive,
        hasDataInRange,
        filteredData,
        handlePdfClick
     
      } = props

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpenDetail, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false)
  
  
    const toggleModalsEL = () => {
      setModalOpen(!modalOpenDetail);
    };
  
    const handleRowClick = (product) => {
      setSelectedProduct(product);
      toggleModalsEL();
    };
    

    const handleGeneratePDF = (id) => {
      setLoading(true);
      // const filename = 'invoice-' + selectedProduct.bill_number; // Nombre del archivo PDF
      const url = `${URL}/api/pdfbox/${id}`;
      
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
        credentials: 'include',
        responseType: 'blob',
      })
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          // const pdfUrl = URL.createObjectURL(filename);
          const newWindow = window.open(url, '_blank');
          if (!newWindow) {
            throw new Error('No se pudo abrir el PDF en una pestaña nueva.');
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error:', error);
          setLoading(false);
        });
    };
 

    const [dataOrdenada, setDataOrdenada] = useState([]); // Datos ordenados
    const [ordenAscendente, setOrdenAscendente] = useState(true); // Estado para el orden
    const [tooltipOpen, setTooltipOpen] = useState(false); // Estado para el tooltip

    // useEffect(() => {
    //   // Clona datos originales para mantenerlos sin alterar
    //   setDataOrdenada([...data]);
    // }, [data]);
    useEffect(() => {
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

    const format = 'DD/MM/YYYY';

    return(
        <>
        <div>
       
       
       
        </div>
       {/* {ordenAscendente.length > 0 ? ( */}
        {/* <> */}
        <Table responsive className='custom-table'>
        <thead>
          <tr>
          <th>
          
                No
      
          </th>
          <th>Caja</th>
          <th>F. Creacion</th>
          <th>S Inicial</th>
          <th>Ingresos</th>
          <th>Egresos</th>
          <th>Gastos</th>
          <th>S Neto</th>
          <th>Imprimir</th>
          </tr>
        </thead>
        <>
          {isActive && (
          hasDataInRange  ? (
        <tbody>
          {data.length > 0 ? (
          
          dataOrdenada.map((sale, index) => (
        // const createdAt = new Date(usuario.createdAt);
        // if (createdAt >= startDate && createdAt <= endDate) {
        //   return (
            <tr id="dat-f" key={index} onClick={() => handleRowClick(sale)}>
            <td>{startIndex + index + 1}</td>
            <td>{sale.id_daily_box}</td>
            <td>{sale.createdAt}</td>
            <td>{sale.initial_balance.toFixed(2)}</td>
            <td>{sale.effective_income ? sale.effective_income.toFixed(2) : 0}</td>
            <th>{sale.effective_expenditure ? sale.effective_expenditure.toFixed(2) : 0}</th>
            <td>{sale.effective_bill ? sale.effective_bill.toFixed(2) : 0}</td>
            <td>{sale.net_balance ? sale.net_balance.toFixed(2) : 0}</td>
            <td>
            <Button 
                  title='Print' 
                  outline 
                  color="success" 
                  style={{
                    marginRight:'12px',
                    cursor: 'pointer',
                    backgroundColor: 'transparent', // Quita el relleno
                    color: 'black',
                    border: 'none', // Quita el contorno
                    }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // setModalOpen(false); // Cierra el modal de detalles
                    handleGeneratePDF(sale?.id_daily_box)
                  }}
                  >
                    <BsPrinter />
              
              </Button>
            </td>

          </tr>
            
        //  )
        // }
        // return null;
      ))

      ): (
        <tr><td><Alert color='danger'>No hay datos</Alert></td></tr>
        // <div><Alert><p>No hay datos</p></Alert></div>
      )
      }
        </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan="9"><Alert color='warning'>No se encontraron registros</Alert></td>
            </tr>
          </tbody>
        )
      )}
      {!isActive && (
        <tbody>
          {data.length > 0 ? (
          
          dataOrdenada.map((sale, index) => (
        // const createdAt = new Date(usuario.createdAt);
        // if (createdAt >= startDate && createdAt <= endDate) {
        //   return (
            <tr id="dat-f" key={index} onClick={() => handleRowClick(sale)}>
            <td>{startIndex + index + 1}</td>
            <td>{sale.id_daily_box}</td>
            <td>{sale.createdAt}</td>
            <td>{sale.initial_balance.toFixed(2)}</td>
            <td>{sale.effective_income ? sale.effective_income.toFixed(2) : 0}</td>
            <th>{sale.effective_expenditure ? sale.effective_expenditure.toFixed(2) : 0}</th>
            <td>{sale.effective_bill ? sale.effective_bill.toFixed(2) : 0}</td>
            <td>{sale.net_balance ? sale.net_balance.toFixed(2) : 0}</td>
            <td>
            <Button 
                  title='Print' 
                  outline 
                  color="success" 
                  style={{
                    marginRight:'12px',
                    cursor: 'pointer',
                    backgroundColor: 'transparent', // Quita el relleno
                    color: 'black',
                    border: 'none', // Quita el contorno
                    }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // setModalOpen(false); // Cierra el modal de detalles
                    handleGeneratePDF(sale?.id_daily_box)
                  }}
                  >
                    <BsPrinter />
              
              </Button>
            </td>

          </tr>
            
        //  )
        // }
        // return null;
      ))

      ): (
        <tr><td><Alert color='danger'>No hay datos</Alert></td></tr>
        // <div><Alert><p>No hay datos</p></Alert></div>
      )
      }
        </tbody>

      )}
        
        </>
      </Table>
      <ModalSpinner loading={loading}/>

        </>

      //  ) : (
      //   <div><Alert>No hay datos</Alert></div>
      //  )}
        
        // </>
    )
}



