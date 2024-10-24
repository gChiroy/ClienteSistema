import React, { useEffect, useState } from "react";
import { useStore } from "../providers/GlobalProvider";
import "../styles/Cash.scss";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner, Card, CardBody } from "reactstrap";
import { Container, Row } from "reactstrap";
import dayjs from "dayjs";


// import "../styles/Formulario.scss";
// Caja abierta
import ModalCloseBox from "../components/caja/ModalBoxClose";
import CreateDailyBox from "../components/caja/ModalBox";
import { ModalSpinner } from "../providers/ModalSpinner";
import { FaRegCalendarAlt } from "react-icons/fa";

function CashBox(props) {
  const URL = import.meta.env.VITE_URL_API;

  useEffect(() => {
    // Para establecer en el módulo en el que nos encontramos
    props.setTitle("Caja");
  }, []);
  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const isOpen = useStore((state) => state.sidebar);
 
  const [box, setBox] = useState([])

  const [loading, setLoading] = useState(false)  
    const [activeBoxesCount, setActiveBoxesCount] = useState(0);

 
    const getBox = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${URL}/api/allBox`, {
          credentials: 'include'
        });
    
        const data = await response.json();
    
        if (!data.dailybox || data.dailybox.length === 0) {
          setBox([]); // Asignar un arreglo vacío si no hay datos
          setActiveBoxesCount(0); // No hay cajas activas
          console.log('No hay cajas activas para mostrar');
          return; 
        }
    
        // Si hay datos, proceder normalmente
        setBox(data.dailybox);
    
        // Contar cuántas cajas tienen status true
        const activeBoxes = data.dailybox.filter(box => box.status === true);
        setActiveBoxesCount(activeBoxes.length); 
    
      } catch (error) {
        console.error('Error al obtener las cajas:', error);
      } finally {
        setLoading(false);
      }
    };
    
    useEffect(() => {
      getBox();
    }, []);
  
  const [isModalOpen, setIsModalOpen] = useState(false)
      const [selectedShoppingId, setSelectedShoppingId] = useState(null);
    
      const toggleModalEdit = () => {
        setIsModalOpen(!isModalOpen)
      }
    
      const handleEditClick = (shoppingId) => {
        setSelectedShoppingId(shoppingId);
        toggleModalEdit()
      };
  
      const [isOpenBox, setIsOpenBox] = useState(true); // Estado para controlar si la caja está abierta o cerrada

      const toggleBox = () => {
        setIsOpenBox(!isOpenBox); // Cambia el estado de isOpenBox
      };
  const format = 'DD/MM/YYYY';

  const [previous, setPreoious] = useState(null)

  useEffect(() => {
    fetch(`${URL}/api/ending`, {
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
  // console.table(box)
    return (
      <div className={isOpen ? "wrapper" : "side"}>
        <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <CreateDailyBox update={getBox} countBox={activeBoxesCount}/>
              </div>
            </div>
            <div className="container-fluid">
              <div className="row">
                <h4 className="text-center p-0 mb-2">Listado de Cajas</h4>
              </div>
              <div className="row">
                <div className="col-12">
                  <ModalCloseBox creditId={selectedShoppingId} Update={getBox} isOpen={isModalOpen} toggle={toggleModalEdit} />
                  
                  {box.map((item, index) => (
                    <div key={index} className="bg-white rounded-4 mt-2 shadow-sm position-relative overflow-hidden">
                      {/* Barra de estado lateral */}
                      <div 
                        className="position-absolute h-100 top-0 start-0" 
                        style={{ 
                          width: '4px', 
                          backgroundColor: item.status ? '#10B981' : '#EF4444'
                        }} 
                      />

                      {/* Encabezado */}
                      <div className="d-flex justify-content-between align-items-center p-1 border-top">
                        <div className="d-flex align-items-center gap-3">
                          <strong className="mb-0 fw-bold">Caja #{item.id_daily_box}</strong>
                          <span className={`badge ${item.status ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} px-3 py-2 rounded-4`}>
                            {item.status ? 'Abierto' : 'Cerrado'}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <div className="text-muted">
                            <FaRegCalendarAlt className="me-1 mb-1"/>
                            {dayjs(item.createdAt).format(format)}
                          </div>
                          <Button
                            color={item.status ? 'warning' : 'secondary'}
                            onClick={() => handleEditClick(item.id_daily_box)}
                            disabled={!item.status}
                            className="rounded-4 px-2"
                          >
                            {item.status ? 'Cerrar Caja' : 'Caja Cerrada'}
                          </Button>
                        </div>
                      </div>

                      <div className="p-2">
                        {/* Métricas principales */}
                        <div className="row g-4 mb-2">
                          <div className="col-md-3">
                            <div className="p-2 bg-primary bg-opacity-10 rounded-2">
                              <div className="text-primary mb-0">Saldo Inicial</div>
                              <strong className="mb-0 fw-bold">{item.initial_balance.toFixed(2)}</strong>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="p-2 bg-success bg-opacity-10 rounded-2">
                              <div className="text-success mb-0">Ingresos</div>
                              <strong className="mb-0 fw-bold">
                                {item.effective_income ? item.effective_income.toFixed(2) : 'calculando...'}
                              </strong>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="p-2 bg-danger bg-opacity-10 rounded-2">
                              <div className="text-danger mb-0">Egresos</div>
                              <strong className="mb-0 fw-bold">
                                {item.effective_expenditure ? item.effective_expenditure.toFixed(2) : 'calculando...'}
                              </strong>
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="p-2 bg-info bg-opacity-10 rounded-4">
                              <div className="text-info mb-0">Ganancia</div>
                              <strong className="mb-0 fw-bold">
                                {item.revenue ? item.revenue.toFixed(2) : 'calculando...'}
                              </strong>
                            </div>
                          </div>
                        </div>

                        {/* Detalles financieros */}
                        <div className="row g-4">
                          <div className="col-md-8">
                            <div className="bg-light rounded-2 p-1">
                              <strong className="mb-2">Detalles de Saldos</strong>
                              <div className="row g-4">
                                <div className="col-md-6">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div className="text-muted">Saldo en Caja</div>
                                    <div className="fw-semibold fs-6">
                                      {item.previous_balance ? item.previous_balance.toFixed(2) : 'calculando...'}
                                    </div>
                                  </div>
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div className="text-muted">Saldo Bruto</div>
                                    <div className="fw-semibold fs-6">
                                      {item.effective_income ? item.effective_income.toFixed(2) : 'calculando...'}
                                    </div>
                                  </div>
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="text-muted">Saldo Neto</div>
                                    <div className="fw-semibold fs-6">
                                      {item.net_balance ? item.net_balance.toFixed(2) : 'calculando...'}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-6 border-start">
                                  <div className="ps-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                      <div className="text-muted">Monto Retirado</div>
                                      <div className="fw-semibold fs-6">
                                        {item.deliver_cash ? item.deliver_cash.toFixed(2) : '0.00'}
                                      </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <div className="text-muted fw-bold">Saldo Final</div>
                                      <div className="fw-bold fs-6 text-primary">
                                        {item.ending_balance ? item.ending_balance.toFixed(2) : '0.00'}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4 p-3">
                            <div className="bg-dark text-white rounded-2 p-1">
                              <div className="row">
                                <div className="col-12">
                                <strong >Resumen</strong>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-6">
                                <div className="text-muted">Estado Actual</div>
                                  <div className="fs-6 fw-semibold">
                                    {item.status ? 'Caja Abierta' : 'Caja Cerrada'} #{item.id_daily_box} 
                                  </div>
                                </div>
                                <div className="col-6">
                                <div className="text-muted">Balance Total</div>
                                  <div className="fs-6 fw-semibold">
                                  Monto Final Q{item.ending_balance ? item.ending_balance.toFixed(2) : '0.00'}
                                  </div>
                                </div>
                              </div>
                              <div >
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <ModalSpinner loading={loading} />
                </div>
              </div>
            </div>

          </div>

      </div>
    );
  
}

export default CashBox;

