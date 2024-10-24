import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FormGroup, Label, Col, Input, Table } from "reactstrap";
import { Formik } from "formik";
import Swal from "sweetalert2";
import { FaCashRegister } from "react-icons/fa";
import "../../styles/Formulario.scss";
import { IoIosAddCircle } from "react-icons/io";
import { MdInfo, MdOutlineAutoDelete } from "react-icons/md";
import { BsFillInboxFill } from "react-icons/bs";



const CreateDailyBox = (props) => {
  const URL = import.meta.env.VITE_URL_API;
  const { update, countBox } = props;
  const [initialBalance, setInitialBalance] = useState(''); // Estado para el saldo inicial
  const [errorMessage, setErrorMessage] = useState(''); // Estado para mensajes de error


  const [isOpen, setModal] = useState(false)    
      const toggle = () => {
        setModal(!isOpen)
      }

  const handleCreateDailyBox = async () => {
    try {
      // Realiza una solicitud POST para crear una nueva caja diaria
      const response = await fetch(`${URL}/api/boxd`, {
        method: 'POST',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initial_balance: parseFloat(initialBalance) }), // Convierte a número y serializa como JSON
      });

      // Verifica la respuesta del servidor
      if (response.status === 201) {
        // Creación exitosa
        alert('Caja diaria creada con éxito');
        toggle()
        update()
        
      } else {
        // Manejar otros casos según sea necesario
        const data = await response.json();
        console.error(data.error);
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error('Error al crear la caja diaria:', error);
      setErrorMessage('Error al crear la caja diaria');
    }
  };

  const [previous, setPreoious] = useState(null)

  useEffect(() => {
    fetch(`${URL}/api/ending`,{
      credentials:'include'
    })
      .then((response) => response.json())
      .then((data) => {
        setPreoious(data.previousEndingBalance);
      })
      .catch((error) => {
        console.error("Error al obtener saldo anterior", error);
      });
  }, [previous]);
  // console.log('previous', previous)

  const handleDismissAlert = () => {
    setErrorMessage(null);  // Ocultar el alert
  };

  return (
    <>
      <div className="container-fluid p-2">
        <div className="row">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="bg-white rounded-4 shadow-sm ">
              <div className="d-flex align-items-center gap-2 mb-4">
                <div className="bg-primary bg-opacity-10 p-2 rounded-3">
                  <BsFillInboxFill size={24} className="text-primary" />
                </div>
                <h5 className="mb-0">Registro de Nueva Caja</h5>
              </div>

              {/* {errorMessage && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {errorMessage}
                </div>
              )} */}
               {errorMessage && (
              <div className="alert alert-danger d-flex align-items-center" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {errorMessage}
                <button type="button" className="btn-close ms-auto" onClick={handleDismissAlert} aria-label="Close"></button>
              </div>
            )}

              <div className="row g-4 p-3">
                <div className="col-12 col-md-5">
                  <div className="form-group">
                    <Label className="text-muted mb-2">Saldo Anterior</Label>
                    <Input
                      type="text"
                      value={previous ? previous.toFixed(2) : '0.00'}
                      disabled
                      className="bg-light"
                    />
                  </div>
                </div>
                <div className="col-12 col-md-5">
                  <div className="form-group">
                    <Label className="text-muted mb-2">Saldo Inicial</Label>
                    <Input
                      type="text"
                      value={initialBalance}
                      onChange={(e) => setInitialBalance(e.target.value)}
                      placeholder="Ingrese el saldo inicial"
                      className="border-primary"
                    />
                  </div>
                </div>
                <div className="col-12 col-md-2 d-flex flex-column justify-content-end align-items-center">
                  <div className="form-group">
                    <Button 
                      color="primary" 
                      onClick={handleCreateDailyBox}
                    >
                      Crear
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="col-12 col-md-4 col-lg-6">
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <div className="bg-success bg-opacity-10 p-2 rounded-2">
                  <div className="text-success mb-2">Total Cajas Activas</div>
                  <strong className="mb-0">{countBox}</strong>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="bg-primary bg-opacity-10 p-2 rounded-2">
                  <div className="text-primary mb-2">Balance Total</div>
                  <strong className="mb-0">{previous ? previous.toFixed(2) : '0.00'}</strong>
                </div>
              </div>
            </div>
            <div className="row g-4">
              <div className="col-12 col-md-12">
                <div className="bg-opacity-10 p-2 rounded-2 p-0">
                <div className="alert alert-info bg-info bg-opacity-10 border-0 p-1">
                  <small className="d-block mb-2">
                    <strong>Nota:</strong>
                  </small>
                  El saldo anterior se sumará automáticamente al saldo inicial que ingrese
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default CreateDailyBox;

