import React, { useState, useEffect } from 'react'
import { AiFillDelete, AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import {
  InputGroup,
  InputGroupText,
  Form,
  Label,
  Input,
  Button,
  FormGroup,
  Col,
  Card,
  Spinner,
  Table,
} from 'reactstrap'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { IoIosAddCircle } from 'react-icons/io'
import { AiOutlineUserAdd } from 'react-icons/ai'
import { FiEdit3 } from 'react-icons/fi'
import { ToastContainer, toast } from 'react-toastify';
import ModalAddProduct from '../ModalAddProduct'
import { ModalDeletCategory } from './ModalDelete'
import { EditModalCategory } from './ModalEdit'
import { ModalSpinner } from '../../../providers/ModalSpinner'


const ModalRegisterCatBran = (props) => {
  const URL = import.meta.env.VITE_URL_API;
  const { getProduct } = props

  const [modalOpen, setmodalOpen] = useState(false)
  const toggleModal = () => setmodalOpen(!modalOpen)



//   const isValidUs =
//     // /[A-Z]/.test(values.users) && // al menos una mayúscula
//     /[a-z]/.test(values.users) && /\d/.test(values.users) // al menos una minúscula // al menos un dígito numérico

  const UsuValidacion = 'El nombre de usuario debe tener' + ' letras y numeros'

//   const isValidPass =
//     values.password.length >= 6 &&
//     values.password.length <= 15 &&
//     /[A-Z]/.test(values.password) && // al menos una mayúscula
//     /[a-z]/.test(values.password) && // al menos una minúscula
//     /\d/.test(values.password) // al menos un dígito numérico

  const PassValidacion =
    'La contraseña debe tener entre 6 y 15 caracteres' +
    ' y contener al menos una letra mayúscula, una letra minúscula ' +
    'y un dígito numérico'
   // Crear un estado para los valores del formulario
   const [values, setValues] = useState({
    name: '',
    type: ''
  });
  
  const [brands, setBrands] = useState([])

  const [loading, setLoading] = useState(false)

  const [categories, setCategories] = useState([])
    const  fetchCategories = async () => {
        setLoading(true)
      try {
        const response = await fetch(`${URL}/api/allCategories`,{
          credentials:'include'
        })

        if (!response.ok) {
          throw new Error('No se pueden listar las categporias')
        }
        const data = await response.json()
        // console.log('categorias',data)
        setCategories(data)
        // updCompanies()
        // setLoading(false)
      } catch (error) {
        console.log(error)
      } finally{
        setLoading(false)
      }
    }

    useEffect(() => {

    fetchCategories()
  }, [])//brands despues[], esta solo por preuba



    // Crear una función para manejar el cambio de los inputs
    const handleChange = (e) => {
        const { name, value } = e.target
        setValues({
          ...values,
          [name]: value,
        })

    };
 
  

  // Crear una función para enviar el formulario al servidor

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    setLoading(true)

      // Enviar el formulario al servidor usando fetch
      try {
        const response = await fetch(`${URL}/api/category`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            type: values.type,
          }),
        })
  
        // const data = await res.json()
        if (!response.ok) {
          const errorData = await response.json()
          // setSuccess(data.message)
          throw new Error(errorData.message)
        }
        setValues({ type: ''})
        // toggleModal()
        const data = await response.json();
    // Update the brands state with the new data
    setCategories([...categories, data]);
        // fetchCategories()
  
         toast.success(`Se registró correctamente: ${values.type}`, {
          // position: 'bottom-center',
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
         
    } catch (error) {
        console.log(error)
        toast.error(`No se inserto correctamente: ${values.type}`, {
          // position: 'bottom-center',
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
      } finally{
        setLoading(false)
      }
    // }
  };


   // EDIT CATEGORIA ****************************************************************

   const [isModalOpenB, setIsModalOpenB] = useState(false)

   const [selectedProviderB, setSelectedProviderB] = useState({})
 
   const toggleModalEditB = () => setIsModalOpenB(!isModalOpenB)
 
   const handleEditProviderB = (provider) => {
     setSelectedProviderB(provider)
     toggleModalEditB()
   } ///////////////////////////////********************************
 
   /** FIN DE  EDITAR CATEGORIA */ 

  
    //*******************************************ELIMINAR CATEGORIA */
  /** INICIO DE  ELIMINAR  */

  const [modalOpenDelCat, setModalOpenDelCat] = useState(false)
  const [userCatDel, setCatDel] = useState(null)

  const toggleDelCat = () => {
    setModalOpenDelCat(!modalOpenDelCat)
  }

  const handleCatDelete = async (id_category) => {
    // Abre el modal de confirmación
    setCatDel(id_category)
    toggleDelCat()
  }

  const handleDeleteConfirmedCat = async () => {
    const id_category = userCatDel
    setLoading(true)
    

    try {
      const res = await fetch(
        `${URL}/api/category/${id_category}`,
        {
          method: 'DELETE',
          credentials: 'include',
        },
      )
      const data = await res.json()
      // console.log(data)
      toggleDelCat()
      // getCompanies()
      fetchCategories();
      toast.success(`${data.message}`, {
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

  /*****************************************FIN ELIMINAR CATEGORIA */

    // EDIT CATEGORIA ****************************************************************

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [selectedProvider, setSelectedProvider] = useState({})
  
    const toggleModalEdit = () => setIsModalOpen(!isModalOpen)
  
    const handleEditProvider = (provider) => {
      setSelectedProvider(provider)
      toggleModalEdit()
    } ///////////////////////////////********************************
  
    /** FIN DE  EDITAR CATEGORIA */ 

  return (
    <>
      {/* <Button onClick={modalOpen}>
        Agregar
    </Button> */}

      {/* <div color='success' style={{display:"flex", alignItems:'center', border: '1px solid green', borderRadius:"8px"}}> */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >

          <Button 
          color="primary" 
          onClick={toggleModal}
          >
            Registrar categorias
          </Button>
 
      </div>

      {/* </div> */}
      {/* size="lg" */}
      <Modal
        isOpen={modalOpen}
        fade={true}
        toggle={toggleModal}
        centered={true}
        // size='lg'
        scrollable={true}
      >
        <ModalHeader toggle={toggleModal}>
          <AiOutlineUserAdd size={30} /> Categorias
        </ModalHeader>
        <ModalBody>
          {/* <Form className="container mt-3" onSubmit={handleSubmit} > */}
         
            <Col className="d-flex mb-3">
              <FormGroup className='w-100'>
              <div className="d-flex">
              <div className="col-3">
              <Button
                color="success"
                onClick={handleSubmitCategory}
                disabled={!values.type}

                type="submit"
              >
                Registrar
              </Button>
              </div>
                <Input
                  onChange={handleChange}
                  type='text'
                  value={values.type || ''}
                  className="form-control"
                  id="type"
                  name="type"
                  placeholder="Categoria"
                />
              </div>

                <div>

                <ModalDeletCategory
            toggleModal={toggleDelCat}
            modalOpen={modalOpenDelCat}
            handleDeleteConfirmed={handleDeleteConfirmedCat}
          />
                <EditModalCategory
                provider={selectedProvider}
                onUpdate={fetchCategories}
                isOpen={isModalOpen}
                toggle={toggleModalEdit}
                />
                
                    <Table responsive>
                        <thead>
                            <tr>
                                <th colSpan={3}>Categoria</th>
                            </tr>
                            <tr>
                                <th>No.</th>
                                <th>Nombre</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories
                            // .sort((a, b) => new Date(b.users.createdAt) - new Date(a.users.createdAt))
                            .map((category, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{category.type}</td>
                                  
                                    <td>
                                      <Button
                                            color="primary"
                                            title="Editar"
                                            style={{
                                              cursor: 'pointer',
                                              backgroundColor: 'transparent', // Quita el relleno
                                              color: 'black',
                                              border: 'none', // Quita el contorno
                                              }}
                                            onClick={(event) => {
                                                  handleEditProvider(category);
                                                  event.stopPropagation();
                                              }}
                                          >
                                            <FiEdit3 title="Editar" />
                                          </Button>
                                          <Button
                                            color="danger"
                                            title="Eliminar"
                                            style={{
                                              marginRight:'12px',
                                              cursor: 'pointer',
                                              backgroundColor: 'transparent', // Quita el relleno
                                              color: 'black',
                                              border: 'none', // Quita el contorno
                                              }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              // setModalOpen(false); // Cierra el modal de detalles
                                              handleCatDelete(category?.id_category ? category.id_category : 0)
                                            }}
                                          >
                                            <AiFillDelete />
                                          </Button>
                                      </td>
                                </tr>
                            ))

                            }
                        </tbody>
                    </Table>
                </div>

              </FormGroup>

           
            </Col>

        <div className='d-flex justify-content-center p-2'>
          <Button  color="primary" onClick={toggleModal}>
            Volver
          </Button>
          
        </div>

          {/* </Form> */}
        </ModalBody>
        
      </Modal>
      <ToastContainer/>

      <ModalSpinner loading={loading}/>

    </>
  )
}

export default ModalRegisterCatBran;
