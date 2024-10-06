import React, { useEffect, useState } from 'react'
import { useStore } from '../providers/GlobalProvider'
import Pagination from '../providers/Pagination'
import { ToastContainer, toast } from 'react-toastify'
import DatePicker from 'react-datepicker'
import SearchInput from '../providers/InputSearch'

import dayjs from 'dayjs'
import addDays from 'date-fns/addDays'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isToday from 'dayjs/plugin/isToday'
import weekday from 'dayjs/plugin/weekday'
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Alert,
  Card,
  CardBody,
} from 'reactstrap'

dayjs.extend(weekOfYear)
dayjs.extend(isToday)
dayjs.extend(weekday)
// dayjs.extend(startOfMonth);
// dayjs.extend(endOfMonth);
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import '../styles/Select.scss'
import { AiTwotoneCheckSquare, AiOutlineCheck } from 'react-icons/ai'

import { TiDeleteOutline } from 'react-icons/ti'
import { BsPlusCircle, BsDashCircle } from 'react-icons/bs'
import { RiEditCircleFill } from 'react-icons/ri'
import { IoIosAddCircle } from 'react-icons/io'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { ModalSpinner } from '../providers/ModalSpinner'
import ModalAddP from '../components/purchaseProvider/ModalAddP'
import ModalEditP from '../components/purchaseProvider/ModalEditP'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TablePurchase } from '../components/purchaseProvider/TablePurchase'
import ModalDeleteP from '../components/purchaseProvider/ModalDeleteP'
import CloseIcon from '@mui/icons-material/Close';




function Purchases(props) {
  const URL = import.meta.env.VITE_URL_API;
  useEffect(() => {
    // Para establecer en el módulo en el que nos encontramos
    props.setTitle('Compras')
  }, [])
  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const isOpen = useStore((state) => state.sidebar)
  const [loading, setLoading] = useState(false)

  const [purchases, setPurchases] = useState([]);
  const [filteredPurchase, setFilteredPurchase] = useState([])
  const [reporteCompras, setReporteCompras] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  const getPurchases = async () => {
    // setLoading(true);
    try {
      const response = await fetch(`${URL}/api/allPurchases`, {
        credentials: 'include',
      });
      const data = await response.json();
  
      // Verificar si data está vacío y manejarlo
      if (data.length === 0) {
        // Mostrar un mensaje adecuado o realizar alguna acción cuando no hay datos
        console.log('No hay datos disponibles');
      } else {
        // Si hay datos, actualizar los estados
        setFilteredPurchase(data);
        setPurchases(filterDataByMonth(data));
        setReporteCompras(data);
        setSelectedOption(1);
      }
  
      // setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(()=>{
    getPurchases()
  }, [])

  // console.log('compras', purchases)

    /***  INICIO BUSCADOR **** * */
    const handleSearch = (searchTerm) => {
      if (purchases.length > 0) {
        if (searchTerm === null) {
          setFilteredPurchase(purchases)
        } else {
          const filtered = purchases.filter(
            (usuario) =>
            usuario?.bill_number.toString().includes(searchTerm.toLowerCase()) ||
            usuario?.Provider?.name.toLowerCase().includes(searchTerm.toLowerCase())||
            // usuario?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||

              // usuario.total.toString().includes(searchTerm.toLowerCase()) 
              (usuario?.total !== null && usuario.total.toString().includes(searchTerm.toLowerCase()))
          )
          setFilteredPurchase(filtered)
        }
      } else {
        console.error(404)
      }
    }
    /***  FIN BUSCADOR **** * */

    // ******************************Eliminar
    const [isOpenDel, setIsOpenDel] = useState(false)
    const [selectedShoppingIdD, setSelectedShoppingIdD] = useState(null);
  
    const toggleModalDel = () => {
      setIsOpenDel(!isOpenDel)
    }
  
    const handleDelClick = (shoppingId) => {
      setSelectedShoppingIdD(shoppingId);
      // setIsModalOpen(true);
      toggleModalDel()
    };
    // console.log(selectedShoppingId)
    /********************************FIN delete */
        // ******************************Eliminar
        const [isOpenpdf, setIsOpenpdf] = useState(false)
        const [selectedPdf, setSelectedPdf] = useState(null);
      
        const toggleModalPdf = () => {
          setIsOpenpdf(!isOpenpdf)
        }
      
        const handlePdfClick = (shoppingId) => {
          setSelectedPdf(shoppingId);
          // setIsModalOpen(true);
          toggleModalPdf()
        };
        // console.log(selectedShoppingId)
        /********************************FIN delete */
    
  // ******************************EDIT
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedShoppingId, setSelectedShoppingId] = useState(null);

  const toggleModalEdit = () => {
    setIsModalOpen(!isModalOpen)
  }

  const handleEditClick = (shoppingId) => {
    setSelectedShoppingId(shoppingId);
    toggleModalEdit()
  };


  // console.log(selectedShoppingId)
  /********************************FIN EDIT */

    // Lógica de paginación
    const itemsPerPage = 10;
    //fin logica paginacion
  
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [isActive, setIsActive] = useState(false)
    const [hasDataInRange, setHasDataInRange] = useState(false)
    const [showAllData, setShowAllData] = useState(false)
    const [searchByRange, setSearchByRange] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null)
  
    let filteredData = []
    if (filteredPurchase && filteredPurchase.length > 0) {
      if (searchByRange) {
        filteredData = filteredPurchase.filter((item) => {
          const createdAt = new Date(item.createdAt)
          // console.log('fecha1', createdAt)
          if (!startDate || !endDate) {
            return true
          }
          return createdAt >= startDate && createdAt <= endDate
        })
      } else {
        filteredData = filteredPurchase.filter((item) => {
          const createdAt = new Date(item.createdAt)
          // console.log('fecha2...', createdAt)
          if (!selectedDate) {
            return true
          }
          return createdAt.toDateString() === selectedDate.toDateString()
        })
      }
    } else {
      console.error(404)

    }

    useEffect(() => {
      setHasDataInRange(filteredData.length > 0)
    }, [startDate, endDate, selectedDate, filteredPurchase, searchByRange])
  
    // console.log('fec select..', selectedDate)
    const handleStartDateChange = (date) => {
      setStartDate(date)
    }
  
    const handleEndDateChange = (date) => {
      setEndDate(date)
    }
  
    const handleSelectedDateChange = (date) => {
      setSelectedDate(date)
    }
  
    const handleFocus = () => {
      setIsActive(true)
    }
  
    const handleBlur = () => {
      setIsActive(false)
    }
    const handleShowAllData = () => {
      setStartDate(null)
      setEndDate(null)
      setSelectedDate(null)
    }
  
