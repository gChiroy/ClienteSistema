import React, { useEffect, useState } from 'react'
// import { useStore } from '../providers/GlobalProvider'

import { useStore } from '../../providers/GlobalProvider'
// import Pagination from '../providers/Pagination'
import Pagination from '../../providers/Pagination'
import { ToastContainer, toast } from 'react-toastify'
import DatePicker from 'react-datepicker'
// import SearchInput from '../providers/InputSearch'
import SearchInput from '../../providers/InputSearch'


import dayjs from 'dayjs'
import addDays from 'date-fns/addDays'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isToday from 'dayjs/plugin/isToday'
import weekday from 'dayjs/plugin/weekday'
import {
  Button,
  Label,
  Input,
  Alert,
} from 'reactstrap'

dayjs.extend(weekOfYear)
dayjs.extend(isToday)
dayjs.extend(weekday)
// dayjs.extend(startOfMonth);
// dayjs.extend(endOfMonth);
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// import '../styles/Select.scss'


import { TableReportBox } from '../../components/report/TableReportBox'
import { ReportPdfBox } from '../../components/PDF/reports/cashBox'

import { ModalSpinner } from '../../providers/ModalSpinner'
import ModalReportBoxWeek from '../../components/PDF/reports/cashBox/ModalReportBoxWeek'
import ModalReportBoxMonth from '../../components/PDF/reports/cashBox/ModalReportBoxMonth'



function ReportCash(props) {
  const URL = import.meta.env.VITE_URL_API;
  useEffect(() => {
    // Para establecer en el módulo en el que nos encontramos
    props.setTitle('Reporte de Caja')
  }, [])
  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const isOpen = useStore((state) => state.sidebar)
  const [loading, setLoading] = useState(false)

  const [sales, setSale] = useState([]);
  const [filteredSales, setFilteredSale] = useState([])
  const [reporteCompras, setReporteCompras] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  const getSales = async() => {
    setLoading(true)
    try {
      const response = await fetch(`${URL}/api/allBox`,{
        credentials:'include',
      })
      const data = await response.json();
      // console.log('Purchass',data);
      setFilteredSale(data.dailybox)
      setSale(data.dailybox)
    //   setSale(filterDataByMonth(data));
      setReporteCompras(data.dailybox);
      setSelectedOption(1);
      
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    getSales()
  }, [])

  // console.log('compras', purchases)

    /***  INICIO BUSCADOR **** * */
    const handleSearch = (searchTerm) => {
      if (sales.length > 0) {
        if (searchTerm === null) {
          setFilteredSale(sales)
        } else {
          const filtered = sales.filter(
            (usuario) =>
            usuario?.initial_balance.toString().includes(searchTerm.toString()) ||
              usuario?.id_daily_box.toString().includes(searchTerm.toString()) 
          )
          setFilteredSale(filtered)
        }
      } else {
        console.error(404)

      }
    }
    /***  FIN BUSCADOR **** * */

    // ******************************Eliminar
    const [isOpenDel, setIsOpenDel] = useState(false)
    const [selectedSaleIdD, setSelectedSaleIdD] = useState(null);
  
    const toggleModalDel = () => {
      setIsOpenDel(!isOpenDel)
    }
  
    const handleDelClick = (shoppingId) => {
      setSelectedSaleIdD(shoppingId);
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
  const [selectedSaleId, setSelectedSaleId] = useState(null);

  const toggleModalEdit = () => {
    setIsModalOpen(!isModalOpen)
  }

  const handleEditClick = (saleId) => {
    setSelectedSaleId(saleId);
    // setIsModalOpen(true);
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

if (filteredSales && filteredSales.length > 0) {
  if (searchByRange) {
    filteredData = filteredSales.filter((item) => {
      const createdAt = new Date(item.createdAt)
      // console.log('fecha1', createdAt)
      if (!startDate || !endDate) {
        return true
      }
      return createdAt >= startDate && createdAt <= endDate
    })
  } else {
    filteredData = filteredSales.filter((item) => {
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
    }, [startDate, endDate, selectedDate, filteredSales, searchByRange])
  
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
      setFilteredSale(filterDataByMonth(reporteCompras));
    };
    const handleOption2 = () => {
      // Función para la opción número 2
      setFilteredSale(filterDataByCurrentDate(reporteCompras));
    };
    const handleOption3 = () => {
      // Función para la opción número 2
      setFilteredSale(filterDataByDateRange(reporteCompras));
    };
    const handleOption4 = () => {
      // Función para la opción número 2
      setFilteredSale(filterDataBy3Months(reporteCompras));
    };
    const handleOption5 = () => {
      // Función para la opción número 2
      setFilteredSale(filterDataByYear(reporteCompras));
    };
    const handleOption6 = () => {
      // Función para la opción número 2
      setFilteredSale(reporteCompras);
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
          <div className="col-4">

    <Input
              type="select"
              id="exampleSelect"
              name="select"
              value={selectedOption}
              onChange={handleChange}
            >
              <option value="1">Caja del mes</option>
              <option value="2">Caja de hoy</option>
              <option value="3">Caja de la semana</option>
              <option value="5">Caja del año</option>
              <option value="6">Todas las Caja</option>
            </Input>
          </div>

          
        </div>
        <div className="row d-flex">
          <div className="col-12 col-md-6 d-flex justify-content-center mb-3 mb-md-0">
          <ModalReportBoxWeek
          />
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-center mb-3 mb-md-0">
          <ModalReportBoxMonth
          />
          </div>
        </div>
        
          
        <div className="row mt-4">
          <div className="col-md-12">

            

            <TableReportBox
                       

            data={visibleUsuarios}
          
          startDate={startDate}
          endDate={endDate}
          isActive={isActive}
          hasDataInRange={hasDataInRange}
          handleShowAllData={handleShowAllData}
          filteredData={visibleUsuarios}
          startIndex={startIndex}
        //   // updatingIndex={updatingIndex}
          handleEditClick={(saleId)=> handleEditClick(saleId)}
            handleDelClick={(id) => handleDelClick(id)}
        //     handlePdfClick={(id)=> handlePdfClick(id)}
            />

            {/* <ToastContainer /> */}
          </div>

          <div className='col-12 d-flex justify-content-center'>
           <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          /> 

          </div>
        </div>
        <ModalSpinner loading={loading}/>
        {/* <Modal isOpen={loading} centered backdrop="static" keyboard={false}>
      <ModalBody className="text-center">
        <Spinner style={{
          height: '3rem',
          width: '3rem'
        }}
        type="grow" color="primary" />
        <p>Guardando...</p>
      </ModalBody>
      </Modal> */}

        
      </div>
    </div>
  )
}

export default ReportCash;
