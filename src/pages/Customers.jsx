import React, { useState, useEffect } from 'react'
import { useStore } from '../providers/GlobalProvider'
import { useDispatch, useSelector } from 'react-redux'

import SearchInput from '../providers/InputSearch'
import Pagination from '../providers/Pagination'
import { AiOutlineSearch } from 'react-icons/ai'
import { Alert, Button, Input, Label, Modal, ModalBody, Spinner } from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import TableCustomers from '../components/clientes/TableCliente'
import ModalAddCustomer from '../components/clientes/ModalAddCliente'
import EditModalCustomer from '../components/clientes/ModalEditCliente'
import ModalDeletCustomer from '../components/clientes/ModalDeleteCustomer'
import { ModalSpinner } from '../providers/ModalSpinner'

// import DatePicker from "react-date-picker";
// import DatePicker from 'react-date-picker'


const Customers = (props) => {
  const URL = import.meta.env.VITE_URL_API;

  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const isOpen = useStore((state) => state.sidebar)
  useEffect(() => {
    // Para establecer en el módulo en el que nos encontramos
    props.setTitle('Cliente')
  }, [])

  // const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)

  const [usuarios, setUsuarios] = useState([])
  const userRole = localStorage.getItem('userRole')
  const { isAuth } = useSelector((state) => state.auth)

  const [filteredUsuarios, setFilteredUsuarios] = useState([])

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${URL}/api/allCustomers`, {
        credentials: 'include',
      })
      const data = await response.json()
      setUsuarios(data)
      setFilteredUsuarios(data)
    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)

    }
    
  }

  useEffect(() => {
    if (isAuth && userRole === 'admin') {
      fetchUsuarios()
    }
  }, [isAuth, userRole])




  /***  INICIO BUSCADOR **** * */
  const handleSearch = (searchTerm) => {
    if (usuarios.length > 0) {
      if (searchTerm === null) {
        setFilteredUsuarios(usuarios)
      } else {
        const filtered = usuarios.filter(
          (usuario) =>
            usuario?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario?.dpi.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        setFilteredUsuarios(filtered)
      }
    } else {
      console.error(404)

    }
  }
  /***  FIN BUSCADOR **** * */

  /** INICIO DE  ELIMINAR  */ 
  
  const [
    modalOpen,
    setModalOpen,
  ] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  const handleDelete = async (id_customer) => {
    // Abre el modal de confirmación
    setUserToDelete(id_customer)
    toggleModal()
  }

  const handleDeleteConfirmed = async () => {
    const id_customer = userToDelete
    setLoading(true)

    try {
      const res = await fetch(`${URL}/api/customer/${id_customer}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json()
      // console.log(data.customer)

      toggleModal()
      fetchUsuarios()
      toast.success(`Eliminado correctamente: ${data.customer.name}`, {
        // position: 'bottom-center',
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      setLoading(false)
    } catch (error) {
      console.log(error)
      toast.success(`No se pudo elimininar!!!`, {
        // position: 'bottom-center',
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })

    }
  } 
  //////////////////////////////********************************
  /** FIN DE  ELIMINAR  */ 


    // EDIT  ****************************************************************

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [selectedProvider, setSelectedProvider] = useState({})
  
    const toggleModalEdit = () => setIsModalOpen(!isModalOpen)
  
    const handleEditProvider = (provider) => {
      setSelectedProvider(provider)
      toggleModalEdit()
    } ///////////////////////////////********************************
  
    /** FIN DE  EDITAR */ 


  // Lógica de paginación
  const itemsPerPage = 5
  //fin logica paginacion

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [hasDataInRange, setHasDataInRange] = useState(false)
  const [showAllData, setShowAllData] = useState(false)
  const [searchByRange, setSearchByRange] = useState(false)////////////////AGREGAR CAMBIO
  const [selectedDate, setSelectedDate] = useState(null)

  let filteredData = []
  if (filteredUsuarios && filteredUsuarios.length > 0) {
    if (searchByRange) {
      filteredData = filteredUsuarios.filter((item) => {
        const createdAt = new Date(item.createdAt)
        if (!startDate || !endDate) {
          return true
        }
        return createdAt >= startDate && createdAt <= endDate
      })
    } else {
      filteredData = filteredUsuarios.filter((item) => {
        const createdAt = new Date(item.createdAt)
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
  }, [startDate, endDate, selectedDate, filteredUsuarios, searchByRange])

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
         

          <div className="col-12 d-flex justify-content-end">
            <ModalAddCustomer getProduct={fetchUsuarios} />
          </div>
        </div>

        <ModalDeletCustomer
        toggleModal={toggleModal}
        modalOpen={modalOpen}
        handleDeleteConfirmed={handleDeleteConfirmed}
        
        />

        <EditModalCustomer
        provider={selectedProvider}
        onUpdate={fetchUsuarios}
        isOpen={isModalOpen}
        toggle={toggleModalEdit}
        />

        <div className='col-12'>
        <TableCustomers
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
          handleDelete={(id_supplier_company)=> handleDelete(id_supplier_company)}
          handleEditProvider={handleEditProvider}
        />
        <ToastContainer/>

        </div>
          <div className='col-12 d-flex justify-content-end'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          </div>
              {/* Modal de superposición */}
              <ModalSpinner loading={loading}/>

          
      </div>
    </div>
  )
}

export default Customers
