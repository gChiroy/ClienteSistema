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
import { MdFileDownloadDone } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'

const ModalAddP = (props) => {
  const URL = import.meta.env.VITE_URL_API;
      /*Realizar accion si caja esta abierta*/
      const [status, setStatus] = useState(null)

      useEffect(() => {
        fetch(`${URL}/api/status`, {
          credentials: 'include'
        })
          .then((response) => response.json())
          .then((data) => {
            setStatus(data.status);
          })
          .catch((error) => {
            console.error(error);
          });
      }, [status]);
       /*fin */
 const { Update } = props;
  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    // bill_number: '',
    provider_id: '',
    // details: [{
    //   //id: 'temp-1',
    //     id_product: "",
    //     amount: "",
    //     purchase_price: "",
    //     discount: "",
    //   }],
    details: [   // Otros detalles temporales
    ],
  })

  const [provider, setProvider] = useState([])
  const [amount, setAmount] = useState(0)
  const [purchasePrice, setPurchasePrice] = useState(0)
  const [salePrice, setSalePrice] = useState(0)
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
      const response = await fetch(`${URL}/api/allProducts`, {
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
  const getProvider = async () => {
    try {
      const response = await fetch(`${URL}/api/getdelProvider`, {
        credentials: 'include',
      })

      const data = await response.json()
      setProvider(data)
      // console.log('Proveedores', data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getProvider()
  }, [])

  const handleProviderChange = (event, newValue) => {
    setSelectedProvider(newValue)
    setIsRegisterButtonDisabled(!newValue); // Deshabilita el botón si no hay un proveedor seleccionado

    if (newValue) {
      // Actualiza provider_id en formData con el id del proveedor seleccionado
      setFormData({
        ...formData,
        provider_id: newValue.id_provider.toString(), // Asegúrate de convertirlo a cadena
      })
      setIsRegisterButtonDisabled(false) // Habilitar el botón
      // setIsRegisterButtonDisabled(!newValue);

    } else {
      // Si se deselecciona un proveedor, establece provider_id en vacío
      setFormData({
        ...formData,
        provider_id: '',
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
      const idProvider = selectedProvider.id_provider
      // console.log('ID del proveedor seleccionado:', idProvider)

      // También puedes acceder a formData.provider_id para obtener el id_provider seleccionado
      // console.log('formData.provider_id:', formData.provider_id)

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

  // const isProductSelected = (productId) => {
  //   // return selectedProduct && selectedProduct.id_product === productId;
  //   return selectedProduct.some((product) => product.id_product === productId)
  // }
  const isProductSelected = (id_product) => {
    return selectedProduct.some((p) => p.id_product === id_product);
  };

  const handleEditClick = (index) => {
    setEditIndex(index)
  }

  const handleSaveClick = () => {
    // Copiar los detalles actuales y actualizar el detalle editado
    const updatedDetails = [...formData.details]
    updatedDetails[editIndex] = {
      ...updatedDetails[editIndex],
      amount,
      purchase_price: purchasePrice,
      sale_price: salePrice,
      discount,
    }

    setFormData({
      ...formData,
      details: updatedDetails,
    })

    // Reiniciar el estado de edición
    setEditIndex(-1)

    const total = updatedDetails.reduce((acc, detail) => {
      return (
        acc +
        detail.amount * detail.purchase_price -
        (detail.discount || 0) // Si el descuento está vacío, se considera 0
      );
    }, 0);
  
    // Actualizar el estado del total
    setTotal(total);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // const addProductToDetails = () => {
  //   if (selectedProduct) {
  //     const newDetail = {
  //       product_id: selectedProduct.name,
  //       amount: 1, // You can set a default amount here
  //       purchase_price: selectedProduct.price,
  //       discount: 0, // You can set a default discount here
  //     };

  //     setFormData({
  //       ...formData,
  //       details: [...formData.details, newDetail],
  //     });

  //     setSelectedProduct(null);
  //     setModalOpen(false);
  //   }
  // };
  const [details, setDetails] = useState([]);
  const [total, setTotal] = useState(0); // Estado para el total de la factura


  const addProductToDetails = () => {


    // if(selectedProduct.length > 0){
      const newDetail = selectedProduct.map((selectedProduct) => ({
        // id: `temp-${Math.random()}`,
        id_product: selectedProduct.id_product,
        producto: selectedProduct, 
        amount: '',
        purchase_price: '',
        discount: 0,
      }))
  
      setFormData({
        ...formData,
        details: [...formData.details, ...newDetail],
      })

      const newAddedProducts = selectedProduct.map(
        (selectedProduct) => selectedProduct.id_product,
      )
      setAddedProducts([...addedProducts, ...newAddedProducts])
    
      setSelectedProduct([])
      setModalOpen(false)
  
      // Reiniciar los valores
      setAmount(0)
      setPurchasePrice(0)
      setSalePrice(0)
      setDiscount(0)

  }

      // Función para calcular el subtotal de un detalle
      const calculateSubtotal = (detail) => {
        return detail.amount * detail.purchase_price - detail.discount;
      };
  
        // Función para manejar cambios en la cantidad, precio de compra y descuento
    const handleDetailChange = (index, field, value) => {
      const updatedDetails = [...details];
      updatedDetails[index][field] = value;
  
      // Actualizar los detalles
      setDetails(updatedDetails);
  
      // Calcular el nuevo total
      const newTotal = updatedDetails.reduce((acc, detail) => {
        return acc + calculateSubtotal(detail);
      }, 0);
  
      // Actualizar el estado del total
      setTotal(newTotal);
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
      (detail) => detail.producto.id_product === id)?.producto.id_product

    if (productIdToDelete) {
      // Eliminar el producto del conjunto setAddedProducts
      //setAddedProducts((prevProducts) => prevProducts.filter((productId) => productId !== productIdToDelete));
      setAddedProducts(
        addedProducts.filter((productId) => productId !== productIdToDelete),
      )
    }

    const updatedDetails = formData.details.filter(
      (detail) => detail.producto.id_product !== id,
    )
    setFormData({
      ...formData,
      details: updatedDetails,
    })
  }

  // console.log('ya: ', addedProducts)

  // --------------------------------------------------agregar si no funciona
  // const handleProductClick = (product) => {
  //   const productId = product.id_product

  //   // const isAlreadySelected = selectedProduct.some((selectedProduct) => selectedProduct.id_product === product.id_product);

  //   if (isProductSelected(productId)) {
  //     const updatedSelectedProducts = selectedProduct.filter(
  //       (selectedProduct) => selectedProduct.id_product !== productId,
  //     )
  //     setSelectedProduct(updatedSelectedProducts)
  //   } else {
  //     setSelectedProduct([...selectedProduct, product])
  //   }
  // }
  const handleProductClick = (product) => {
    if (selectedProduct.some((p) => p.id_product === product.id_product)) {
      // Si el producto ya está seleccionado, lo quitamos
      setSelectedProduct((prevSelected) =>
        prevSelected.filter((p) => p.id_product !== product.id_product)
      );
    } else {
      // Si no está seleccionado, lo agregamos
      setSelectedProduct((prevSelected) => [...prevSelected, product]);
    }
  };
  
  const [nextBillNumber, setNextBillNumber] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${URL}/api/purchase`, {
        method: 'POST',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      // if (!response.ok) {
      //   throw new Error(Error)
      // }
      const data = await response.json()
      // console.log(data)
      if (response.ok) {
        setAddedProducts([]); 
        setTotal(0);
        setFormData({ provider_id: '', details: [] })
        setNextBillNumber(data.bill_number); 
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
        // setSuccess(data.message)
        // setError(data.error)
        toast.error(`Algo salio mal`/**${data.errors[0].msg} */, {
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
    fetch(`${URL}/api/bill`, {
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        setNextBillNumber(data.bill_number);
      })
      .catch((error) => {
        console.error("Error al obtener el próximo número de factura", error);
      });
  }, [nextBillNumber]);
  // console.log("can",amount, 'prec', purchasePrice, 'desc:',discount )


      /***  INICIO BUSCADOR **** * */
      // const handleSearch = (searchTerm) => {
      //   if (searchTerm === null) {
      //     setfilteredProducts(products)
      //   } else {
      //     const filtered = products.filter(
      //       (product) =>
      //       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      //       product.code_product.toString().includes(searchTerm.toLowerCase()) 
      //     )
      //     setfilteredProducts(filtered)
      //   }
      // }

      const handleSearch = (searchTerm) => {
        if (products && products.length > 0) {
          if (searchTerm === null) {
            setfilteredProducts(products)
          } else {
            const filtered = products.filter(
              (product) =>
              product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              product?.code_product.toString().includes(searchTerm.toLowerCase()) 
            )
            setfilteredProducts(filtered)
          }
        } else {
          console.error(404)
          return(
            <Alert color='danger'>Registra un dato!!!</Alert>
          )
          // Manejar el caso en que products está vacío o nulo
          // Puedes establecer setfilteredProducts([]) o mostrar un mensaje de error, por ejemplo.
        }
      };


      /***  FIN BUSCADOR **** * */

  return (
    <>
      

        

            <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >

          <Button 
          color="primary" 
          onClick={() => setModalOpenPur(true)}
          >
            Registrar compra
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
                  Registrar Compras
                </ModalHeader>
                <ModalBody>
                <Card className="rounded">
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <TextField
                      value={nextBillNumber || ""}
                      // onChange={handleInputChange}
                      disabled
                      // onChange={(e) => setFormData({ ...formData, bill_number: e.target.value })}
                      label="Numero de Factura"
                      variant="standard"
                    />
                  </FormGroup>
                  <FormGroup>
                    {/* <Label for="provider_id">Proveedor</Label> */}
                    {/* <Input type="select" name="provider_id" id="provider_id" onChange={handleInputChange}>
            <option disabled>Selecciona Proveedor</option>
            {provider.map((provider) =>(
              <option 
                key={provider.id_provider}
                value={provider.id_provider}>
                  {provider.name}

              </option>
            ))}
          </Input> */}

                    <div className="d-flex " style={{ alignItems: 'center' }}>
                      <Autocomplete
                        id="combo-box-demo"
                        options={provider}
                        getOptionLabel={(option) => option.name}
                        onChange={handleProviderChange}
                        style={{ width: '300px' }}
                        value={selectedProvider}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Proveedor"
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
                  <FormGroup>
                    <div style={{ display: 'flex' }}>
                      {/* <Label>Detalles</Label> */}
                      <div>
                        <Button
                          title='Agregar detalle'
                          color="success"
                          className='mb-1'
                          onClick={() => setModalOpen(true)}
                        >
                          Agregar Producto
                        </Button>
                      </div>
                    </div>

                    {formData.details.length > 0 ? (
                      <>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Detalle</th>
                            <th>Cateogoria</th>
                            <th>Cantidad</th>
                            <th>Precio Compra</th>
                            <th>Precio Venta</th>
                            <th>Descuento</th>
                            <th>Subtotal</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.details.map(
                            (detail, index) =>
                              // Verificar que los campos relevantes no estén en blanco o en valores por defecto
                              (detail.id_product ||
                                detail.amount ||
                                detail.purchase_price ||
                                detail.discount) && (
                                <tr key={index}>
                                  <td>
                                    {detail.id_product}- <b>{detail.producto.code_product}</b> - {detail.producto.name}
                                  </td>
                                  <td>{detail.producto ? detail.producto.detail : 'NA'}</td>
                                  <td>{detail.producto.category ?(detail.producto.category.type ? detail.producto.category.type : <p style={{color:'red'}}>Sin categoría</p>): <p style={{color:'red'}}>Sin categoría</p>}</td>

                                  <td>
                                    {editIndex === index ? (
                                      <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) =>
                                          setAmount(e.target.value)
                                        }
                                      />
                                    ) : (
                                      detail.amount
                                    )}
                                  </td>
                                  <td>
                                    {editIndex === index ? (
                                      <input
                                        type="number"
                                        value={purchasePrice}
                                        onChange={(e) =>
                                          setPurchasePrice(e.target.value)
                                        }
                                      />
                                    ) : (
                                      detail.purchase_price
                                    )}
                                  </td>
                                  <td>
                                    {editIndex === index ? (
                                      <input
                                        type="number"
                                        value={salePrice}
                                        onChange={(e) =>
                                          setSalePrice(e.target.value)
                                        }
                                      />
                                    ) : (
                                      detail.sale_price
                                    )}
                                  </td>
                                  <td>
                                    {editIndex === index ? (
                                      // <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} />
                                      <input
                                        type="number"
                                        // value={discount || '0'}
                                        value={discount || 0}

                                        onChange={(e) =>
                                          setDiscount(e.target.value)
                                        }
                                      />
                                    ) : (
                                      detail.discount
                                    )}
                                  </td>
                                  <td>
                                    {detail.amount * detail.purchase_price -
                                      detail.discount}
                                  </td>
                                  <td>
                                    {editIndex === index ? (
                                      <Button
                                        // color="success"
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
                                    ) : (
                                      <>
                                        <Button
                                        title='Editar'
                                          // color="primary"
                                          style={{
                                            cursor: 'pointer',
                                            backgroundColor: 'transparent', // Quita el relleno
                                            color: 'black',
                                            border: 'none', // Quita el contorno
                                            }}
                                          onClick={() => handleEditClick(index)}
                                        >
                                          <FaEdit size={20} />
                                        </Button>
                                        <Button
                                          // color="danger"
                                          title='Eliminar'
                                          style={{
                                            cursor: 'pointer',
                                            backgroundColor: 'transparent', // Quita el relleno
                                            color: 'black',
                                            border: 'none', // Quita el contorno
                                            }}
                                          onClick={() =>
                                            deleteDetail(
                                              detail.producto.id_product
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
                            <th colSpan='7'><p style={{ fontSize: '1.2rem'}}>Total de Factura</p></th>
                            <th><span style={{ fontSize: '1.2rem'}}>{total}</span></th>
                          </tr>
                        </tbody>
                      </Table>
                      {/* <Card className="mt-4">
                      <CardBody>
                        <h5 className="card-title">Total de Factura</h5>
                        <p>Total: {total}</p>
                      </CardBody>
                    </Card> */}
                      </>
                    ) : (
                      <>
                        <Alert color="danger">
                          <p>No existen detalles</p>
                        </Alert>
                      </>
                    )}

                    {/* <Button onClick={() => setModalOpen(true)}></Button> */}
                  </FormGroup>
                  {/* {formData.bill_number && formData.provider_id && formData.details.length > 0 && ( */}
                    {/* <Button type="submit"
                    disabled={!formData.provider_id || formData.details.length === 0}
                    color='success'
                    outline
                    >
                      Registrar Compras
                      </Button> */}
                  {/* )} */}

                  <div className='d-flex justify-content-center p-2'>
                    <Button className='mx-2' color="danger"
                        onClick={()=>setModalOpenPur(false)}          >
                        Cancelar
                    </Button>
                    <Button
                    
                        color="success"
                        type="submit"
                        disabled={!formData.provider_id || formData.details.length === 0}

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
              <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)} fullscreen size='lg'>
                <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
                  Seleccionar Producto
                </ModalHeader>                
                <ModalBody>
                  <div className='container'>
                    <div className='row'>
                      <div className='col-12'>
                        <SearchInput onSearch={handleSearch} />
                      </div>
                      <div className='col-12 d-flex justify-content-start p-2'>
                        <Button className='mx-1' color="primary" onClick={addProductToDetails}>
                          Agregar
                        </Button>
                        <Button color="danger" onClick={() => setModalOpen(false)}>
                          Volver
                        </Button>
                      </div>
                      <div className='row'>
                        <div className='col-12'>
                          <Table responsive>
                            <thead>
                              <tr>
                                <th>Codigo</th>
                                <th>Nombre</th>
                                <th>Detalle</th>
                                <th>Categoria</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredproducts.length > 0 ? (
                                filteredproducts.map((product, index) => {
                                  // Definir el color de la fila según las condiciones
                                  let rowColor = 'lightcoral'; // Rojo por defecto (no está seleccionado)
                                  
                                  if (isProductAdded(product.id_product)) {
                                    rowColor = 'lightblue'; // azul si ya está agregado
                                  } else if (isProductSelected(product.id_product)) {
                                    rowColor = 'lightgreen'; // Verde si ha sido seleccionado
                                  }

                                  return (
                                    <tr 
                                      key={index} 
                                      onClick={() => {
                                        if (!isProductAdded(product.id_product)) {
                                          handleProductClick(product); // Cambia a verde al seleccionar
                                        }
                                      }} 
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <td style={{ backgroundColor: rowColor }}>{product.code_product}</td>
                                      <td style={{ backgroundColor: rowColor }}>{product.name}</td>
                                      <td style={{ backgroundColor: rowColor }}>{product.detail}</td>
                                      <td style={{ backgroundColor: rowColor }}>
                                        {product.category ? (
                                          product.category.type ? (
                                            product.category.type
                                          ) : (
                                            <p style={{ color: 'red' }}>Sin Categoría</p>
                                          )
                                        ) : (
                                          <p style={{ color: 'red' }}>Sin Categoría</p>
                                        )}

                                        {!isProductAdded(product.id_product) ? (
                                          <input
                                            type="checkbox"
                                            className='mx-2'
                                            checked={isProductSelected(product.id_product)}
                                          />
                                        ) : (
                                          <input
                                            type="checkbox"
                                            checked={true}
                                            className='mx-2'
                                            disabled
                                          />
                                        )}
                                      </td>
                                    
                                    </tr>
                                  );
                                })
                              ) : (
                                    <Alert color="danger">
                                      Sin productos
                                    </Alert>
                              )}
                            </tbody>
                          </Table>
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

export default ModalAddP;
