import React, { useState, useEffect } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux'
import { authenticateUser, unauthenticateUser } from '../redux/slices/authSlice';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import '../styles/Login/style.scss'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ModalSpinner } from '../providers/ModalSpinner';

const Login = () => {
  const URL = import.meta.env.VITE_URL_API;

  const [showPassword, setShowPassword] = useState(false)
  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  // const { setUserRole } = useUserRole();

  const [values, setValues] = useState({
    users: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)


  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const dispatch = useDispatch()

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch(`${URL}/api/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()
      
      if (response.status !== 200) {
        // setError('Error al iniciar sesión1');
        // setError(data.errors[0].msg)
        toast.error(`Algo salio mal: ${data.errors[0].msg}`, {
          // position: 'bottom-center',
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return
      }
      dispatch(authenticateUser())

      localStorage.setItem('userRole', data.rol)
      localStorage.setItem('name', data.user)
      // localStorage.setItem('tokenExpiration', data.tokenExpiration);

      // Almacena el token en una cookie segura con HttpOnly
      // document.cookie = `token=${data.token}; secure; httpOnly`;
      document.cookie = `token=${data.token} httpOnly=true`

      localStorage.setItem('isAuth', 'true')
      // Forzar un refresco de la página
      window.location.reload();
    } catch (error) {
      console.log(error.message)
      // setError('Error en servidor al iniciar sesión');
      toast.error(`Algo salio mal: ${error.message}`, {
        // position: 'bottom-center',
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
     
      // setError(error.response.data.errors[0].msg)
    }
    finally{
      setLoading(false)
    }
  }



  const currentYear = new Date().getFullYear()
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-4 justify-content-center algn-content-center">
          {' '}
          <div
            className="card p-5"
            style={{
              // borderRadius: '15%',
              // border: '2px solid black',
              // height: '400px', // Agregar esta línea
              // height: '130%',
              // display: 'flex', // Agregar esta línea
              // alignItems: 'center', // Agregar esta línea
              justifyContent: 'center', // Agregar esta línea
              textAlign: 'center',
            }}
          >
        

            <Form onSubmit={(e) => onSubmit(e)}>
              <FormGroup>
              {/* <br /><br /> */}

                {/* <Label for="text"></Label> */}
                <Input 
                style={{marginTop:'1rem'}}
                  type="text"
                  id="users"
                  name="users"
                  placeholder="usuario"
                  // value={values.users}
                  onChange={(e) => onChange(e)}
                />
              </FormGroup>
              <FormGroup>
                {/* <br /><br /> */}
                {/* <Label for="password"></Label> */}
                <div style={{ display:'flex', marginTop:'2rem'}} className="input-group-append">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  // value={values.password}
                  onChange={(e) => onChange(e)}
                  placeholder="Contraseña"
                />
                
                  <Button
                  
                    onClick={handleTogglePassword}
                    style={{ 
                      cursor: 'pointer',
                      backgroundColor: 'transparent', // Quita el relleno
                      color: 'black',
                      border: 'none', // Quita el contorno
                    }}
                  >
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </Button>
                </div>
              </FormGroup>
              {/* {values.users && values.password && (
                <Button
                type='submit'
                // color="primary" // Cambiar a un color compatible con Bootstrap
                block
                style={{
                  backgroundColor: '#ffdab9',
                  borderColor: 'gray', // Cambiar el color del borde
                  color: 'black',
                }}
              >
                Iniciar Sesión
              </Button>
              )} */}
              <Button
                type='submit'
                block
                color='primary'
                disabled={!values.users || !values.password} // Deshabilita el botón si no existen ambos datos
              >
                Iniciar Sesión
              </Button>

            </Form>
          </div>
          <ToastContainer/>
          <ModalSpinner loading={loading}/>

          <p
            style={{
              fontSize: '12px',
              color: 'gray',
              marginTop: '10px',
              textAlign: 'center',
            }}
          >
            © {currentYear} Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login;
