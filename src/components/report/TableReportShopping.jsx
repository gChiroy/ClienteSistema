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


// import '../../styles/Compañias/tr.scss'
import '../../styles/Compañias/tr.scss'
import { FcPrint } from 'react-icons/fc';
import { BsPrinter } from 'react-icons/bs';
import { MdOutlineDownloading } from 'react-icons/md';
import { GrAscend, GrDescend } from 'react-icons/gr';
import { ImSortAmountDesc } from 'react-icons/im';
import { ModalSpinner } from '../../providers/ModalSpinner';


export const TableReportShopping = (props) => {
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
  
  
    const toggleModalsEL = () => {
      setModalOpen(!modalOpenDetail);
    };
  
    const handleRowClick = (product) => {
      setSelectedProduct(product);
      toggleModalsEL();
    };

    const [loading, setLoading] = useState(false);
    const handleGeneratePDF = (id, filename) => {
      setLoading(true);
      const url = `${URL}/api/purchase/bill/${id}/${filename}`;
      
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



    return(
        <>
        <div>
        
        </div>
        <Table responsive>
              <thead>
                <tr>
                <th>
                      No
                </th>
                <th>No. Factura</th>
                <th>Proveedor</th>
                <th>Telefono</th>
                <th>Total</th>
                <th>Fecha</th>
                </tr>
              </thead>

              <>
        {isActive && (
          hasDataInRange  ? (
        <tbody>
          { dataOrdenada.length > 0 ? (
          
          dataOrdenada.map((purchas, index) => (
            // const createdAt = new Date(usuario.createdAt);
            // if (createdAt >= startDate && createdAt <= endDate) {
            //   return (
                <tr id="dat-f" key={index} onClick={() => handleRowClick(purchas)}>
                <td>{startIndex + index + 1}</td>
                <td>{purchas?.bill_number ? purchas.bill_number : 0}</td>
                <td>{purchas?.Provider ? (purchas.Provider?.name ? purchas.Provider.name : 'NA') : 'NA'}</td>
                <td>{purchas?.Provider ? (purchas.Provider?.phone ? purchas.Provider.phone : 'NA') : 'NA'}</td>
                <td>{purchas?.total ? purchas.total : 'Null'}</td>
                {/* <td>{purchas.category ? (purchas.category.type ? product.category.type : <p style={{color:'red'}}>Sin Categoría</p>) : <p style={{color:'red'}}>Sin Categoría</p>}</td> */}

                <td>{purchas?.createdAt ? purchas.createdAt : 'NA'}</td>
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
                    handleGeneratePDF(purchas?.id_shopping, purchas?.bill_number)
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
            <p>no hay datos</p>
          )
        }
        </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan="7"><Alert color='warning'>No se encontraron registros</Alert></td>
            </tr>
          </tbody>
        )
      )}
      {!isActive && (
        <tbody>
          {dataOrdenada
          // .sort((a, b) => new Date(b.users.createdAt) - new Date(a.users.createdAt))
          .map((purchas, index) => (
            <tr id="dat-f" key={index} onClick={() => handleRowClick(purchas)}>
            <td>{startIndex + index + 1}</td>
            <td>{purchas?.bill_number ? purchas.bill_number : 0}</td>
            <td>{purchas?.Provider ? (purchas.Provider?.name ? purchas.Provider.name : 'NA') : 'NA'}</td>
            <td>{purchas?.Provider ? (purchas.Provider?.phone ? purchas.Provider.phone : 'NA') : 'NA'}</td>
            <td>{purchas?.total ? purchas.total : 'Null'}</td>
            {/* <td>{purchas.category ? (purchas.category.type ? product.category.type : <p style={{color:'red'}}>Sin Categoría</p>) : <p style={{color:'red'}}>Sin Categoría</p>}</td> */}

            <td>{purchas?.createdAt ? purchas.createdAt : 'NA'}</td>
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
                    handleGeneratePDF(purchas?.id_shopping, purchas?.bill_number)
                  }}
                  >
                    <BsPrinter />
              
              </Button>
            </td>
          </tr>
           
           
          ))}
        </tbody>

      )}
          
        </>
            </Table>
            <ModalSpinner loading={loading}/>

        </>
    )
}