import React, { useState, useEffect } from 'react';
import { BsCashStack, BsFillInboxFill } from 'react-icons/bs';
import { MdOutlineAutoDelete } from 'react-icons/md';
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const  ModalCloseBox = (props) => {
  const URL = import.meta.env.VITE_URL_API;

    const { creditId, isOpen, toggle, Update } = props;

  const [mora, setMora] = useState('')
  const [data, setData] = useState([])

  const [message, setMessage] = useState('');


  const handleInputChange = (e) => {
    // const { name, value } = e.target
    // setMora({ ...mora, [name]: value })
    const { name, value } = e.target;
    setMora(parseFloat(value));
    // setMora(e.target.value);
  };

  const handleAddMora = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${URL}/api/closebox/${creditId}`, {
        method: 'PUT', // Usa el método PUT para actualizar la cuota
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        // body: JSON.stringify({mora}), // Envía el monto de la mora en formato JSON
        body: JSON.stringify({ deliver_cash: parseFloat(mora) }), // Convierte a número y serializa como JSON

      });

      if (response.ok) {
        const data = await response.json();
        // console.log(data)
        setMessage(data.message);
        toggle();
        Update();
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('Error al enviar la mora');
    }
  };

  const CajaId= async () => {
    // e.preventDefault();

    try {
      const response = await fetch(`${URL}/api/box/${creditId}`, {
        credentials: 'include',

      });

      if (response.ok) {
        const data = await response.json();
        // console.log(data)
        setData(data);
      } else {
        const errorData = await response.json();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // console.table(data)
useEffect(()=>{
  CajaId()
},[creditId])

  
  // console.log(mora)

  return (
    <>
      
    
      <Modal 
      isOpen={isOpen} 
      toggle={toggle} 
      centered 
      className="shadow-lg"
    >
      <ModalHeader 
        toggle={toggle}
        className="bg-light"
      >
        <div className="d-flex align-items-center">
          <BsCashStack 
            size={24} 
            className="text-primary me-2"
          />
          <span className="fw-bold">
            Retiro de efectivo - {creditId}
          </span>
        </div>
      </ModalHeader>

      <ModalBody className="px-4 py-4">
        <Form>
          <FormGroup className="mb-4">
            <Label 
              for="current-amount" 
              className="fw-bold mb-2"
            >
              Monto Actual
            </Label>
            <Input
              id="current-amount"
              value={data.net_balance ? data.net_balance.toFixed(2) : "0.00"}
              disabled
              className="bg-light text-end"
            />
            <small className="text-muted fst-italic">
              El monto a retirar no debe ser mayor al actual
            </small>
          </FormGroup>

          <FormGroup>
            <Label 
              for="deliver_cash"
              className="fw-bold mb-2"
            >
              Monto a retirar
            </Label>
            <Input
              type="number"
              name="deliver_cash"
              id="deliver_cash"
              placeholder="0.00"
              value={mora}
              onChange={handleInputChange}
              className="text-end"
              required
            />
          </FormGroup>

          {message && (
            <Alert 
              color="danger" 
              className="mt-3 mb-0 py-2"
            >
              {message}
            </Alert>
          )}
        </Form>
      </ModalBody>

      <ModalFooter className="bg-light">
        <Button
          color="secondary"
          onClick={toggle}
          className="px-4"
        >
          Cancelar
        </Button>
        <Button
          color="primary"
          onClick={handleAddMora}
          disabled={!mora}
          className="px-4 ms-2"
        >
          Confirmar
        </Button>
      </ModalFooter>
    </Modal>
    </>
  );
}

export default ModalCloseBox;