//  AGREGAR CAMBIOS A DEMAS-----------------------
    const handleSearchByRangeChange = () => {
      setSearchByRange(prevState => !prevState); // Alterna el estado
    };
// F............................
  
    //fin logica paginacion
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const [currentPage, setCurrentPage] = useState(1)
  
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage)
    }
  
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const visibleUsuarios = filteredData.slice(startIndex, endIndex)
    //fin logica paginacion



    /*****************************************************************+FILTROS DE DIAS */
    const [selectedDateRange, setSelectedDateRange] = useState([
      {
       startDate: new Date(),
        endDate: addDays(new Date(),7),
        key: 'selection',
      },
    ]);
    useEffect(() => {
 
    }, [selectedDateRange])
    const handleDateChange = (ranges) => {
      setSelectedDateRange([ranges.selection]);
    };

    const filterDataByCurrentDate = (data) => {
      const fechaActual = dayjs();
      const fechaFormateada = fechaActual.format("YYYY-MM-DD");
    
      const filteredData = data.filter((item) => {
        // Convertit createdAt a un formato similar antes de comparar
        const createdAtFormatted = dayjs(item.createdAt).format("YYYY-MM-DD");
        return createdAtFormatted === fechaFormateada;
      });
    
      return filteredData;
    };
    
    const filterDataByDateRange = (data) => {
      const fechaActual = dayjs();
      const numeroSemana = fechaActual.week();
      const fechaInicioSemana = fechaActual.startOf("week");
      const fechaFinSemana = fechaInicioSemana.add(6, "day");
      const fechaInicioFormateada = fechaInicioSemana.format("YYYY-MM-DD");
      const fechaFinFormateada = fechaFinSemana.format("YYYY-MM-DD");
  
      const filteredData = data.filter((item) => {
        const itemDate = item.createdAt;
        return itemDate >= fechaInicioFormateada && itemDate <= fechaFinFormateada;
      });
  
      return filteredData;
    };

    const filterDataByMonth = (jsonData) => {
      const fechaActual = dayjs();
      const fechaInicioMes = fechaActual.startOf("month");
      const fechaFinMes = fechaActual.endOf("month");
      const fechaInicioFormateada = fechaInicioMes.format("YYYY-MM-DD");
      const fechaFinFormateada = fechaFinMes.format("YYYY-MM-DD");
      
      const filteredData = jsonData.filter((item) => {
        const itemDate = item.createdAt;
        return itemDate >= fechaInicioFormateada && itemDate <= fechaFinFormateada;
      });
  
      return filteredData;
    };
    const filterDataBy3Months = (jsonData) => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
  
      const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0);
  
      const startOfTwoMonthsAgo = new Date(currentYear, currentMonth - 2, 1);
  
      return jsonData.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= startOfTwoMonthsAgo && itemDate <= endOfCurrentMonth;
      });
    };

    const filterDataByYear = (jsonData) => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
  
      const startOfYear = new Date(currentYear, 0, 1);
      const endOfYear = new Date(currentYear, 11, 31);
  
      return jsonData.filter(({ createdAt }) => {
        const itemDate = new Date(createdAt);
        return itemDate >= startOfYear && itemDate <= endOfYear;
      });
    };
    
  
    //Funciones para detectar la selección
    const handleChange = (event) => {
      setSelectedOption(event.target.value);
  
      // Verificar el valor seleccionado y ejecutar la función correspondiente
      if (event.target.value === "1") {
        handleOption1();
      }
      if (event.target.value === "2") {
        handleOption2();
      }
      if (event.target.value === "3") {
        handleOption3();
      }
      if (event.target.value === "4") {
        handleOption4();
      }
      if (event.target.value === "5") {
        handleOption5();
      }
      if (event.target.value === "6") {
        handleOption6();
      }
    };
    const handleOption1 = () => {
      // Función para la opción número 1
      setFilteredPurchase(filterDataByMonth(reporteCompras));
    };
    const handleOption2 = () => {
      // Función para la opción número 2
      setFilteredPurchase(filterDataByCurrentDate(reporteCompras));
    };
    const handleOption3 = () => {
      // Función para la opción número 2
      setFilteredPurchase(filterDataByDateRange(reporteCompras));
    };
    const handleOption4 = () => {
      // Función para la opción número 2
      setFilteredPurchase(filterDataBy3Months(reporteCompras));
    };
    const handleOption5 = () => {
      // Función para la opción número 2
      setFilteredPurchase(filterDataByYear(reporteCompras));
    };
    const handleOption6 = () => {
      // Función para la opción número 2
      setFilteredPurchase(reporteCompras);
    };


  return (
    <div className={isOpen ? 'wrapper' : 'side'}>
      <div className="container-fluid mt-4">
        <div className="row p-2">
          <div class="col-lg-7 d-flex col-md-12 order-1 order-lg-1"> 
          <div
              className='search-by-range'
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
              }}
            >
              <div>
                <Button
                  onClick={handleSearchByRangeChange}
                  color={searchByRange ? 'primary' : 'outline-primary'} // Cambia el color según el estado
                  style={{ marginRight: '8px' }}
                >
                  Rango
                </Button>
                <Button style={{
                  marginRight:'5px',
                  backgroundColor: 'transparent', // Quita el relleno
                      color: 'black',
                      border: 'none', // Quita el contorno
                  }} outline color="warning" onClick={handleShowAllData}>
                  X
                </Button>
                
              </div>
              {searchByRange ? (
                <>
                  <div>
                    <DatePicker
                      selected={startDate}
                      onChange={handleStartDateChange}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      className='form-control'
                      placeholderText="Fecha de inicio"
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div style={{ marginLeft: '8px' }}>
                    <DatePicker
                      selected={endDate}
                      onChange={handleEndDateChange}
                      selectsEnd
                      startDate={startDate}
                      className='form-control'
                      endDate={endDate}
                      minDate={startDate}
                      placeholderText="Fecha de fin"
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </div>
                </>
              ) : (
                <DatePicker
                  selected={selectedDate}
                  onChange={handleSelectedDateChange}
                  placeholderText="Fecha"
                  onFocus={handleFocus}
                  className='form-control'
                  onBlur={handleBlur}
                />
              )}
            </div>
            
          </div>
          <div className="col-lg-5 col-md-12 order-2 order-lg-2">
          <SearchInput onSearch={handleSearch} />
          </div>
        </div>

        <div className="row p-2 ">
          <div className="col-4 ">
         
            <Input
              type="select"
              id="exampleSelect"
              name="select"
              value={selectedOption}
              onChange={handleChange}
            >
              <option value="1">Compras del mes</option>
              <option value="2">Compras de hoy</option>
              <option value="3">Compras de la semana</option>
              {/* <option value="4">Gastos de los últimos 3 meses</option> */}
              <option value="5">Compras del año</option>
              <option value="6">Todas las compras</option>
            </Input>
          </div>

          <div className="col-8 d-flex justify-content-end">
            {/* <ModalRegisterUsers fetchUpdatedUsuarios={fetchUpdatedUsuarios} /> */}
            <ModalAddP  Update={getPurchases}/> <br />
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-12">

            <ModalEditP 
            shoppingId={selectedShoppingId}
            Update={getPurchases}
            isOpen={isModalOpen}
            toggle={toggleModalEdit}
            />
            <ModalDeleteP 
            shoppingId={selectedShoppingIdD}
            Update={getPurchases}
            modalOpen={isOpenDel}
            toggleModal={toggleModalDel}
            />

            {/* <PdfPurchase
            purchaseId={selectedPdf}
            modalOpen={isOpenpdf}
            toggleModal={toggleModalPdf}
            
            /> */}

            <TablePurchase 
                       

            data={visibleUsuarios}
          // data1={usuarios}
          // currentPage={currentPage}
          // itemsPerPage={itemsPerPage}
          // status={handleToggleStatus}
          startDate={startDate}
          endDate={endDate}
          isActive={isActive}
          hasDataInRange={hasDataInRange}
          handleShowAllData={handleShowAllData}
          filteredData={visibleUsuarios}
          startIndex={startIndex}
          // updatingIndex={updatingIndex}
          handleEditClick={(shoopingId)=> handleEditClick(shoopingId)}
            handleDelClick={(id) => handleDelClick(id)}
            handlePdfClick={(id)=> handlePdfClick(id)}
            />

            {/* <ToastContainer /> */}
          </div>

          <div className='col-12 d-flex justify-content-end'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          </div>

          <ModalSpinner loading={loading}/>
        </div>        
      </div>
    </div>
  )
}

export default Purchases
