import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { useSelector } from 'react-redux'

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
  CardImg,
  CardTitle,
  CardText,
  Col,
  Row,
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
import { GiCancel } from 'react-icons/gi'
import CloseIcon from '@mui/icons-material/Close';
import SearchInput from '../../providers/InputSearch'
import { MdOutlineAutoDelete } from 'react-icons/md'


const ModalEditS = (props) => {
  const URL = import.meta.env.VITE_URL_API;

const { shoppingId, isOpen, toggle, Update } = props;





const { isAuth } = useSelector((state) => state.auth);
const userRole = localStorage.getItem('userRole'); // Obtén el rol del localStorage




  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const [loading, setLoading] = useState(false)


  const [formData, setFormData] = useState({
    // bill_number: '',
    customerId: '',
    tax: '',
    DetailSales: [   // Otros detalles temporales
    ],
    // provider_id: formData1.provider_id,
    // details: formData1.DetailShoppings, // Accede a DetailShoppings aquí
  })

  // const [formData, setFormData] = useState({
  //   provider_id: '',
  //   DetailShoppings: {
  //     product_id: null, // Inicialmente, no tiene valor
  //     amount: 0,
  //     purchase_price: 0,
  //     discount: 0,
  //   },
  // });

  

  const [provider, setProvider] = useState([])
  const [amount, setAmount] = useState(0)
  const [prevAmount, setPrevAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState(0)
  const [discount, setDiscount] = useState(0)


  const [products, setProducts] = useState([])
  const [filteredproducts, setfilteredProducts] = useState([])

  // descomnet si no funciona
  // const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState([])

  const [modalOpen, setModalOpen] = useState(false)
//   const [modalOpenPur, setModalOpenPur] = useState(false)
//   const toggleModal = () => setModalOpenPur(!modalOpenPur)
const [existingTax, setExistingTax] = useState(null); // Almacena el valor existente de 'tax'

const getPurId = async () => {
    // Realiza una solicitud GET al servidor para obtener los datos de la compra
    if(shoppingId){
    try {
      const response = await fetch(`${URL}/api/sale/${shoppingId}`,{
        credentials:'include'
      });
      if (response.ok) {
        const data = await response.json();
        setFormData(data.sale);
        setExistingTax(data.sale.tax)
        
      } 
    //   else {
    //     console.error('Error al obtener los datos de la compra');
    //   }
    } catch (error) {
      console.log(error);
    }
  }
  };

  useEffect(() => {
    getPurId();
  }, [shoppingId]);

// console.log('Compras iD',formData)

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
  const getProvider = async () => {
    try {
      const response = await fetch(`${URL}/api/allCustomers`, {
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
      // console.log('ID del proveedor seleccionado:', idProvider)

      // También puedes acceder a formData.provider_id para obtener el id_provider seleccionado
      // console.log('formData.provider_id:', formData.customerId)

      // Luego, puedes realizar la acción de registro aquí utilizando el idProvider o formData.provider_id
      setIsRegisterButtonDisabled(true)
    } else {
      console.log('Ningún proveedor seleccionado.')
    }
  }

  const [editIndex, setEditIndex] = useState(-1)
  const [addedProducts, setAddedProducts] = useState([])
  // const [isProductSelected, setIsProductSelected] = useState(false);

  // const isProductAdded = (productId) => {
  //   return addedProducts.includes(productId)
  // }
  const isProductAdded = (productId) => {
    // Verificar si el productId ya existe en los detalles
    return formData.DetailSales.some(
      (detail) => detail.inventory_id_inventory === productId
    );
  };
  

  const isProductSelected = (productId) => {
    // return selectedProduct && selectedProduct.id_product === productId;
    return selectedProduct.some((product) => product.id_inventory === productId)
  }

  const handleEditClick = (index) => {
    setEditIndex(index)
  }

  const handleSaveClick = () => {
    // Copiar los detalles actuales y actualizar el detalle editado
    // const updatedDetails = [...formData.DetailShoppings]
    // updatedDetails[editIndex] = {
    //   ...updatedDetails[editIndex],
    //   amount: amount || formData.DetailShoppings.amount,
    //   purchase_price: purchasePrice,
    //   discount,
    // }
    // const updatedDetails = [...formData.DetailShoppings];
    // if (prevAmount === '') {
    //   updatedDetails[editIndex] = {
    //     ...updatedDetails[editIndex],
    //     amount,
    //     purchase_price: purchasePrice,
    //     discount,
    //   };
    // } else {
    //   updatedDetails[editIndex] = {
    //     ...updatedDetails[editIndex],

    //     amount: amount === '' ? prevAmount : amount,
    //     purchase_price: purchasePrice === '' ? detail.purchase_price : purchasePrice,
    //     discount: discount === '' ? detail.discount : discount,
    //   };
    // }
    // const updatedDetails = [...formData.DetailShoppings];
    // const editedDetail = {
    //   ...updatedDetails[editIndex],
    //   amount: amount !== null ? amount : updatedDetails[editIndex].amount,
    //   purchase_price: purchasePrice !== null ? purchasePrice : updatedDetails[editIndex].purchase_price,
    //   discount: discount !== null ? discount : updatedDetails[editIndex].discount,
    // };
    // updatedDetails[editIndex] = editedDetail; DetailSales
    const updatedDetails = formData.DetailSales.map((detail, index) => {
      if (detail.inventory_id_inventory === editIndex) {
        return {
          ...detail,
          amount: amount || detail.amount,
          // purchase_price: purchasePrice || detail.inventory_product.public_price,
          discount: discount || detail.discount,
        };
      } else {
        return detail
        // {
        //   ...detail,
        //   amount: amount === '' ? detail.amount : amount,
        //   purchase_price: purchasePrice === '' ? detail.purchase_price : purchasePrice,
        //   discount: discount === '' ? detail.discount : discount,
        // };
      }
    });
    


    setFormData({
      ...formData,
      DetailSales: updatedDetails,
    })

    // Reiniciar el estado de edición
    setEditIndex(-1)

    const total = updatedDetails.reduce((acc, detail) => {
      return (
        acc +
        detail.amount   * detail.inventory_product.public_price -
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
        inventory_id_inventory: selectedProduct.id_inventory,
        inventory_product: selectedProduct, 
        amount: formData.DetailSales.amount,
        // purchase_price: formData.DetailShoppings.purchase_price,
        discount: formData.DetailSales.discount
      }))
  
      setFormData({
        ...formData,
        DetailSales: [...formData.DetailSales, ...newDetail],
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
  }

      // Función para calcular el subtotal de un detalle
      const calculateSubtotal = (detail) => {
        return detail.amount - detail.discount;
      };
  
        // Función para manejar cambios en la cantidad, precio de compra y descuento
    // const handleDetailChange = (index, field, value) => {
    //   const updatedDetails = [...details];
    //   updatedDetails[index][field] = value;
  
    //   // Actualizar los detalles
    //   setDetails(updatedDetails);
  
    //   // Calcular el nuevo total
    //   const newTotal = updatedDetails.reduce((acc, detail) => {
    //     return acc + calculateSubtotal(detail);
    //   }, 0);
  
    //   // Actualizar el estado del total
    //   setTotal(newTotal);
    // };
  //     const handleDetailChange = (e, index) => {
  //   const { name, value } = e.target;
  //   const updatedDetails = [...formData.DetailShoppings];
  //   // // Asegúrate de que haya suficientes elementos en el arreglo de detalles
  //   // while (updatedDetails.length <= index) {
  //   //     updatedDetails.push({});
  //   //   }
  //   if (!updatedDetails[index]) {
  //       updatedDetails[index] = {};
  //     }
  //     // Actualiza los detalles en el índice especificado
  //   updatedDetails[index][name] = value;
  //   setFormData({
  //     ...formData,
  //     DetailShoppings: updatedDetails,
  //   });
  // };
  
    useEffect(() => {
      // Calcula el total inicial cuando se carga la página (por si ya hay detalles)
      const initialTotal = details.reduce((acc, detail) => {
        return acc + calculateSubtotal(detail);
      }, 0);
      setTotal(initialTotal);
    }, []);

  const deleteDetail = (id) => {
    const productIdToDelete = formData.DetailSales.find(
      (detail) => detail.inventory_id_inventory === id)?.inventory_id_inventory

    if (productIdToDelete) {
      // Eliminar el producto del conjunto setAddedProducts
      //setAddedProducts((prevProducts) => prevProducts.filter((productId) => productId !== productIdToDelete));
      setAddedProducts(
        addedProducts.filter((productId) => productId !== productIdToDelete),
      )
    }

    const updatedDetails = formData.DetailSales.filter(
      (detail) => detail.inventory_id_inventory !== id,
    )
    setFormData({
      ...formData,
      DetailSales: updatedDetails,
    })
  }

  // console.log('ya: ', addedProducts)

  const handleProductClick = (product) => {
    const productId = product.id_inventory

    // const isAlreadySelected = selectedProduct.some((selectedProduct) => selectedProduct.id_product === product.id_product);

    if (isProductSelected(productId)) {
      const updatedSelectedProducts = selectedProduct.filter(
        (selectedProduct) => selectedProduct.id_inventory !== productId,
      )
      setSelectedProduct(updatedSelectedProducts)
    } else {
      setSelectedProduct([...selectedProduct, product])
    }
  }

  const handleTaxChange = (e) => {
    // setFormData({ ...formData, tax: e.target.value });
    // Asegúrate de que el valor esté en el rango de 0 a 100
    let newValue = parseFloat(e.target.value);

    if (isNaN(newValue)) {
      newValue = 0; // Valor predeterminado si la entrada no es un número válido
    } else {
      newValue = Math.max(0, Math.min(100, newValue)); // Asegura que esté en el rango 0-100
    }

    // Actualiza 'formData.tax' en porcentaje (0-100)
    setFormData({ ...formData, tax: newValue });
  };
  const displayedTaxValue = Math.round(formData.tax);

    // Maneja la solicitud de actualización
    const handleUpdateSale = () => {
      // Verifica si 'tax' cambió antes de enviar la solicitud de actualización
      if (formData.tax !== existingTax) {
        // Realiza la solicitud de actualización con el nuevo valor de 'tax'
        sendUpdateRequest(formData);
      } else {
        // Si 'tax' no cambió, no es necesario enviar la solicitud de actualización
        // ... Manejo de caso en el que 'tax' no cambió ...
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // const response = await fetch('${URL}/api/purchase', {
        const response = await fetch(`${URL}/api/sale/${shoppingId}`, {
        credentials:'include',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        // credentials: 'include',
        body: JSON.stringify(formData),
      })

      // if (!response.ok) {
      //   throw new Error(Error)
      // }
      const data = await response.json()
      // console.log(data)
      if (response.ok) {
        setAddedProducts([]); 
        // setFormData({ provider_id: '', DetailShoppings: [] })
        toggle()
        Update()
  
         toast.success(`Se editó correctamente`/**${formData.bill_number} */, {
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
  const cancelEdit = (index) => {
    // Restablece los valores de los inputs a los valores originales
    setAmount(null);
    setPurchasePrice(null);
    setDiscount(null);
  
    // Restablece el índice de edición
    setEditIndex(-1);
  }

        // Este efecto se ejecutará cada vez que isModalOpen cambie
        useEffect(() => {
          if (!isOpen) {
            // Si el modal se cierra, restablece los productos a vacío
            setAddedProducts([]);
            cancelEdit()
          }
        }, [isOpen]);
  

              /***  INICIO BUSCADOR **** * */
      const handleSearch = (searchTerm) => {
        if(products && products.length > 0){
          if (searchTerm === null) {
            setfilteredProducts(products)
          } else {
            const filtered = products.filter(
              (product) =>
              product.Product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (product.Product?.detail?.toLowerCase() || "").includes(searchTerm.toLowerCase())||

              // product.Product?.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
              // product.code_product.toString().includes(searchTerm.toLowerCase()) 
              product?.Product?.code_product.toString().includes(searchTerm.toLowerCase()) ||
              product?.Product?.brand && product.Product.brand.name !== null && product.Product.brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              product?.Product?.category && product.Product.category.type !== null && product.Product.category.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
              // (usuario.total !== null && usuario.total.toString().includes(searchTerm.toLowerCase()))
              product?.stock.toString().includes(searchTerm.toLowerCase()) ||
              product?.public_price.toString().includes(searchTerm.toLowerCase()) 
            )
            setfilteredProducts(filtered)
          }
        }
        else{
          console.error(404)
        }
      }

      // const handleSearch = (searchTerm) => {
      //   if (searchTerm === null) {
      //     setfilteredProducts(products)
      //   } else {
      //     const filtered = products.filter(
      //       (product) =>
      //         product.Product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      //         product.Product.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      //         product.Product.code_product.toString().includes(searchTerm.toLowerCase()) ||
      //         (product.Product.brand &&
      //           product.Product.brand.name !== null &&
      //           product.Product.brand.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      //         (product.Product.category &&
      //           product.Product.category.type !== null &&
      //           product.Product.category.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      //         product.stock.toString().includes(searchTerm.toLowerCase()) ||
      //         product.public_price.toString().includes(searchTerm.toLowerCase())
      //     ).map((product) => {
      //       const name = product.Product.name.replace(
      //         new RegExp(searchTerm, 'gi'),
      //         (match) => `<span style="color: red">${match}</span>`
      //       )
      //       const detail = product.Product.detail.replace(
      //         new RegExp(searchTerm, 'gi'),
      //         (match) => `<span style="color: red">${match}</span>`
      //       )
      //       const brand = product.Product.brand?.name?.replace(
      //         new RegExp(searchTerm, 'gi'),
      //         (match) => `<span style="color: red">${match}</span>`
      //       )
      //       const category = product.Product.category?.type?.replace(
      //         new RegExp(searchTerm, 'gi'),
      //         (match) => `<span style="color: red">${match}</span>`
      //       )
      //       const stock = product.stock.toString().replace(
      //         new RegExp(searchTerm, 'gi'),
      //         (match) => `<span style="color: red">${match}</span>`
      //       )
      //       const publicPrice = product.public_price.toString().replace(
      //         new RegExp(searchTerm, 'gi'),
      //         (match) => `<span style="color: red">${match}</span>`
      //       )
      //       return {
      //         ...product,
      //         Product: {
      //           ...product.Product,
      //           name,
      //           detail,
      //           brand,
      //           category,
      //         },
      //         stock,
      //         public_price: publicPrice,
      //       }
      //     })
      //     setfilteredProducts(filtered)
      //   }
      // }
      
      
      /***  FIN BUSCADOR **** * */

      // console.log('DAyos de detail', formData.DetailSales)


          // ******************************Eliminar detallle
          const [isOpenDel, setIsOpenDel] = useState(false)
          const [selectedShoppingIdD, setSelectedShoppingIdD] = useState(null);
        
          const toggleModal = () => {
            setIsOpenDel(!isOpenDel)
          }
        
          const handleDelClick = (shoppingId) => {
            setSelectedShoppingIdD(shoppingId);
            // setIsModalOpen(true);
            toggleModal()
          };
          // console.log(selectedShoppingId)
          /********************************FIN delete */
      // console.log(selectedShoppingIdD)
      
            const handleDeleteConfirmedCom = async (detailId) => {
              // setLoading(true);
              try {
                const productIdToDelete = formData.DetailSales.find(
                  (detail) => detail.id_details_sales === selectedShoppingIdD)?.id_details_sales
      
                const res = await fetch(`${URL}/api/sale/detail/${selectedShoppingIdD}`, {
                  method: 'DELETE',
                  credentials: 'include',
                })
                const data = await res.json()
                // console.log(data)
      
      
                if (productIdToDelete) {
                  // Eliminar el producto del conjunto setAddedProducts
                  //setAddedProducts((prevProducts) => prevProducts.filter((productId) => productId !== productIdToDelete));
                  setAddedProducts(
                    addedProducts.filter((productId) => productId !== productIdToDelete),
                  )
                }
            
                const updatedDetails = formData.DetailSales.filter(
                  (detail) => detail.id_details_sales !== selectedShoppingIdD,
                )
                setFormData({
                  ...formData,
                  DetailSales: updatedDetails,
                })
                toggleModal();
                Update()
                toast.success(`Se eliminó correctamente`/**${formData.bill_number} */, {
                  // position: 'bottom-center',
                  position: 'top-center',
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });

                
              } catch (error) {
                console.log(error)
                toast.error(`No se pudo eliminar`/**${formData.bill_number} */, {
                  // position: 'bottom-center',
                  position: 'top-center',
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
      
              }
              // finally{
              //   setLoading(false)
              // }
            } 

  return (
    <>
     <>
      <Modal isOpen={isOpenDel} fade={false} toggle={toggleModal} centered={true} >
        <ModalHeader toggle={toggleModal}>
          <MdOutlineAutoDelete size={30} /> Confirme eliminar dato
        </ModalHeader>
        <ModalBody>
          <p className="text-center">¿Está seguro de querer eliminar este registro?</p>
          {/* ¿Esta seguro de eliminar el dato? */}
          <i>Esta accion afectara el stock del inventario y caja despúes que confirme la acción.</i>
        </ModalBody>
        <ModalFooter>
            <Button color="danger"  onClick={toggleModal}>Cancelar</Button>
            <Button color="primary"  
            onClick={handleDeleteConfirmedCom}
            >Aceptar</Button>
        </ModalFooter>
      </Modal>
      <ToastContainer/>
      <ModalSpinner loading={loading}/>
    </>
      

        <div>
        <Modal 
        isOpen={isOpen} 
        toggle={toggle}
        size='xl'
        fade={true}
        fullscreen
        >
                <ModalHeader toggle={toggle}>
                  Editar venta {formData.proforma_number}
                </ModalHeader>
                <ModalBody>
                <Form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-6">
                    <FormGroup>
                    <TextField
                      value={formData.bill_number || ""}
                      // onChange={handleInputChange}
                      disabled
                      // onChange={(e) => setFormData({ ...formData, bill_number: e.target.value })}
                      label="Numero de Proforma"
                      variant="standard"
                    />
                  </FormGroup>
                    </div>
                    <div className="col-6">
                    <FormGroup>
                 

                 <div className="d-flex " style={{ alignItems: 'center' }}>
                   <TextField
                   value={formData.Customer ? (formData.Customer.name ? formData.Customer.name : "n/a") : "n/a" || ""}

                   // onChange={handleInputChange}
                   disabled
                   // onChange={(e) => setFormData({ ...formData, bill_number: e.target.value })}
                   label="Cliente"
                   variant="standard"
                 />
                   {/* <Button
                     onClick={handleRegisterProvider}
                     disabled={isRegisterButtonDisabled}
                     outline
                     color="primary"
                   >
                     Registrar
                   </Button> */}
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
                    { formData.DetailSales && formData.DetailSales.length > 0 ?

                    (formData.DetailSales.length > 0 ? (
                      <>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Cateogoria</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Descuento</th>
                            <th>Subtotal</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.DetailSales.map(
                            (detail, index) =>
                              // Verificar que los campos relevantes no estén en blanco o en valores por defecto
                              (detail.inventory_id_inventory ||
                                detail.amount ||
                                detail.discount) && (
                                <tr key={index}>
                                  <td>
                                    {/* {detail.id_product}- <b>{detail.producto.code_product}</b> - {detail.producto.name} */}
                                    {/* {detail.inventory_product.Product.name} */}
                                    {detail.inventory_product?.Product ? (detail.inventory_product.Product.name ?  detail.inventory_product.Product.name : "Sin nombre") :  'Sin ' }
                                    {/* {detail.inventory_product ? (detail.inventory_product.Product.name ? detail.inventory_product.Product.name : "Sin nombre") : 'Sin'} */}

                                  </td>
                                  <td>{detail.inventory_product ? (detail.inventory_product.categories_id_category ?  detail.inventory_product.Product.categories_id_category : "Sin marca") :  'Sin ' }</td>
                                  {/* <td>{detail.producto.category ?(detail.producto.category.type ? detail.producto.category.type : <p style={{color:'red'}}>Sin categoría</p>): <p style={{color:'red'}}>Sin categoría</p>}</td> */}
                                  {/* <td>{detail.producto.brand ?(detail.producto.brand.name ? detail.producto.brand.name : <p style={{color:'red'}}>Sin marca</p>): <p style={{color:'red'}}>Sin marca</p>}</td> */}

                                  <td>
                                    {editIndex === detail.inventory_id_inventory ? (
                                      <>
                                      <div style={{ position: 'relative' }}>
                                        <Input
                                          type="number"
                                          className='form-control'
                                          style={{maxWidth: '5rem'}}
                                          value={amount != null ? amount : detail.amount}
                                          onChange={(e) => setAmount(e.target.value)}
                                        />
                                        {amount && (
                                          <button
                                            style={{
                                              position: 'absolute',
                                              right: '8px',
                                              top: '50%',
                                              transform: 'translateY(-50%)',
                                              background: 'transparent',
                                              border: 'none',
                                              cursor: 'pointer',
                                            }}
                                            onClick={() => setAmount("")}
                                          >
                                            <CloseIcon/>
                                          </button>
                                        )}
                                      </div>
                                    </>
                                    ) : (
                                      detail.amount
                                    )}
                                  </td>
                                  <td>{detail.inventory_product?.public_price}</td>
                                  <td>
                                    {editIndex === detail.inventory_id_inventory ? (
                                      // <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} />
                                      
                                      <div style={{ position: 'relative' }}>
                                       <Input
                                        type="number"  
                                        className='form-control'
                                        style={{maxWidth: '5rem'}}
                                        value={discount != null ? discount : detail.discount}
                                        onChange={(e) =>
                                          setDiscount(e.target.value)
                                        }
                                      />
                                      {discount && (
                                        <button
                                          style={{
                                            position: 'absolute',
                                            right: '8px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                          }}
                                          onClick={() => setDiscount("")}
                                        >
                                          <CloseIcon/>
                                        </button>
                                      )}
                                      </div>
                                    ) : (
                                      detail.discount
                                    )}
                                  </td>
                                  <td>
                                    {/* {(detail.amount ? detail.amount.toFixed(2) : 0)* detail.inventory_product.public_price.toFixed(2) -
                                      (detail.discount ? detail.discount.toFixed(2) : 0)} */}
                                        {((detail.amount ? detail.amount : 0) * detail.inventory_product?.public_price - (detail.discount ? detail.discount : 0)).toFixed(2)}

                                  </td>
                                  <td>
                                    {editIndex === detail.inventory_id_inventory ? (
                                      <>
                                      <Button
                                        color="success"
                                        title='save'
                                        onClick={handleSaveClick}
                                        style={{
                                          cursor: 'pointer',
                                          backgroundColor: 'transparent', // Quita el relleno
                                          color: 'black',
                                          border: 'none', // Quita el contorno
                                          }}
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
                                      onClick={() => cancelEdit(detail.inventory_id_inventory)}
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
                                          onClick={() => handleEditClick(detail.inventory_id_inventory)}
                                        >
                                          <RiEditCircleFill size={20} />
                                        </Button>
                                        {isAuth && userRole ==="admin" &&(
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
                                            // deleteDetail(
                                            //   detail.inventory_id_inventory
                                            // )
                                            handleDelClick(
                                              detail.id_details_sales
                                            )
                                          }
                                        >
                                          <TiDeleteOutline size={20} />
                                        </Button>
                                        )
                                        }
                                      </>
                                    )}
                                  </td>
                                </tr>
                              ),
                          )}
                          <tr>
                            <td colSpan={5}><b>Total libre de impuesto</b></td>
                            <td>{formData.total_no_tax}</td>
                          </tr>
                          <tr>
                            <td colSpan={5}><b>IVA</b></td>
                            <td>
                            <TextField
                                onChange={handleTaxChange}
                                value={formData.tax}
                                name='tax'
                                id='tax'
                                style={{maxWidth: '5rem'}}
                                // onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                                variant="standard"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5}><b>TOTAL</b></td>
                            <td>{formData.total}</td>
                          </tr>
                        </tbody>
                      </Table>
                    
                      </>
                    ) : (
                      <>
                        <Alert color="warning">
                          <p>No existen detalles</p>
                        </Alert>
                      </>
                    )):(
                      <tr>
                  <td colSpan="4">No hay detalles disponibles.</td>
                </tr>
                    )}

                    {/* <Button onClick={() => setModalOpen(true)}></Button> */}
                  </FormGroup>

                  <div className='d-flex justify-content-center p-2'>
                    <Button color="danger" className='mx-1'
                        onClick={toggle}          >
                        Cancelar
                    </Button>
                    <Button
                    
                        color="success"
                        type="submit"
                        disabled={/*!formData.provider_id*/ formData.DetailSales.length === 0}

                    >
                        Registrar
                    </Button>
          </div>
                </Form>
                </ModalBody>
                
              </Modal>
              <ToastContainer/>
                <ModalSpinner loading={loading}/>
        </div>

            <div>
              <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
                <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
                  Selecciona un producto
                </ModalHeader>
                <ModalBody>
                  <div className='container'>
                    <div className='row'>
                      <div className='col-12'>
                      <SearchInput onSearch={handleSearch} />
                      </div>
                      <div className='col-12 d-flex justify-content-start  p-2'>
                      <Button className='mx-1' color="success" onClick={addProductToDetails}>
                        Agregar
                      </Button>
                      <Button color="danger" onClick={() => setModalOpen(false)}>
                        Volver
                      </Button>
                      </div>
                    </div>
                    <div>
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
                </ModalBody>
               
              </Modal>
            </div>      
       
      
    </>
  )
}

export default ModalEditS;
