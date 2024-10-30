import React, { useState } from 'react';
import { BiFoodMenu, BiSolidReport } from 'react-icons/bi';
import { MdOutlineAutoDelete } from 'react-icons/md'
import { ToastContainer, toast } from 'react-toastify'
import { ModalSpinner } from '../../../../providers/ModalSpinner';


import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Spinner, Form, FormGroup, Card, CardHeader, CardTitle, Label} from 'reactstrap';

import { BsPrinter, BsPrinterFill } from 'react-icons/bs';
import { CardContent } from '@mui/material';

const  ModalReportShoopWeek = ( props) => {
  const URL = import.meta.env.VITE_URL_API;
  const { modalOpen, toggleModal } = props;

  const [loading, setLoading] = useState(false)



  const handleGeneratePDFWeek = () => {
    setLoading(true);
    // const filename = 'invoice-' + selectedProduct.bill_number; // Nombre del archivo PDF
    const url = `${URL}/api/weekpurpdf`;
    
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
      // Formatear la fecha en el formato correcto (DD/MM/YYYY -> YYYY-MM-DD)
//   const formattedDate = selectedDate.split('/').reverse().join('-');

    setLoading(true);

    try {
      const response = await fetch(`${URL}/api/pdfpday/pdf?date=${selectedDate}`,{
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





const currentDate = new Date();
const initialMonth = currentDate.getMonth() + 1;
const initialWeekNumber = getWeekNumber(currentDate);
// const formRef = useRef([]);


const [month, setMonth] = useState(initialMonth);
  const [weekNumber, setWeekNumber] = useState(initialWeekNumber);
//   const [salesData, setSalesData] = useState(null);
//   const [loading, setLoading] = useState(false);

 //accionar hanldesubmit automaticamente
 const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'month') {
      setMonth(value);
    } else if (name === 'weekNumber') {
      setWeekNumber(value);
    }
  };

const generarPdf = () => {//http://localhost:5188/api/pdf/reportweek
    setLoading(true);
    const url = `${URL}/api/pdfsweek/pdf?week=${weekNumber}&month=${month}`;
    // http://localhost:8000/api/pdfsweek/pdf?week=1&month=10
    fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/pdf',
      },
      responseType: 'blob',
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
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

   

    //   console.log('semana:', weekNumber)
    //   console.log('mes:', month)


  return (
    <>

      <Card className="shadow-lg">
  <CardHeader className="pb-2">
    <div className="d-flex justify-content-center">
      <CardTitle className="fs-5 font-bold">Reporte Mensual</CardTitle>
    </div>
  </CardHeader>
  <CardContent>
    <div className="container">
      {/* Formulario de selección de mes y semana */}
      <form className="mb-4">
        <div className="row align-items-center">
          <div className="col-12 col-md-5 mb-2 mb-md-0">
            <Label>No. mes:</Label>
            <Input
              type="number"
              name="month"
              value={month}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="col-12 col-md-5 mb-2 mb-md-0">
            <Label>No. semana:</Label>
            <Input
              type="number"
              name="weekNumber"
              value={weekNumber}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="col-12 col-md-2 mb-0 text-center text-md-start mt-4">
            <Button
              variant="default"
              disabled={loading}
              onClick={generarPdf}
            >
              <BsPrinterFill /> 
            </Button>
          </div>
        </div>
      </form>

      {/* Separadores responsivos */}
      <div className="d-none d-md-block my-3">
        <hr />
      </div>
      <div className="d-block d-md-none my-4">
        <hr />
      </div>

      {/* Sección de reporte semanal */}
      <div className="text-center">
        <Button
          onClick={handleGeneratePDFWeek}
          disabled={loading}
          className="d-flex align-items-center justify-content-center w-100"
        >
          <BsPrinterFill className="me-2" /> Reporte Semanal
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


const getWeekNumber = (date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const weekNumber = Math.ceil((date.getDate() + firstDayOfWeek) / 7);
    return weekNumber;
  };
export default ModalReportShoopWeek;
