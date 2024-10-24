import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

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
  Row,
  Col,
  CardImg,
  CardTitle,
  CardText,
} from 'reactstrap'

dayjs.extend(weekOfYear)
dayjs.extend(isToday)
dayjs.extend(weekday)
// dayjs.extend(startOfMonth);
// dayjs.extend(endOfMonth);

import { AiTwotoneCheckSquare, AiOutlineCheck } from 'react-icons/ai'

import { TiDeleteOutline } from 'react-icons/ti'
import { BsPlusCircle, BsDashCircle } from 'react-icons/bs'
import { RiEditCircleFill } from 'react-icons/ri'
import { IoIosAddCircle } from 'react-icons/io'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { ModalSpinner } from '../../providers/ModalSpinner'
import SearchInput from '../../providers/InputSearch'
import { GiCancel } from 'react-icons/gi'
import { MdFileDownloadDone } from 'react-icons/md'

const ModalAddS = (props) => {
  const URL = import.meta.env.VITE_URL_API;
 const { Update } = props;
  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    proforma_number: '',
    customerId: '',
    tax: '',
    details: [],
  })

  const [status, setStatus] = useState(null)

  useEffect(() => {
    fetch(`${URL}/api/status`,{
      credentials:'include'
    })
      .then((response) => response.json())
      .then((data) => {
        setStatus(data.status);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [status]);

  const [customer, setCustomer] = useState([])
  const [amount, setAmount] = useState(0)
  const [purchasePrice, setPurchasePrice] = useState(0)
  const [discount, setDiscount] = useState(0)


  const [products, setProducts] = useState([])
  const [filteredproducts, setfilteredProducts] = useState([])

  // descomnet si no funciona
  // const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState([])

  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenPur, setModalOpenPur] = useState(false)
  const toggleModal = () => setModalOpenPur(!modalOpenPur)


  const getProduct = async () => {
    // setLoading(true);
    try {
      const response = await fetch(`${URL}/api/allInventorySales`, {
        credentials: 'include',
      })
      const data = await response.json()
      setProducts(data)
      setfilteredProducts(data)
      // console.log(data)
    } catch (error) {
      console.log(error)
    }
    // finally{
    //   setLoading(false)
    // }
  }

  useEffect(() => {
    getProduct()
  }, [])

  const [selectedProvider, setSelectedProvider] = useState(null)
  const [isRegisterButtonDisabled, setIsRegisterButtonDisabled] = useState(true)
  const getCustomer = async () => {
    try {
      const response = await fetch(`${URL}/api/allCustomers`, {
        credentials: 'include',
      })

      const data = await response.json()
      setCustomer(data)
      // console.log('Proveedores', data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCustomer()
  }, [])

  const handleProviderChange = (event, newValue) => {
    setSelectedProvider(newValue)
    setIsRegisterButtonDisabled(!newValue); // Deshabilita el botón si no hay un proveedor seleccionado

    if (newValue) {
      // Actualiza provider_id en formData con el id del proveedor seleccionado
      setFormData({
        ...formData,
        customerId: newValue.id_customer.toString(), // Asegúrate de convertirlo a cadena
      })
      setIsRegisterButtonDisabled(false) // Habilitar el botón
      // setIsRegisterButtonDisabled(!newValue);

    } else {
      // Si se deselecciona un proveedor, establece provider_id en vacío
      setFormData({
        ...formData,
        customerId: '',
      })
      setIsRegisterButtonDisabled(true) // Deshabilita el botón
      // setIsRegisterButtonDisabled(!newValue);

    }
    // setIsRegisterButtonDisabled(!newValue);
  }



  const handleRegisterProvider = () => {
    if (selectedProvider) {
      // selectedProvider contiene el objeto del proveedor seleccionado
      // Puedes acceder a selectedProvider.id para obtener el id_provider
      const idProvider = selectedProvider.id_customer
      // console.log('ID del cliente seleccionado:', idProvider)

      // También puedes acceder a formData.provider_id para obtener el id_provider seleccionado
      // console.log('formData.customerId:', formData.customerId)

      // Luego, puedes realizar la acción de registro aquí utilizando el idProvider o formData.provider_id
      setIsRegisterButtonDisabled(true)
    } else {
      console.log('Ningún proveedor seleccionado.')
    }
  }

  const [editIndex, setEditIndex] = useState(-1)
  const [addedProducts, setAddedProducts] = useState([])
  // const [isProductSelected, setIsProductSelected] = useState(false);

  const isProductAdded = (productId) => {
    return addedProducts.includes(productId)
  }

  const isProductSelected = (productId) => {
    // return selectedProduct && selectedProduct.id_product === productId;
    return selectedProduct.some((product) => product.id_inventory === productId)
  }

  const handleEditClick = (index) => {
    setEditIndex(index)
  }

  const handleSaveClick = () => {
    // Copiar los detalles actuales y actualizar el detalle editado
    const updatedDetails = [...formData.details]
    updatedDetails[editIndex] = {
      ...updatedDetails[editIndex],
      amount,
      discount,
    }

    const detail = updatedDetails[editIndex];
    const subtotal =
      (parseFloat(amount) * parseFloat(detail.producto.public_price.toFixed(2))) -
      parseFloat(discount || 0);
  
    updatedDetails[editIndex] = {
      ...detail,
      subtotal: subtotal.toFixed(2), // Almacenar el subtotal en el detalle
    };

//actializar la tabla
    setFormData({
      ...formData,
      details: updatedDetails,
    })

    // Reiniciar el estado de edición
    setEditIndex(-1)

  const total = updatedDetails.reduce((acc, detail) => {
    return acc + (parseFloat(detail.amount) * parseFloat(detail.producto.public_price) - parseFloat(detail.discount || 0));
  }, 0);
  
    // Actualizar el estado del total
    setTotal(total);
  }


  const [labelResult, setLabelResult] = useState(''); 
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Verificar si el campo es 'tax' (el campo de entrada que quieres multiplicar)
    if (name === 'tax') {
      // Convertir el valor de 'tax' a decimal temporalmente (dividir por 100)
      const taxAsDecimal = parseFloat(value) / 100;
  
      // Realizar la multiplicación con el valor de 'total' y el valor convertido a decimal
      const newValue = (taxAsDecimal * total) + total; // Asegúrate de que 'total' sea el valor correcto
  
      // Almacenar el valor convertido y multiplicado en el estado
      setFormData({ ...formData, [name]: value, taxAsDecimal }); // taxAsDecimal es opcional si deseas conservar el valor convertido
  
      // Actualizar el label con el resultado
      setLabelResult(newValue.toFixed(2) );
    } else {
      // Si no es el campo 'tax', actualizar el estado como lo hacías antes
      setFormData({ ...formData, [name]: value });
  
      // Puedes restablecer el label aquí si lo necesitas
      setLabelResult('');
    }
  }
  


  const [details, setDetails] = useState([]);
  const [total, setTotal] = useState(0); // Estado para el total de la factura


  const addProductToDetails = () => {
    // if (selectedProduct && !isProductAdded(selectedProduct.id_product)) {
    // if(selectedProduct.length > 0){
      const newDetail = selectedProduct.map((selectedProduct) => ({
        // id: `temp-${Math.random()}`,
        product_id: selectedProduct.id_inventory,
        producto: selectedProduct, 
        amount: '',
        discount: 0,
      }))
  
      setFormData({
        ...formData,
        details: [...formData.details, ...newDetail],
      })

      // Agregar los productos a la lista de productos agregados
      const newAddedProducts = selectedProduct.map(
        (selectedProduct) => selectedProduct.id_inventory,
      )
      setAddedProducts([...addedProducts, ...newAddedProducts])
      
      

      setSelectedProduct([])
      setModalOpen(false)
  
      // Reiniciar los valores
      setAmount(0)
      // setPurchasePrice(0)
      setDiscount(0)
    // }
    // setIsProductSelected(false)
    // setSelectedProduct(null);
    // setSelectedProduct([])

    // }
  }

      // Función para calcular el subtotal de un detalle
      const calculateSubtotal = (detail) => {
        return detail.amount - detail.discount;
      };
  
  
    useEffect(() => {
      // Calcula el total inicial cuando se carga la página (por si ya hay detalles)
      const initialTotal = details.reduce((acc, detail) => {
        return acc + calculateSubtotal(detail);
      }, 0);
      setTotal(initialTotal);
    }, []);

  const deleteDetail = (id) => {
    const productIdToDelete = formData.details.find(
      (detail) => detail.producto.id_inventory === id)?.producto.id_inventory

    if (productIdToDelete) {
      // Eliminar el producto del conjunto setAddedProducts
      //setAddedProducts((prevProducts) => prevProducts.filter((productId) => productId !== productIdToDelete));
      setAddedProducts(
        addedProducts.filter((productId) => productId !== productIdToDelete),
      )
    }

    const updatedDetails = formData.details.filter(
      (detail) => detail.producto.id_inventory !== id,
    )
    setFormData({
      ...formData,
      details: updatedDetails,
    })
  }

  // console.log('ya: ', addedProducts)

  const handleProductClick = (product) => {
    const productId = product.id_inventory


    if (isProductSelected(productId)) {
      const updatedSelectedProducts = selectedProduct.filter(
        (selectedProduct) => selectedProduct.id_inventory !== productId,
      )
      setSelectedProduct(updatedSelectedProducts)
    } else {
      setSelectedProduct([...selectedProduct, product])
    }
  }

  const [nextProNumber, setNextProNumber] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${URL}/api/sale`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      // if (!response.ok) {
      //   throw new Error(Error)
      // }
      const data = await response.json()
      // console.log(data)
      if (response.ok) {
        setAddedProducts([]); 
        setLabelResult('')
        setTotal(0)
        setFormData({ customerId: '', tax:'', details: [] })
        setNextProNumber(data.proforma_number); 
        toggleModal()
        // update()
        Update()
  
         toast.success(`Se registró correctamente`/**${formData.bill_number} */, {
          // position: 'bottom-center',
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

      } else {
        toast.error(`${data.errors[0].msg}`/**${data.errors[0].msg} */, {
          // position: 'bottom-center',
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  


  // Realiza una solicitud al backend para obtener el próximo número de factura
  useEffect(() => {
    fetch(`${URL}/api/proform`, {
      method: "GET",
      credentials:'include'
    })
      .then((response) => response.json())
      .then((data) => {
        setNextProNumber(data.proforma_number);
      })
      .catch((error) => {
        console.error("Error al obtener el próximo número de factura", error);
      });
  }, [nextProNumber]);
  // console.log("can",amount, 'prec', purchasePrice, 'desc:',discount )


      /***  INICIO BUSCADOR **** * */
      // const handleSearch = (searchTerm) => {
      //   if (searchTerm === null) {
      //     setfilteredProducts(products)
      //   } else {
      //     const filtered = products.filter(
      //       (product) =>
      //       product.stock.toString().includes(searchTerm.toLowerCase()) ||
      //       product.public_price.toString().includes(searchTerm.toLowerCase()) 
      //     )
      //     setfilteredProducts(filtered)
      //   }
      // }
      
      const handleSearch = (searchTerm) => {
        if (products.length > 0) {
          if (searchTerm === null) {
            setfilteredProducts(products)
          } else {
            const filtered = products.filter(
              (product) =>
              product.Product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (product.Product?.detail?.toLowerCase() || "").includes(searchTerm.toLowerCase())||
              // product.Product.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
              // product.code_product.toString().includes(searchTerm.toLowerCase()) 
              product.Product?.code_product?.toString().includes(searchTerm.toLowerCase()) ||
              product.Product?.brand && product.Product.brand.name !== null && product.Product.brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              product.Product?.category && product.Product.category.type !== null && product.Product.category.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
              // (usuario.total !== null && usuario.total.toString().includes(searchTerm.toLowerCase()))
              product?.stock?.toString().includes(searchTerm.toLowerCase()) ||
              product?.public_price?.toString().includes(searchTerm.toLowerCase()) 
            )
            setfilteredProducts(filtered)
          }
        }
        else{
          console.error(404)
        }
      }


      const cancelEdit = (index) => {
        // Restablece los valores de los inputs a los valores originales
        setAmount(null);
        // setPurchasePrice(null);
        setDiscount(null);
      
        // Restablece el índice de edición
        setEditIndex(-1);
      }

  return (
    <>
      

        <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
        >
        <Button 
              disabled={!status}
              color="primary" 
              onClick={() => setModalOpenPur(true)}
              >
                Registrar venta
              </Button>
        </div>
        
        <div>
        <Modal 
        isOpen={modalOpenPur} 
        toggle={()=>setModalOpenPur}
        size='xl'
        fade={true}
        fullscreen
        >
                <ModalHeader toggle={() => setModalOpenPur(!modalOpenPur)}>
                  Registrar Ventas
                </ModalHeader>
                <ModalBody>
                <Card className="rounded">
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-6">
                    <FormGroup>
                    <TextField
                      // value={proforma_number || ""}
                      // onChange={handleInputChange}
                      name='bill_number'
                      required
                      // disabled
                      onChange={(e) => setFormData({ ...formData, bill_number: e.target.value })}
                      label="Factura"
                      variant="standard"
                    />
                  </FormGroup>
                    </div>
                    <div className="col-6">
                    <FormGroup>

                    <div className="d-flex " style={{ alignItems: 'center' }}>
                      <Autocomplete
                        id="combo-box-demo"
                        options={customer}
                        getOptionLabel={(option) => option.name}
                        onChange={handleProviderChange}
                        style={{ width: '300px' }}
                        value={selectedProvider}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Cliente"
                            variant="standard"
                          />
                        )}
                      />

                      <Button
                        onClick={handleRegisterProvider}
                        disabled={isRegisterButtonDisabled}
                        color="primary"
                        style={{
                          cursor: 'pointer',
                          backgroundColor: 'transparent', // Quita el relleno
                          color: 'black',
                          border: 'none', // Quita el contorno
                          }}
                      >
                        <MdFileDownloadDone />
                      </Button>
                    </div>
                    </FormGroup>
                    </div>

                  </div>
                  
             
                  <FormGroup>
                    <div style={{ display: 'flex' }}>
                      <div>
                        <Button
                          title='Agregar detalle'
                          color="success"
                          className='mb-1'
                          onClick={() => setModalOpen(true)}

                        >
                          Agregar producto
                        </Button>
                      </div>
                    </div>

                    {formData.details && formData.details.length > 0 ? (
                      <>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Detalle</th>
                            <th>Cateogoria</th>
                            <th>Cantidad</th>
                            <th>Precio Publico</th>
                            <th>Disponible</th>
                            <th>Descuento</th>
                            <th>Subtotal</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.details.map(
                            (detail, index) =>
                              // Verificar que los campos relevantes no estén en blanco o en valores por defecto
                              (detail.product_id ||
                                detail.amount ||
                                detail.discount) && (
                                <tr key={index}>
                                  <td>{/*si coloco solo detail.product((producto es la que se define en newDetail)trae todos los datos de inventario, para ingresar a producto debe ponerse detail.producto.Product)*/}
                                    {detail.product_id}- <b>{detail.producto.Product.code_product}</b> - {detail.producto.Product.name}
                                  </td>
                                  <td>{detail.producto?.Product ? detail.producto.Product.detail : 'NA'}</td>
                                  <td>{detail.producto.Product.category ?(detail.producto.Product.category.type ? detail.producto.Product.category.type : <p style={{color:'red'}}>Sin categoría</p>): <p style={{color:'red'}}>Sin categoría</p>}</td>

                                  <td>
                                    {editIndex === index ? (
                                      <input
                                        type="number"
                                        value={amount}
                                        className='form-control'
                                        onChange={(e) =>
                                          setAmount(e.target.value)
                                        }
                                        style={{maxWidth: '5rem'}}
                                      />
                                    ) : (
                                      detail.amount
                                    )}
                                  </td>
                                  <td>{detail.producto.public_price.toFixed(2)}</td>
                                  <td>{detail.producto.stock}</td>
                                  <td>
                                    {editIndex === index ? (
                                      // <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} />
                                      <input
                                        type="number"
                                        // value={discount || '0'}
                                        value={discount || 0}
                                        className='form-control'
                                        onChange={(e) =>
                                          setDiscount(e.target.value)
                                        }
                                        style={{maxWidth: '5rem'}}
                                        
                                      />
                                    ) : (
                                      detail.discount
                                    )}
                                  </td>
                                  <td>
                                    {(detail.amount * detail.producto.public_price) -detail.discount}

                                  </td>
                                  <td>
                                    {editIndex === index ? (
                                      <>
                                      <Button
                                        color="success"
                                        title='save'
                                        style={{
                                          cursor: 'pointer',
                                          backgroundColor: 'transparent', // Quita el relleno
                                          color: 'black',
                                          border: 'none', // Quita el contorno
                                          }}
                                        onClick={handleSaveClick}
                                      >
                                        <AiOutlineCheck />
                                      </Button>
                                      <Button
                                      color="danger"
                                      title='cancel'
                                      style={{
                                        cursor: 'pointer',
                                        backgroundColor: 'transparent', // Quita el relleno
                                        color: 'black',
                                        border: 'none', // Quita el contorno
                                        }}
                                      onClick={() => cancelEdit(detail.producto.id_inventory)}
                                    >
                                      <GiCancel/>
                                    </Button>
                                      </>
                                    ) : (
                                      <>
                                        <Button
                                          color="primary"
                                          title='edit'
                                          style={{
                                            cursor: 'pointer',
                                            backgroundColor: 'transparent', // Quita el relleno
                                            color: 'black',
                                            border: 'none', // Quita el contorno
                                            }}
                                          onClick={() => handleEditClick(index)}
                                        >
                                          <RiEditCircleFill size={20} />
                                        </Button>
                                        <Button
                                          color="danger"
                                          title='delete'
                                          style={{
                                            cursor: 'pointer',
                                            backgroundColor: 'transparent', // Quita el relleno
                                            color: 'black',
                                            border: 'none', // Quita el contorno
                                            }}
                                          onClick={() =>
                                            deleteDetail(
                                              detail.producto.id_inventory
                                            )
                                          }
                                        >
                                          <TiDeleteOutline size={20} />
                                        </Button>
                                      </>
                                    )}
                                  </td>
                                </tr>
                              ),
                          )}
                          <tr>
                            <td colSpan='7'><b>Total lbre de impuesto</b></td>
                            <td>
                            <TextField
                              value={total} // Asegúrate de utilizar el campo 'tax' del estado
                              disabled
                       
                              variant="standard"
                              InputProps={{
                                disableUnderline: true, // Deshabilita la línea inferior
                              }}
                              style={{maxWidth: '5rem'}}
                            />
                            
                            </td>
                          </tr>
                          <tr>
                            <td colSpan='7'><b>IVA</b></td>
                            <td>
                            <TextField
                              onChange={handleInputChange}
                              name='tax'
                              id='tax'
                              // onChange={(e) => setFormData({ ...formData, bill_number: e.target.value })}
                              variant="standard"
                              style={{maxWidth: '5rem'}}
                              
                            />
                            </td>
                          </tr>
                          <tr>
                            <td colSpan='7'><b>TOTAL</b></td>
                            <td>
                            <TextField
                              value={labelResult || ''} // Asegúrate de utilizar el campo 'tax' del estado
                              disabled
                              variant="standard"
                              InputProps={{
                                disableUnderline: true, // Deshabilita la línea inferior
                              }}
                              style={{maxWidth: '5rem'}}
                            />
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                      <Card>
                      <CardBody className='d-flex justify-content-end align-items-center'>
                      <div >
                     
                      </div>
                      </CardBody>
                    </Card>

                      </>
                    ) : (
                      <>
                        <Alert color="danger">
                          <p>No hay productos</p>
                        </Alert>
                      </>
                    )}

                    {/* <Button onClick={() => setModalOpen(true)}></Button> */}
                  </FormGroup>

                  <div className='d-flex justify-content-center p-2'>
                    <Button className='mx-1' color="danger" 
                        onClick={()=>setModalOpenPur(false)}          >
                        Cancelar
                    </Button>
                    <Button
                    
                        color="success"
                        
                        // onClick={(e) => handleSubmit(e)}
                        // onClick={handleSubmit(e)}
                        // onClick={(e) => handleSubmit(e)}
                        type="submit"
                        disabled={!formData.customerId || formData.details.length === 0}

                    >
                        Registrar
                    </Button>
          </div>
                </Form>

                <ToastContainer/>
                <ModalSpinner loading={loading}/>

              </CardBody>
            </Card>

                  
                </ModalBody>
                
              </Modal>
        </div>

            <div>
              {/* PARA SELECCIONAR UN PRODUCTO AL HACER AGREGAR DETALLE */}
              <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} >
                <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
                  Selecciona un producto
                </ModalHeader>
                {/* <ModalFooter>
                  
                </ModalFooter> */}
                <ModalBody>
                  <div className='container'>
                    <div className='row'>
                      <div className='col-12'>
                      <SearchInput onSearch={handleSearch} />
                      </div>
                      <div className='col-12 d-flex justify-content-start  p-2'>
                      <Button className='mx-1' color="primary" onClick={addProductToDetails}>
                        Agregar
                      </Button>
                      <Button color="danger" onClick={() => setModalOpen(false)}>
                        Volver
                      </Button>
                      </div>
                    <div className='row'>
                      <div className='col-12'>
                    
                  {filteredproducts.length > 0 ? ( 
                    <>
                     {
                    filteredproducts.map((product, index) => {
                      // Definir el color de la fila según las condiciones
                      let rowColor = 'lightcoral'; // Rojo por defecto (no está seleccionado)
                      
                      if (isProductAdded(product.id_inventory)) {
                        rowColor = 'lightblue'; // azul si ya está agregado
                      } else if (isProductSelected(product.id_inventory)) {
                        rowColor = 'lightgreen'; // Verde si ha sido seleccionado
                      } else if(product.stock <= 0){
                        rowColor = 'black';
                      }

                      return (
                        <Card key={index} 
                        style={{ borderColor: rowColor,  borderWidth: '5px',
                          borderStyle: 'solid', cursor: 'pointer' }} 
                        className="mb-2 shadow-sm"
                        onClick={() => {
                          // if (!isProductAdded(product.id_inventory)) {
                          //   handleProductClick(product); // Cambia a verde al seleccionar
                          // }

                          if (product.stock > 0 && !isProductAdded(product.id_inventory)) {
                            handleProductClick(product);
                          }
                        }} 
                  
                        >
                        <Row className="no-gutters">
                        <Col xs="12" md="4" className="d-flex align-items-center justify-content-center p-1" style={{ minHeight: '100px' }}>                            {product.Product?.url_product ? (
                              // <CardImg top src={product.Product.url_product} alt="Imagen del producto" className="h-80 m-2 d-flex" style={{minHeight: '100px'}}/>
                              <div className="h-80 d-flex align-items-center justify-content-center">
                                <CardImg 
                                  src={product.Product.url_product} 
                                  alt="Imagen del producto" 
                                  style={{
                                    maxWidth: '80%',
                                    maxHeight: '80%',
                                    objectFit: 'contain'
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="text-center d-flex align-items-center justify-content-center h-50" style={{minHeight: '40px'}}>
                                <span>Sin imagen</span>
                              </div>
                            )}
                            
                          </Col>
                          <Col >
                            <CardBody>
                              <CardTitle tag="h5" className="mb-1 text-center">
                                <b>{product.Product?.name}</b>
                                {!isProductAdded(product.id_inventory) ? (
                                          <input
                                            type="checkbox"
                                            className='mx-2'
                                            checked={isProductSelected(product.id_inventory)}
                                          />
                                        ) : (
                                          <input
                                            type="checkbox"
                                            checked={true}
                                            className='mx-2'
                                            disabled
                                          />
                                        )}
                                </CardTitle> 
                              <CardText>
                                <strong>Código:</strong> {product.Product?.code_product}  <strong>Disponible:</strong> {product.stock}<br/>
                                <strong>Precio Público:</strong> Q{product.public_price.toFixed(2)}<br/>
                                {/* <strong>Disponible:</strong> {product.stock}<br/> */}
                                <strong>Categoría:</strong> {product.Product?.category?.type || 'N/A'}<br/>
                                <strong>Detalle:</strong> {product.Product?.detail}
                              </CardText>
                            </CardBody>
                          </Col>
                        </Row>
                      </Card>
                      );
                    })
                  }
                    </>
                  ) : (
                    <Alert color='danger'>no hay datos</Alert>
                  )

                  }

                      </div>
                    </div>
                    </div>
                  </div>
                </ModalBody>
              </Modal>
            </div>      
       
      
    </>
  )
}

export default ModalAddS;
