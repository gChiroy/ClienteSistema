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
import { GiCancel } from 'react-icons/gi'
import CloseIcon from '@mui/icons-material/Close';
import SearchInput from '../../providers/InputSearch'
import { MdOutlineAutoDelete } from 'react-icons/md'
import { FaEdit } from 'react-icons/fa'


const ModalEditP = (props) => {
  const URL = import.meta.env.VITE_URL_API;

const { shoppingId, isOpen, toggle, Update } = props;








  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const [loading, setLoading] = useState(false)


  const [formData, setFormData] = useState({
    // bill_number: '',
    provider_id: '',
    DetailShoppings: [   // Otros detalles temporales
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
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [discount, setDiscount] = useState(0)


  const [products, setProducts] = useState([])
  const [filteredproducts, setfilteredProducts] = useState([])

  // descomnet si no funciona
  // const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState([])

  const [modalOpen, setModalOpen] = useState(false)
//   const [modalOpenPur, setModalOpenPur] = useState(false)
//   const toggleModal = () => setModalOpenPur(!modalOpenPur)

const getPurId = async () => {
    // Realiza una solicitud GET al servidor para obtener los datos de la compra
     // Verifica si selectedShoppingId tiene un valor antes de hacer la solicitud
  if (shoppingId) {
    try {
      const response = await fetch(`${URL}/api/purchase/${shoppingId}`,{
        credentials:'include'
      });
      if (response.ok) {
        const data = await response.json();
        setFormData(data.purchase);
      } else {
        console.error('Error al obtener los datos de la compra');
      }
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

  // const isProductAdded = (productId) => {
  //   return addedProducts.includes(productId)
  // }

  const isProductAdded = (productId) => {
    // Verificar si el productId ya existe en los detalles
    return formData.DetailShoppings.some(
      (detail) => detail.Product?.id_product === productId
    );
  };

  const isProductSelected = (productId) => {
    // return selectedProduct && selectedProduct.id_product === productId;
    return selectedProduct.some((product) => product.id_product === productId)
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
    // updatedDetails[editIndex] = editedDetail;
    const updatedDetails = formData.DetailShoppings.map((detail, index) => {
      if (detail.Product.id_product === editIndex) {
        return {
          ...detail,
          amount: amount || detail.amount,
          purchase_price: purchasePrice || detail.purchase_price,
          sale_price: salePrice || detail.sale_price,
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
      DetailShoppings: updatedDetails,
    })

    // Reiniciar el estado de edición
    setEditIndex(-1)

    const total = updatedDetails.reduce((acc, detail) => {
      return (
        acc +
        detail.amount   * detail.purchase_price -
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
    // if (selectedProduct && !isProductAdded(selectedProduct.id_product)) {
    // const newDetail = {
    //   id: `temp-${Math.random()}`,
    //   product_id: selectedProduct,
    //   amount,
    //   purchase_price: purchasePrice,
    //   discount,
    // };

    // const newDetail = {
    //   // id: `temp-${Math.random()}`,
    //   id_product: selectedProduct.id_product,
    //   producto: selectedProduct, // Agre
    //   amount,
    //   purchase_price: "",
    //   discount: "",
    // };

    // if(selectedProduct.length > 0){
      const newDetail = selectedProduct.map((selectedProduct) => ({
        // id: `temp-${Math.random()}`,
        products_id_product: selectedProduct.id_product,
        Product: selectedProduct, 
        amount: formData.DetailShoppings.amount,
        purchase_price: formData.DetailShoppings.purchase_price,
        discount: formData.DetailShoppings.discount
      }))

      // Verifica si al menos uno de los campos se está editando
      // if (
      //   formData.DetailShoppings.amount !== undefined ||
      //   formData.DetailShoppings.purchase_price !== undefined ||
      //   formData.DetailShoppings.discount !== undefined
      // ) {
      //   // Conserva el valor actual de "product_id"
      //   newDetail[0].product_id = formData.DetailShoppings[0].product_id;
      // }
  
      setFormData({
        ...formData,
        DetailShoppings: [...formData.DetailShoppings, ...newDetail],
      })

      // const newTotal = newDetail.reduce((acc, detail) => {
      //   const Subtotal = detail.amount * detail.purchase_price - detail.discount;
      //   return acc + Subtotal;
      // }, total)
      // console.log('total: ', newTotal);

      // setTotal(newTotal);
  
      // // Agregar el producto a la lista de productos agregados
      // setAddedProducts([...addedProducts, selectedProduct.id_product]);
      // Agregar los productos a la lista de productos agregados
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
    // }
    // setIsProductSelected(false)
    // setSelectedProduct(null);
    // setSelectedProduct([])

    // }
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
    const productIdToDelete = formData.DetailShoppings.find(
      (detail) => detail.id_details_shopping === id)?.id_details_shopping

    if (productIdToDelete) {
      // Eliminar el producto del conjunto setAddedProducts
      //setAddedProducts((prevProducts) => prevProducts.filter((productId) => productId !== productIdToDelete));
      setAddedProducts(
        addedProducts.filter((productId) => productId !== productIdToDelete),
      )
    }

    const updatedDetails = formData.DetailShoppings.filter(
      (detail) => detail.id_details_shopping !== id,
    )
    setFormData({
      ...formData,
      DetailShoppings: updatedDetails,
    })
  }

  // console.log('ya: ', addedProducts)

  const handleProductClick = (product) => {
    const productId = product.id_product

    // const isAlreadySelected = selectedProduct.some((selectedProduct) => selectedProduct.id_product === product.id_product);

    if (isProductSelected(productId)) {
      const updatedSelectedProducts = selectedProduct.filter(
        (selectedProduct) => selectedProduct.id_product !== productId,
      )
      setSelectedProduct(updatedSelectedProducts)
    } else {
      setSelectedProduct([...selectedProduct, product])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // const response = await fetch('${URL}/api/purchase', {
        const response = await fetch(`${URL}/api/purchase/${shoppingId}`, {
        method: 'PUT',
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
    setSalePrice(null);
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
            setfilteredProducts(products);
          } else {
            const filtered = products.filter(
              (product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.code_product.toString().includes(searchTerm.toLowerCase())
            );
            setfilteredProducts(filtered);
          }
        } else {
          console.log(404)
          return(
            <Alert color='danger'>Regsitra datos!!</Alert>
          )
          // Manejar el caso en que products está vacío o nulo
          // Puedes establecer setfilteredProducts([]) o mostrar un mensaje de error, por ejemplo.
        }
      };
      /***  FIN BUSCADOR **** * */




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
          const productIdToDelete = formData.DetailShoppings.find(
            (detail) => detail.id_details_shopping === selectedShoppingIdD)?.id_details_shopping

          const res = await fetch(`${URL}/api/purchase/detail/${selectedShoppingIdD}`, {
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
      
          const updatedDetails = formData.DetailShoppings.filter(
            (detail) => detail.id_details_shopping !== selectedShoppingIdD,
          )
          setFormData({
            ...formData,
            DetailShoppings: updatedDetails,
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
          toast.error(`No se eliminó correctamente`/**${formData.bill_number} */, {
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
          ¿Esta seguro de eliminar el detalle?
        </ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={toggleModal}>Cancelar</Button>
            <Button color="danger" 
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
        size='lg'
        fullscreen
        >
                <ModalHeader toggle={toggle}>
                  Editar Compra {formData.bill_number}
                </ModalHeader>
                <ModalBody>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <TextField
                      value={formData.bill_number || ""}
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
                      {/* <Autocomplete
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
                      /> */}<TextField
                      value={formData.Provider ? (formData.Provider.name ? formData.Provider.name : "n/a") : "n/a" || ""}

                      // onChange={handleInputChange}
                      disabled
                      // onChange={(e) => setFormData({ ...formData, bill_number: e.target.value })}
                      label="Trabajador Proveedor"
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
                    { formData.DetailShoppings && formData.DetailShoppings.length > 0 ?

                    (
                      formData.DetailShoppings.length > 0 ? (
                      <>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Producto</th>
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
                          {formData.DetailShoppings.map(
                            (detail, index) =>
                              // Verificar que los campos relevantes no estén en blanco o en valores por defecto
                              (detail.products_id_product ||
                                detail.amount ||
                                detail.purchase_price ||
                                detail.discount) && (
                                <tr key={index}>
                                  <td>
                                    {/* {detail.id_product}- <b>{detail.producto.code_product}</b> - {detail.producto.name} */}
                                    {detail.Product? (detail.Product.name ?  detail.Product.name : "Sin nombre") :  'Sin ' }
                                  </td>
                                  {/* <td>{detail.Product? (detail.Product.categories_id_category ?  detail.Product.categories_id_category : "Sin marca") :  'Sin ' }</td> */}
                                  <td>{detail.Product ?(detail.Product.category.type ? detail.Product.category.type : <p style={{color:'red'}}>Sin categoría</p>): <p style={{color:'red'}}>Sin categoría</p>}</td>

                                  {/* <td>{detail.producto.category ?(detail.producto.category.type ? detail.producto.category.type : <p style={{color:'red'}}>Sin categoría</p>): <p style={{color:'red'}}>Sin categoría</p>}</td> */}
                                  {/* <td>{detail.producto.brand ?(detail.producto.brand.name ? detail.producto.brand.name : <p style={{color:'red'}}>Sin marca</p>): <p style={{color:'red'}}>Sin marca</p>}</td> */}

                                  <td>
                                    {editIndex === detail.Product?.id_product ? 
                                    (
                                      <>
                                      <div style={{ position: 'relative' }}>
                                        <Input
                                          type="number"
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
                                    
                                      
                                    //   <Input
                                    //   type="number"
                                    //   value={amount}
                                    //   onChange={(e) => {
                                    //     setAmount(e.target.value);
                                    //     if (detail.amount !== e.target.value) {
                                    //       setPrevAmount(detail.amount);
                                    //     }
                                    //   }}
                                    // />
                                    ) : (
                                      detail.amount
                                    )}
                                  </td>
                                  <td>
                                    {editIndex === detail.Product?.id_product ? (
                                      <>
                                      <div style={{ position: 'relative' }}>
                                      <Input
                                        type="number"
                                        value={purchasePrice != null ? purchasePrice : detail.purchase_price}
                                        onChange={(e) =>
                                          setPurchasePrice(e.target.value)
                                        }
                                      />
                                      {purchasePrice && (
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
                                          onClick={() => setPurchasePrice("")}
                                        >
                                          <CloseIcon/>
                                        </button>
                                      )}
                                        
                                      </div>
                                      </>
                                    ) : (
                                      detail.purchase_price
                                    )}
                                  </td>
                                  {/* ---- */}
                                  <td>
                                    {editIndex === detail.Product?.id_product ? (
                                      <>
                                      <div style={{ position: 'relative' }}>
                                      <Input
                                        type="number"
                                        value={salePrice != null ? salePrice : detail.sale_price}
                                        onChange={(e) =>
                                          setSalePrice(e.target.value)
                                        }
                                      />
                                      {salePrice && (
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
                                          onClick={() => setSalePrice("")}
                                        >
                                          <CloseIcon/>
                                        </button>
                                      )}
                                        
                                      </div>
                                      </>
                                    ) : (
                                      detail.sale_price
                                    )}
                                  </td>
                                  <td>
                                    {editIndex === detail.Product?.id_product ? (
                                      // <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} />
                                      
                                      <div style={{ position: 'relative' }}>
                                       <Input
                                        type="number"  
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
                                    {detail.amount * detail.purchase_price -
                                      detail.discount}
                                  </td>
                                  <td>
                                    {editIndex === detail.Product?.id_product ? (
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
                                      onClick={() => cancelEdit(detail.Product.id_product)}
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
                                          onClick={() => handleEditClick(detail.Product.id_product)}
                                        >
                                          <FaEdit size={20} />
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
                                            // deleteDetail(
                                            //   detail.id_details_shopping
                                            // )
                                            handleDelClick(
                                              detail.id_details_shopping
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
                            <th colSpan='6'><p style={{ fontSize: '1.2rem'}}>Total de Factura</p></th>
                            <th><span style={{ fontSize: '1.2rem'}}>{formData.total}</span></th>
                          </tr>
                        </tbody>
                      </Table>
                      {/* <Card className="mt-4">
                      <CardBody>
                        <h5 className="card-title">Total de Factura</h5>
                        <p>Total: {formData.total}</p>
                      </CardBody>
                    </Card> */}
                      </>
                    ) : (
                      <>
                        <Alert color="warning">
                          <p>No existen detalles</p>
                        </Alert>
                      </>
                    )
                    ):(
                      <tr>
                  <td colSpan="4">No hay detalles disponibles.</td>
                </tr>
                    )
                    }

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
                        onClick={toggle}          >
                        Cancelar
                    </Button>
                    <Button
                    
                        color="success"
                        type="submit"
                        disabled={/*!formData.provider_id*/ formData.DetailShoppings.length === 0}

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
              <Modal isOpen={modalOpen} fullscreen toggle={() => setModalOpen(!modalOpen)}>
                <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
                  Seleccionar producto
                </ModalHeader>
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
                    </div>
                    <div className='row'>
                      <div>
                      <Table responsive>
                    <thead>
                      <tr>
                        <th>Codigo</th>
                        <th>Nombre</th>
                        <th>Codigo</th>
                        <th>Categoria</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredproducts.length > 0 ? (
                        
                          filteredproducts.map((product, index) => {
                            let rowColor = 'lightcoral'; //rojo si no esta seleccionado, por defecto

                            if (isProductAdded(product.id_product)) {
                              rowColor = 'lightblue'; //azul si ya esta agregado
                            }
                            else if (isProductSelected(product.id_product)) {
                              rowColor = 'lightgreen'; //verde si ha sido seleccionado
                            }

                            return(
                              <tr key={index}
                              onClick={()=>{
                              if (!isProductAdded(product.id_product)) {
                                handleProductClick(product)
                              }
                            }}
                            style={{cursor:'pointer'}}
                            >
                              <td style={{ backgroundColor: rowColor }}>{product.code_product}</td>
                              <td style={{ backgroundColor: rowColor }}>{product.name}</td>
                              <td style={{ backgroundColor: rowColor }}>{product.code_product}</td>
                              {/* <td>{product.category.type ? product.category.type : 'Sin cateogria'}</td> */}
                              <td style={{ backgroundColor: rowColor }}>
                                {product.category ? (
                                  product.category.type ? 
                                  product.category.type : <p style={{color:'red'}}>Sin Categoría</p>) : <p style={{color:'red'}}>Sin Categoría</p>}
                                  
                                  {!isProductAdded(product.id_product) ? (
                                    <input 
                                    type="checkbox" 
                                    className='mx-2'
                                    checked={isProductSelected(product.id_product)}
                                    />
                                  ) : (
                                    <input 
                                    type='checkbox'
                                    checked={true}
                                    className='mx-2'
                                    disabled
                                    />
                                  )}
                                  </td>
                              
                            </tr>
                            )

                            
                          })
                          
                      ):(
                        <p>no ha productos</p>
                      )

                      }
                    </tbody>
                  </Table>
                      </div>
                    </div>
                  </div>
                </ModalBody>
                {/* <ModalFooter>
                  <Button color="primary" onClick={addProductToDetails}>
                    Agregar
                  </Button>
                  <Button color="secondary" onClick={() => setModalOpen(false)}>
                    Cancelar
                  </Button>
                </ModalFooter> */}
              </Modal>
            </div>      
       
      
    </>
  )
}

export default ModalEditP;
