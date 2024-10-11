import React, { useState, useEffect } from 'react'
import { useStore } from '../providers/GlobalProvider'
import { useDispatch, useSelector } from 'react-redux'

import SearchInput from '../providers/InputSearch'
import Pagination from '../providers/Pagination'
import { AiOutlineSearch } from 'react-icons/ai'
import { Alert, Button, Input, Label } from 'reactstrap'
import TableUsers from '../components/usuarios/TableUsers'
import ModalRegisterUsers from '../components/usuarios/ModalAddUsers'
import { ToastContainer, toast } from 'react-toastify';

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// import DatePicker from "react-date-picker";
// import DatePicker from 'react-date-picker'

import '../styles/Login/style.scss'
import { ModalSpinner } from '../providers/ModalSpinner'

const Users = (props) => {
  const URL = import.meta.env.VITE_URL_API;

  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const isOpen = useStore((state) => state.sidebar)
  useEffect(() => {
    // Para establecer en el módulo en el que nos encontramos
    props.setTitle('Usuarios')
  }, [])

  // const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)

  const [usuarios, setUsuarios] = useState([])
  const userRole = localStorage.getItem('userRole')
  const { isAuth } = useSelector((state) => state.auth)

  const [filteredUsuarios, setFilteredUsuarios] = useState([])
  const [statusParam, setStatusParam] = useState(3); // Valor inicial = 3 (mostrar todos)


  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${URL}/api/getUser/${statusParam}`, {
        credentials: 'include',
      })
      const data = await response.json()
      setUsuarios(data.users)
      setFilteredUsuarios(data.users)
    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)

    }
  }

  // useEffect(() => {
  //   if (isAuth && userRole === 'admin') {
  //     fetchUsuarios()
  //   }
  // }, [isAuth, userRole])

  useEffect(() => {
    if (isAuth && userRole === 'admin') {
      fetchUsuarios(statusParam);  // Pasa el statusParam a la función
    }
  }, [isAuth, userRole, statusParam]);  // Incluye statusParam como dependencia
  
  const handleStatusChange = (e) => {
    setStatusParam(e.target.value); // Actualiza el statusParam cuando se selecciona una opción
  };


  // inicio para cambio de estado
  const handleToggleStatus = async (userId, status, index) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${URL}/api/users/${userId}/controlestado`,
        {
          method: 'PATCH',
          credentials: 'include',
        },
      )

      if (response.ok) {
        // Actualizar el estado
        const updatedUsuarios = [...filteredUsuarios]
        updatedUsuarios[startIndex + index].status = !status // Cambiar el estado localmente
        setFilteredUsuarios(updatedUsuarios)
        toast.success(`Accion con exito`, {
          // position: 'bottom-center',
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        console.error('Error updating status')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error(`No se pudo realizar la accion`, {
        // position: 'bottom-center',
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    finally{
      setLoading(false)
    }
  }
  // fin para cambio de estado

  /***  INICIO BUSCADOR **** * */
  const handleSearch = (searchTerm) => {
    if (usuarios.length > 0) {
      if (searchTerm === null) {
        setFilteredUsuarios(usuarios)
      } else {
        const filtered = usuarios.filter(
          (usuario) =>
            usuario?.users.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario?.rol.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        setFilteredUsuarios(filtered)
      }
    } else {
      console.error(404)

    }
  }
  /***  FIN BUSCADOR **** * */

  const [modalOpen, setModalOpen] = useState(false)

  const [userToDelete, setUserToDelete] = useState(null)

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  const handleDelete = async (user_id, index) => {
    // Abre el modal de confirmación
    setUserToDelete({ user_id, index })
    toggleModal()
  }

  const handleDeleteConfirmed = async () => {
    const { user_id, index } = userToDelete
    setLoading(true)
    try {
      const response = await fetch(
        `${URL}/api/deleteuser/${user_id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      )
      if (response.ok) {
        const newData = [...filteredUsuarios]
        newData.splice(startIndex + index, 1)
        setFilteredUsuarios(newData)
        toggleModal()
        fetchUsuarios()

        toast.success(`Eliminado Correctamente`, {
          // position: 'bottom-center',
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error(error)
      toast.error(`No se pudo eliminar correctamente`, {
        // position: 'bottom-center',
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
    } finally {
      // Cierra el modal después de la eliminación, tanto si tiene éxito como si no
      setLoading(false)
    }
  }

  const fetchUpdatedUsuarios = async () => {
    try {
      const response = await fetch(`${URL}/api/get-users`, {
        credentials: 'include',
      })
      const data = await response.json()
      setFilteredUsuarios(data.users) // Actualiza la lista de usuarios
    } catch (error) {
      console.error(error)
    }
  }

  // Lógica de paginación
  const itemsPerPage = 5

  // const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [hasDataInRange, setHasDataInRange] = useState(false)
  const [showAllData, setShowAllData] = useState(false)
  // const [searchByRange, setSearchByRange] = useState(true)
  const [searchByRange, setSearchByRange] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  // useEffect(() => {
  //   const filteredData = usuarios.filter(item => {
  //     const createdAt = new Date(item.createdAt);
  //     if (!startDate || !endDate) {
  //       return true;
  //     }
  //     return createdAt >= startDate && createdAt <= endDate;
  //   });
  //   setHasDataInRange(filteredData.length > 0);
  // }, [startDate, endDate, usuarios]);

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

  // const handleSearchByRangeChange = (event) => {
  //   setSearchByRange(event.target.checked)
  // }

  const handleSearchByRangeChange = () => {
    setSearchByRange(prevState => !prevState); // Alterna el estado
  };
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
            {/* BUSCADOR */}
            <SearchInput onSearch={handleSearch} />
          </div>
        </div>

        <div className="row p-2 ">
          <div className='col-2 '>
          <Input
              type="select"
              value={statusParam}
              onChange={handleStatusChange}
              className="my-2" // Espaciado vertical
            >
              <option value="3">Todos</option>
              <option value="1">Activos</option>
              <option value="2">Inactivos</option>
            </Input>
          </div>
          <div className="col-10 d-flex justify-content-end">
            <ModalRegisterUsers fetchUpdatedUsuarios={fetchUpdatedUsuarios} />
          </div>
        </div>

  

        <div className='col-12'>
        <TableUsers
          data={visibleUsuarios}
          // data1={usuarios}
          // currentPage={currentPage}
          // itemsPerPage={itemsPerPage}
          // status={handleToggleStatus}
          status={(userId, status, index) => handleToggleStatus(userId, status, index)}
          toggleModal={toggleModal}
          modalOpen={modalOpen}
          handleDelete={(user_id, index) => handleDelete(user_id, index)}
          handleDeleteConfirmed={handleDeleteConfirmed}
          fetchUpdatedUsuarios={fetchUpdatedUsuarios}
          startDate={startDate}
          endDate={endDate}
          isActive={isActive}
          hasDataInRange={hasDataInRange}
          handleShowAllData={handleShowAllData}
          filteredData={visibleUsuarios}
          startIndex={startIndex}
          // updatingIndex={updatingIndex}
        />
        <ToastContainer/>
        <ModalSpinner loading={loading}/>

        

        </div>
          <div className='col-12 d-flex justify-content-center'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          </div>
          
      </div>
    </div>
  )
}

export default Users
