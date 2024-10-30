import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Spinner, Form, FormGroup, Card, CardHeader, CardTitle} from 'reactstrap';

import { BsPrinter, BsPrinterFill } from 'react-icons/bs';
import { CardContent } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify'
import { ModalSpinner } from '../../../../providers/ModalSpinner';


const  ModalReportSale = ( props) => {
  const URL = import.meta.env.VITE_URL_API;
  const { modalOpen, toggleModal } = props;

  const [loading, setLoading] = useState(false)



  const handleGeneratePDFDay = () => {
    setLoading(true);
    // const filename = 'invoice-' + selectedProduct.bill_number; // Nombre del archivo PDF
    const url = `${URL}/api/pdfsday`;
    
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

  const defaultDateString = (inputDate) => {
    const today = new Date(inputDate);
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    // const dateObject = new Date(inputDate);
    // const day = dateObject.getDate().toString().padStart(2, '0');
    // const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    // const year = dateObject.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const [selectedDate, setSelectedDate] = useState('');

  

  const handleSelectPDFDay = async () => {
    if (!selectedDate) {
      alert('Debes seleccionar una fecha válida.');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${URL}/api/selectedpdfsday?date=${selectedDate}`,{
        method: "GET",
        credentials:'include'
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${selectedDate}.pdf`;
        a.click();
      } else {
        alert('Error al generar el PDF');
      }
    } catch (error) {
      console.error(error);
      alert('Error al generar el PDF');
    } finally {
      setLoading(false);
    }
}




const [date, setDate] = useState('');

const handleDateChange = (e) => {
    // const dateValue = event.target.value;
    // const date = dateValue ? new Date(dateValue) : null;
    // setSelectedDate(dateValue);

    setDate(e.target.value);

    // checkSales(date);
  };


  const formatDate = (inputDate) => {
    const dateObject = new Date(inputDate);
    const day = (dateObject.getUTCDate()).toString().padStart(2, '0');
    const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);


  try {
    // const formattedDate = date.split('/').reverse().join('-');
    const formattedDate = formatDate(date);

    const response = await fetch(`${URL}/api/selectedpdfsday?date=${formattedDate}`, {
        method: 'GET',
        credentials:'include'
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    setLoading(false);

    } else {
      console.error('Error en la solicitud Fetch');
    }
    setLoading(false);

  } catch (error) {
    console.error(error);
    setLoading(false);

  }
};

  return (
    <>
       <Card className="shadow-lg">
  <CardHeader className="space-y-1">
    <div className="d-flex justify-content-center">
      <CardTitle className="fs-5 font-bold">Reporte Diario</CardTitle>
    </div>
  </CardHeader>
  <CardContent>
    <div className="container">
      {/* Sección de fecha personalizada */}
      <div className="row align-items-center mb-4">
      <strong className="font-semibold">Elija una fecha</strong>

        <div className="col-12 col-md-9 mb-2 mb-md-0">
          <form onSubmit={handleSubmit} className="d-flex">
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="form-control rounded-md border border-input bg-transparent px-3 py-2"
            />
          </form>
        </div>
        <div className="col-12 col-md-3 text-center text-md-start">
          <Button
            variant="default"
            disabled={loading}
          >
            <BsPrinterFill className="" />
          </Button>
        </div>
      </div>

      {/* Separadores responsivos */}
      <div className="d-none d-md-block my-3">
        <hr />
      </div>
      <div className="d-block d-md-none my-4">
        <hr />
      </div>

      {/* Sección de reporte de hoy */}
      <div className="text-center">
        <Button
          variant="default"
          onClick={handleGeneratePDFDay}
          disabled={loading}
          className="d-flex align-items-center justify-content-center w-100"
        >
          <BsPrinterFill className="me-2" />
          <span>Reporte Diario</span>
        </Button>
      </div>
    </div>
  </CardContent>
</Card>



      <ToastContainer/>
      <ModalSpinner loading={loading}/>
    </>
  );
}

export default ModalReportSale;
