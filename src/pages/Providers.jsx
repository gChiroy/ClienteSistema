import React, { useState, useEffect } from 'react'
import { useStore } from '../providers/GlobalProvider'
// import Searchbar from '../components/Searchbar'
import { FcPlus, FcPrint } from 'react-icons/fc'
import { Alert, Button, Input, Label, Table } from 'reactstrap'
import DatePicker from 'react-datepicker'
import SearchInput from '../providers/InputSearch'
import ReactPaginate from 'react-paginate'
// import Pagination1 from '../providers/SegPagination'
import ModalDeletPurchase from '../components/purchases/ModalDeletePurchase'
import EditModal from '../components/purchases/ModalEditPurchase'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ModalRegistCompany from '../components/purchases/companies/ModallAddCompany'
import TableProviders from '../components/purchases/TablePurchases'
import ModalRegistProviders from '../components/purchases/ModalAddPurchase'
import ModalDeletComapny from '../components/purchases/companies/ModalDeleteComapny'
import EditModalCompany from '../components/purchases/companies/ModalEditCompany'
import TableCompanies from '../components/purchases/companies/TableCompanies'
import Pagination from '../providers/Pagination'
import { Link } from 'react-router-dom'
import { ModalSpinner } from '../providers/ModalSpinner'


function Providers(props) {
  const URL = import.meta.env.VITE_URL_API;
  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const isOpen = useStore((state) => state.sidebar)
  useEffect(() => {
    // Para establecer en el módulo en el que nos encontramos
    props.setTitle('Proveedores')
  }, [])
  /* Skeleton para la UI, mientras se carga la data de la API */
  const [isLoading, setIsLoading] = useState(true)
  /* ------ Fetch */
  const [proveedores, setProveedores] = useState([])
  const [filteredUsuarios, setFilteredUsuarios] = useState([])

  // const getProviders = async () => {
  //   try {
  //     setIsLoading(true)
  //     const response = await fetch(`${URL}}/api/providername`, {
  //       credentials: 'include',
  //     })
  //     const json = await response.json()
  //     setProveedores(json)
  //     setFilteredUsuarios(json);//para que cargue los datos al ir a proveedores y no quede vacio la tabla
  //     setIsLoading(false)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // useEffect(() => {
  //   getProviders()
  // }, [])

  




  /** INICIO DE PAGINACION  */ 
  // const [currentPage, setCurrentPage] = useState(1)
  // const [perPage] = useState(10)
  // const [totalProviders, setTotalProviders] = useState(0)

  const getProviders = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${URL}/api/getdelProvider`, {
          credentials: 'include',
        },
      )
      const json = await response.json()
      setProveedores(json)
      setFilteredUsuarios(json) //para que cargue los datos al ir a proveedores y no quede vacio la tabla
      // console.log(json)
      // setTotalProviders(json.totalProviders)
      setIsLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getProviders()
  }, [])

  ///////////////////////////////******************************** ///////////////////////////////********************************

  // useEffect(() => {
  //   getProviders()
  // }, [])



    /***  INICIO BUSCADOR **** * */
    const handleSearch = (searchTerm) => {
      if (proveedores.length > 0) {
        if (searchTerm === null) {
          setFilteredUsuarios(proveedores)
        } else {
          const filtered = proveedores.filter(
            (proveedores) =>
              proveedores?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              proveedores?.phone.toString().includes(searchTerm.toLowerCase()) ||
              proveedores?.nit.toString().includes(searchTerm.toLowerCase()) ||
              (proveedores?.SupplierCompany &&
                proveedores?.SupplierCompany.name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())),
          )
          setFilteredUsuarios(filtered)
        }
      } else {
        console.error(404)

      }
    } ///////////////////////////////********************************
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

  const handleDelete = async (user_id) => {
    // Abre el modal de confirmación
    setUserToDelete(user_id)
    toggleModal()
  }

  const handleDeleteConfirmed = async () => {
    const user_id = userToDelete

    try {
      const res = await fetch(`${URL}/api/provider/${user_id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json()
      // console.log(data)

      toggleModal()
      getProviders()
      toast.success(`Eliminado correctamente: ${data.name}`, {
        // position: 'bottom-center',
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
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



  /***PARA COMPAÑIAS *****************************************************************************************************************/
  const [ companies, setCompanies] = useState([])
  const [filteredUsuariosC, setFilteredUsuariosC] = useState([])



   const getCompanies = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `${URL}/api/allSupplier`,
        {
          credentials: 'include',
        },
      )
      const json = await response.json()
      setCompanies(json)
      setFilteredUsuariosC(json)
      
      // setFilteredUsuarios(json.providers) //para que cargue los datos al ir a proveedores y no quede vacio la tabla
      // setTotalProviders(json.totalProviders)
      setIsLoading(false)
    } catch (error) {
      console.error(error)
    }
  }
  // console.log(comanies)

  useEffect(() => {
    getCompanies()
  }, [])
  

      /***  INICIO BUSCADOR **** * */
      const handleSearchC = (searchTerm) => {
        if (companies.length > 0) {
          if (searchTerm === null) {
            setFilteredUsuariosC(companies)
          } else {
            const filtered = companies.filter(
              (campany) =>
              campany?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              campany?.phone.toString().includes(searchTerm.toLowerCase()) ||
              campany?.address.toString().includes(searchTerm.toLowerCase())
            )
            setFilteredUsuariosC(filtered)
          }
        } else {
          console.error(404)

        }
      } ///////////////////////////////********************************
      /***  FIN BUSCADOR **** * */


// *****************************PARA ELIMINAR**********************************
  /** INICIO DE  ELIMINAR  */ 
  
  const [ modalOpenDelCom, setModalOpenDelCom ] = useState(false)
  const [userComDel, setComDel] = useState(null)

  const toggleDelCom = () => {
    setModalOpenDelCom(!modalOpenDelCom)
  }

  const handleComDelete = async (id_supplier_company) => {
    // Abre el modal de confirmación
    setComDel(id_supplier_company)
    toggleDelCom()
  }

  const handleDeleteConfirmedCom = async () => {
    const id_supplier_company = userComDel

    try {
      const res = await fetch(`${URL}/api/deleteCompany/${id_supplier_company}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json()
      // console.log(data)
      toggleDelCom()
      getCompanies()
      getProviders()
      toast.success(`Compañia eliminada: ${data.company.name}`, {
        // position: 'bottom-center',
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
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
  /************************************************PARA EDITAR */
    // EDIT  ****************************************************************

    const [isModalOpenComEdit, setisModalOpenComEdit] = useState(false)

    const [selectedCompany, setselectedCompany] = useState({})
  
    const toggleModalEditCom = () => setisModalOpenComEdit(!isModalOpenComEdit)
  
    const handleEditCompany = (provider) => {
      setselectedCompany(provider)
      toggleModalEditCom()
    } ///////////////////////////////********************************
  
    /** FIN DE  EDITAR */ 


      /** INICIO PARA CAMBIAR LAS TABLAS */
  const [currentTable, setCurrentTable] = useState(1);
  const handleNextTable = () => {
    setCurrentTable(currentTable === 1 ? 2 : 1);
  };
  /**FIN */


  /*********************DATE PICKER PARA PROVEEDORES */
  // Numero de paginación
  const itemsPerPage = 5

  // const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [hasDataInRange, setHasDataInRange] = useState(false)
  const [searchByRange, setSearchByRange] = useState(false)
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

  const handleSearchByRangeChange = (event) => {
    setSearchByRange(prevState => !prevState); // Alterna el estado
  }


  //inicio logica paginacion
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const [currentPage, setCurrentPage] = useState(1)

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const visibleUsuarios = filteredData.slice(startIndex, endIndex)
  //fin logica paginacion

    /*********************FIN DATE PICKER PARA PROVEEDORES */
/***************************************************************************************** */


      /*********************DATE PICKER PARA COMPAÑIAS */
        // Numero de paginación
  const itemsPerPageC = 5

  // const [date, setDate] = useState(new Date());
  const [startDateC, setStartDateC] = useState(null)
  const [endDateC, setEndDateC] = useState(null)
  const [isActiveC, setIsActiveC] = useState(false)
  const [hasDataInRangeC, setHasDataInRangeC] = useState(false)
  const [searchByRangeC, setSearchByRangeC] = useState(true)
  const [selectedDateC, setSelectedDateC] = useState(null)

  let filteredDataC = []
  if (filteredUsuariosC && filteredUsuariosC.length > 0) {
    if (searchByRangeC) {
      filteredDataC = filteredUsuariosC.filter((item) => {
        const createdAt = new Date(item.createdAt)
        if (!startDateC || !endDateC) {
          return true
        }
        return createdAt >= startDateC && createdAt <= endDateC
      })
    } else {
      filteredDataC = filteredUsuariosC.filter((item) => {
        const createdAt = new Date(item.createdAt)
        if (!selectedDateC) {
          return true
        }
        return createdAt.toDateString() === selectedDateC.toDateString()
      })
    }
  } else {
    console.error(404)

  }
  useEffect(() => {
    setHasDataInRangeC(filteredDataC.length > 0)
  }, [startDateC, endDateC, selectedDateC, filteredUsuariosC, searchByRangeC])

  const handleStartDateChangeC = (date) => {
    setStartDateC(date)
  }

  const handleEndDateChangeC = (date) => {
    setEndDateC(date)
  }

  const handleSelectedDateChangeC = (date) => {
    setSelectedDateC(date)
  }

  const handleFocusC = () => {
    setIsActiveC(true)
  }

  const handleBlurC = () => {
    setIsActiveC(false)
  }
  const handleShowAllDataC = () => {
    setStartDateC(null)
    setEndDateC(null)
    setSelectedDateC(null)
  }

  const handleSearchByRangeChangeC = (event) => {
    setSearchByRangeC(event.target.checked)
  }


  //inicio logica paginacion
  const totalPagesC = Math.ceil(filteredDataC.length / itemsPerPageC)
  const [currentPageC, setCurrentPageC] = useState(1)

  const handlePageChangeC = (newPage) => {
    setCurrentPageC(newPage)
  }

  const startIndexC = (currentPageC - 1) * itemsPerPageC
  const endIndexC = startIndexC + itemsPerPageC
  const visibleUsuariosC = filteredDataC.slice(startIndexC, endIndexC)
  //fin logica paginacion


    /*********************FIN DATE PICKER PARA COMPAÑIAS */
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

          <div className="col-6 p-1 d-flex justify-content-end">
            <Link to='/cat_proveedores' className="links">
          <Button color='primary'>Categoria Proveedores</Button>
          </Link>
          </div>

          <div className="col-6 p-1 d-flex justify-content-end">
            {/* <h4>agregar</h4> */}
            <ModalRegistProviders 
            update={getProviders} 
            updCompanies={getCompanies}
            />
          </div>
        </div>
          
        <div className="row">
          <div className="col-12 d-flex justify-content-center">
            <ModalDeletPurchase
              toggleModal={toggleModal}
              modalOpen={modalOpen}
              handleDeleteConfirmed={handleDeleteConfirmed}
            />

            <ToastContainer />

            <div>
              <EditModal
                provider={selectedProvider}
                onUpdate={getProviders}
                isOpen={isModalOpen}
                toggle={toggleModalEdit}
              />

              <TableProviders
              
                // companies={companies}
                // isLoading={isLoading}
                // filteredUsuarios={filteredUsuarios}
                
                data={visibleUsuarios}
                startDate={startDate}
                endDate={endDate}
                isActive={isActive}
                hasDataInRange={hasDataInRange}
                handleShowAllData={handleShowAllData}
                filteredData={visibleUsuarios}
                startIndex={startIndex}

                handleDelete={(user_id) => handleDelete(user_id)}
                handleEditProvider={handleEditProvider}


                
              />

              {/* <TableProviders/> */}
            </div>
          </div>
          <div className='col-12 d-flex justify-content-end'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          </div>
        </div>
        

        <ModalSpinner loading={isLoading}/>

   
        
      </div>
    </div>
  )
}

export default Providers
