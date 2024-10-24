import React, { useState, useEffect } from 'react'
// import { useStore } from '../providers/GlobalProvider'
import { useStore } from '../../providers/GlobalProvider'
import { Link } from "react-router-dom"
import { FaCartPlus } from "react-icons/fa"
import { TbBrandShopee } from "react-icons/tb"
import Pagination from '../../providers/Pagination'
import SearchInput from '../../providers/InputSearch'
import TableInvenSales from '../../components/inventory/TableInvenSales'
import { Alert, Button } from 'reactstrap'
// import TableInvenProd from '../components/TableInventario'
// import Pagination from '../providers/Pagination'

// import SearchInput from '../providers/InputSearch'

const InventorySales = (props) => {
  const URL = import.meta.env.VITE_URL_API;


  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const isOpen = useStore((state) => state.sidebar);
  useEffect(() => {
    // Para establecer en el módulo en el que nos encontramos
    props.setTitle("Salida");
  }, []);

  const [inventoryprod, setInventoryprod] = useState([])
  const [filteredinvetoryprod, setfilteredProd] = useState([])

  const getInventorypro = async () =>{
    try {
      const response = await fetch(`${URL}/api/allSales`, {
        credentials:'include'
      })
      const data = await response.json()
      setInventoryprod(data);
      setfilteredProd(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getInventorypro();
  }, [])

      const handleSearch = (searchTerm) => {
        if (inventoryprod.length > 0) {
          if (searchTerm === null || searchTerm.trim() === "") {
            setfilteredProd(inventoryprod);
          } else {
            const filtered = inventoryprod.filter((usuario) =>
              usuario.DetailSales.some((data) =>{
                if (data.inventory_product) {
                  return (
                    data?.subtotal.toString().includes(searchTerm.toString()) ||
                    (data?.inventory_product?.Product &&
                      data.inventory_product.Product.name &&
                      data.inventory_product.Product.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                    data?.inventory_product?.Product?.code_product
                      .toString()
                      .includes(searchTerm.toString())
                  );
                } else {
                  return false; // O realiza la lógica adecuada para el caso en que no haya datos de inventory_product
                }
              }
              
              )
            );
            setfilteredProd(filtered);
          }
        } else {
          return(
            <Alert color='danger'>Sin datos</Alert>
          )
        }
      };
      /***  FIN BUSCADOR **** * */
  
  // console.log(filteredinvetoryprod)

      //inicio logica paginacion
      const itemsPerPage = 10;
      const totalPages = Math.ceil(filteredinvetoryprod.length / itemsPerPage)
      const [currentPage, setCurrentPage] = useState(1)
    
      const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
      }
    
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const visibleUsuarios = filteredinvetoryprod.slice(startIndex, endIndex)
      //fin logica paginacion
  return (
    <div className={isOpen ? 'wrapper' : 'side'}>
      <div className="container-fluid mt-4">
        <div className="row p-2">
          {/* <div className="col-7" style={{ display: 'flex' }}>
          datepicker  
          </div> */}
          <div className="col-12 ">{/* BUSCADOR */}
          <SearchInput onSearch={handleSearch} />
          
          </div>
        </div>

        <div className="row p-2">
          <div className="col-4">
          </div>
          <div className="col-4">
          <Link to='/inventoryproduct' className="links">
            <Button color='primary'>Inventario de productos</Button>
            </Link>
          </div>
          <div className="col-4">
          <Link to='/inventorypurchases' className="links">
            <Button color='primary'>Entradas</Button>
            </Link>
          </div>
        </div>

        {/* <div className="row p-2 ">
          <div className="col-6 ">
            select de filtros
          </div>

          <div className="col-6 d-flex justify-content-end">
            registros
          </div>
        </div> */}

        <div className="row mt-4">
          <div className="col-md-12">

            <TableInvenSales data={visibleUsuarios}/>

          </div>

          <div className='col-12 d-flex justify-content-center'>
           <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          /> 
          </div>
        </div>
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
  );
}

export default InventorySales;
