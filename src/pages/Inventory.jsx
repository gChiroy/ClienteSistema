import React, { useState, useEffect } from 'react'
import { useStore } from '../providers/GlobalProvider'
import { Link } from "react-router-dom"
import { FaCartPlus } from "react-icons/fa"
import { TbBrandShopee } from "react-icons/tb"
import TableInvenProd from '../components/TableInventario'
import Pagination from '../providers/Pagination'
import SearchInput from '../providers/InputSearch'
import { Alert, Button, Input, Label } from 'reactstrap'
import TablaProductos from '../components/inventory/tableCategories'
import { ModalSpinner } from '../providers/ModalSpinner'

const InventoryProduct = (props) => {
  const URL = import.meta.env.VITE_URL_API;

  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const isOpen = useStore((state) => state.sidebar);
  useEffect(() => {
    // Para establecer en el módulo en el que nos encontramos
    props.setTitle("Inventario de Producto");
  }, []);

  const [inventoryprod, setInventoryprod] = useState([])
  const [filteredinvetoryprod, setfilteredProd] = useState([])
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('1'); // 1 = Todos, 2 = Categorías



const [productosPorCategoria, setProductosPorCategoria] = useState({});

useEffect(() => {
  getInventorypro();
}, [viewType]);

const getInventorypro = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${URL}/api/catInv2/${viewType}`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error("Error al obtener los datos del inventario");
    }

    const data = await response.json();

    // Verifica el tipo de respuesta: si es un objeto, es por categoría; si es un array, son todos los productos
    if (viewType === '2') {
      setProductosPorCategoria(data); // Es un objeto con productos por categoría
    } else if (viewType === '1') {
      setInventoryprod(data)
      setfilteredProd(data); // Es un array con todos los productos
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  } finally {
    setLoading(false);
  }
};

 
  // const getInventorypro = async () =>{
  //   setLoading(true)
  //   try {
  //     const response = await fetch(`${URL}/api/catInv2/${viewType}`, {
  //       credentials:'include'
  //     })
  //     const data = await response.json()
  //     // setInventoryprod(data);
  //     // setfilteredProd(data);

  //     if (viewType === '2') {
  //       // Organizar productos por categoría si viewType es 2
  //       const productsByCategory = organizeByCategory(data);
  //       setfilteredProd(productsByCategory);
  //     } else {
  //       // Si es viewType 1, simplemente almacenar todos los productos
  //       setfilteredProd(data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally{
  //     setLoading(false)
  //   }
  // }





  // useEffect(()=>{
  //   getInventorypro();
  // }, [viewType])
  






      /***  INICIO BUSCADOR **** * */
      const handleSearch = (searchTerm) => {
        if (inventoryprod.length > 0) {
          if (searchTerm === null) {
            setfilteredProd(inventoryprod)
          } else {
            const filtered = inventoryprod.filter(
              (usuario) =>
                usuario?.stock.toString().includes(searchTerm.toLowerCase()) ||
                usuario?.total.toString().includes(searchTerm.toLowerCase()) ||
                usuario?.Product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                usuario?.Product?.code_product.toString().includes(searchTerm.toLowerCase())
  
            )
            setfilteredProd(filtered)
          }
        }
      }
      /***  FIN BUSCADOR **** * */
  


  // console.log(filteredinvetoryprod)

      // inicio logica paginacion
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
      const handleSelectChange = (e) => {
        setViewType(e.target.value); // Cambia la vista dependiendo del valor seleccionado
    };
  return (
    <div className={isOpen ? 'wrapper' : 'side'}>
      <div className="container-fluid mb-1">
        <div className="row p-2">
          {/* <div className="col-7" style={{ display: 'flex' }}>
          datepicker  
          </div> */}
          <div className='col-4'>
            <Input type="select" id="viewSelect" value={viewType} onChange={handleSelectChange}>
                <option value="1">Todos los productos</option>
                <option value="2">Por categoría</option>
            </Input>
          </div>
          <div className="col-8 ">{/* BUSCADOR */}
          <SearchInput onSearch={handleSearch} />
          
          </div>
          
        </div>

        <div className="row p-2">
          <div className="col-4">
          </div>
          <div className="col-4">
          <Link to='/inventorysale' className="links">
            <Button color='primary'>Salidas</Button>
            </Link>
          </div>
          <div className="col-4">
          <Link to='/inventorypurchases' className="links">
            <Button color='primary'>Entradas</Button>
            </Link>
          </div>
        </div>
      
          {loading ? (
            <ModalSpinner loading={loading} />
        ) : (
            <div className='row'>
                {viewType === '1' ? (
                    <>
                        <TableInvenProd 
                            // update={getInventorypro}
                            data={visibleUsuarios}
                            startIndex={startIndex}
                        />
                        <div className='col-12 d-flex justify-content-center'>
                            {/* Agrega más contenido aquí si es necesario */}
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                              />
                        </div>
                    </>
                ) : (
                    <>
                        <TablaProductos productosPorCategoria={productosPorCategoria} />
                    </>
                )}
            </div>
        )}

            


        
   
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

export default InventoryProduct;
