import React, { useState, useEffect } from 'react'
import { useStore } from '../providers/GlobalProvider'
import { useDispatch, useSelector } from 'react-redux'

import SearchInput from '../providers/InputSearch'
import Pagination from '../providers/Pagination'
import { AiFillDelete, AiOutlineSearch } from 'react-icons/ai'
import { Alert, Button, Card, Input, Label, Modal, ModalBody, Spinner, Table } from 'reactstrap'
import TableUsers from '../components/usuarios/TableUsers'
import ModalAddProduct from '../components/products/ModalAddProduct'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FiEdit3 } from 'react-icons/fi'
import ModalDeletProduct from '../components/products/ModalDeletedProduct'
import EditModalCompany from '../components/purchases/companies/ModalEditCompany'
import EditModalProduct from '../components/products/ModalEditProduct'
import TableProduct from '../components/products/TableProducts'
import ModalRegisterCatBran from '../components/products/CategoryBrand/RegisterCatBran'
import { ModalSpinner } from '../providers/ModalSpinner'

function Product(props) {

  const URL = import.meta.env.VITE_URL_API;

  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const isOpen = useStore((state) => state.sidebar)
  useEffect(() => {
    // Para establecer en el módulo en el que nos encontramos
    props.setTitle('Productos')
  }, [])


  // const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  const [products, setProduct] = useState([])
  const userRole = localStorage.getItem('userRole')
  const { isAuth } = useSelector((state) => state.auth)

  const [filteredProduct, setFilteredProduct] = useState([])

  const getProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${URL}/api/allProducts`, {
        credentials: 'include',
      })
      const data = await response.json()
      setProduct(data)
      setFilteredProduct(data)
      //  console.log(data)
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
    
  }

  // useEffect(() => {
  //   if (isAuth && userRole === 'admin') {
  //     getProduct()
  //   }
  // }, [isAuth, userRole])

  // useEffect(() => {

  //   getProduct();

  //   const interval = setInterval(getProduct, 5000); // Fetch data every minute

  //   return () => clearInterval(interval); // Clean up the interval on component unmount

  // }, []);
  useEffect(()=>{
    getProduct();
  }, [])

  // useEffect(() => {
  //   // Realiza una solicitud inicial al cargar la página
  //   getProduct();
  //   // Configura una solicitud periódica cada X segundos (por ejemplo, cada 10 segundos)
  //   const pollingInterval = setInterval(() => {
  //     getProduct();
  //   }, 5000); // Intervalo de 10 segundos

  //   // Limpia el intervalo cuando el componente se desmonta
  //   return () => clearInterval(pollingInterval);
  // }, []);

  //  useEffect(() => {
  //   // Realiza una solicitud inicial al cargar la página
  //   getProduct();
   
  // }, []);

  /***  INICIO BUSCADOR **** * */
  const handleSearch = (searchTerm) => {
    if (products.length > 0) {
      if (searchTerm === null) {
        setFilteredProduct(products)
      } else {
        const filtered = products.filter(
          (product) =>
            product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product?.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product?.category?.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product?.brand?.name.toLowerCase().includes(searchTerm.toLowerCase()),


        )
        setFilteredProduct(filtered)
      }
    } else {
      console.error(404)

    }
  }
  /***  FIN BUSCADOR **** * */

  // *****************************PARA ELIMINAR**********************************
  /** INICIO DE  ELIMINAR  */

  const [modalOpenDelCom, setModalOpenDelCom] = useState(false)
  const [userComDel, setComDel] = useState(null)

  const toggleDelCom = () => {
    setModalOpenDelCom(!modalOpenDelCom)
  }

  const handleComDelete = async (id_product) => {
    // Abre el modal de confirmación
    setComDel(id_product)
    toggleDelCom()
  }

  const handleDeleteConfirmedCom = async () => {
    const id_product = userComDel
    setLoading(true)
    

    try {
      const res = await fetch(
        `${URL}/api/product/${id_product}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      )
      const data = await res.json()
      // console.log(data)
      toggleDelCom()
      // getCompanies()
      getProduct()
      toast.success(`Eliminado correactamente: ${data.product.name}`, {
        // position: 'bottom-center',
        position: 'top-center',
        autoClose: 2000,
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
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }finally{
      setLoading(false)
    }
  }
  //////////////////////////////********************************
  /** FIN DE  ELIMINAR  */

  // EDIT  ****************************************************************

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState({})

  const toggleModalEdit = () => setIsModalOpen(!isModalOpen)

  const handleEditProvider = (product) => {
    setSelectedProduct(product)
    toggleModalEdit()
  } 
  ///////////////////////////////********************************

  /** FIN DE  EDITAR */

  // Lógica de paginación
  const itemsPerPage = 5
  //  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);
  //  const [currentPage, setCurrentPage] = useState(1);

  //  const handlePageChange = (newPage) => {
  //    setCurrentPage(newPage);
  //  };

  //  const startIndex = (currentPage - 1) * itemsPerPage;
  //  const endIndex = startIndex + itemsPerPage;
  //  const visibleUsuarios = filteredUsuarios.slice(startIndex, endIndex);
  //fin logica paginacion

  // const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [hasDataInRange, setHasDataInRange] = useState(false)
  const [showAllData, setShowAllData] = useState(false)
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
  // if (searchByRange) {
  //   filteredData = filteredProduct.filter((item) => {
  //     const createdAt = new Date(item.createdAt)
  //     if (!startDate || !endDate) {
  //       return true
  //     }
  //     return createdAt >= startDate && createdAt <= endDate
  //   })
  // } else {
  //   filteredData = filteredProduct.filter((item) => {
  //     const createdAt = new Date(item.createdAt)
  //     if (!selectedDate) {
  //       return true
  //     }
  //     return createdAt.toDateString() === selectedDate.toDateString()
  //   })
  // }
  if (filteredProduct.length > 0) {
    if (searchByRange) {
      filteredData = filteredProduct.filter((item) => {
        const createdAt = new Date(item.createdAt);
        if (!startDate || !endDate) {
          return true;
        }
        return createdAt >= startDate && createdAt <= endDate;
      });
    } else {
      filteredData = filteredProduct.filter((item) => {
        const createdAt = new Date(item.createdAt);
        if (!selectedDate) {
          return true;
        }
        return createdAt.toDateString() === selectedDate.toDateString();
      });
    }
  }
  else{
    console.error(404)
  }
  useEffect(() => {
    setHasDataInRange(filteredData.length > 0)
  }, [startDate, endDate, selectedDate, filteredProduct, searchByRange])

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

  // const filteredData = visibleUsuarios.filter(item => {
  //   const createdAt = new Date(item.createdAt);
  //   if (!startDate || !endDate) {
  //     return true;
  //   }
  //   return createdAt >= startDate && createdAt <= endDate;
  // });

  // let filteredData = [];
  // if (searchByRange) {
  //   filteredData = filteredUsuarios.filter(item => {
  //     const createdAt = new Date(item.createdAt);
  //     if (!startDate || !endDate) {
  //       return true;
  //     }
  //     return createdAt >= startDate && createdAt <= endDate;
  //   });
  // } else {
  //   filteredData = filteredUsuarios.filter(item => {
  //     const createdAt = new Date(item.createdAt);
  //     if (!selectedDate) {
  //       return true;
  //     }
  //     return createdAt.toDateString() === selectedDate.toDateString();
  //   });
  // };

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
          

          <div className="col-6 p-1 d-flex justify-content-end">
            <ModalRegisterCatBran getProduct={getProduct} />
            {/* <ModalRegisterUsers fetchUpdatedUsuarios={fetchUpdatedUsuarios} /> */}
          </div>
          
          <div className="col-6 p-1 d-flex justify-content-end">
            <ModalAddProduct getProduct={getProduct} />
            {/* <ModalRegisterUsers fetchUpdatedUsuarios={fetchUpdatedUsuarios} /> */}
          </div>
        </div>

        <div className="col-12">
          {/* <TableUsers
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
        /> */}
          <ModalDeletProduct
            toggleModal={toggleDelCom}
            modalOpen={modalOpenDelCom}
            handleDeleteConfirmed={handleDeleteConfirmedCom}
          />

          <EditModalProduct
            provider={selectedProduct}
            onUpdate={getProduct}
            isOpen={isModalOpen}
            toggle={toggleModalEdit}
          />

          <TableProduct 
          // filteredProduct={filteredProduct}
          

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
          handleComDelete = {(e)=> handleComDelete(e)}
          handleEditProvider = { handleEditProvider}
          />

          
          <ToastContainer />
        </div>
        <div className='col-12 d-flex justify-content-center'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          </div>
          <ModalSpinner loading={loading}/>

       
      </div>
    </div>
  )
}

export default Product
