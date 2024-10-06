import React, { useState, useEffect } from 'react';

import { SidebarData } from './SidebarData'
import SidebarItem from './SidebarItem'
import LogoutButton from '../CerrarSesion'
// import { RiSideBarLine } from 'react-icons/ri'
import { HiMiniBars4 } from "react-icons/hi2";
import { FaSignOutAlt } from 'react-icons/fa';
import { MenuItem, Button, Menu} from '@mui/material'

/* Provider (estado global)*/
import { useStore, useSubItem } from '../../providers/GlobalProvider'
import '../../styles/App.scss'
import { useSelector } from 'react-redux'
import { Tooltip } from 'reactstrap'




const Sidebar = (props) => {
  const {pageTitle } = props
  /* Estado global de la sidebar */
  const isOpen = useStore((state) => state.sidebar)
  const toggle = useStore((state) => state.showSidebar)
  const subNav = useSubItem((state) => state.subNav)

  // console.log(isOpen);

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('rol')
    window.location.href = '/'
  }
  const [fadeIn, setFadeIn] = useState(false);

  const toggle2 = () => setFadeIn(!fadeIn);

  const { isAuth } = useSelector((state) => state.auth);
  const userRole = localStorage.getItem('userRole'); // Obtén el rol del localStorage
  const userName = localStorage.getItem('name'); // Obtén el rol del localStorage


  const filteredSidebarData = SidebarData.filter((item) => {
    if (item.showOnlyForAdmin && userRole !== 'admin') {
      return false; // No mostrar elementos si no es admin
    }
    if (item.subNav) {
      item.subNav = item.subNav.filter((subItem) => {
        return !subItem.showOnlyForAdmin || userRole === 'admin';
      });
    }
    return true;
  });

  

  // const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const URL = import.meta.env.VITE_URL_API;


  const handleLogout = async () => {
    try {
      const response = await fetch(`${URL}/api/logout`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.removeItem('isAuth');
        localStorage.removeItem('name');
        localStorage.removeItem('userRole');
        localStorage.removeItem('logoutTimer');
        localStorage.removeItem('lastUnloadTime');
        window.location.href = '/login';
      } else {
        console.log('Error logging out');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    let timer;
    let initialSeconds;

    const handleUnload = () => {
      if (initialSeconds > 0) {
        const lastUnloadTime = new Date().getTime();
        const elapsedTime = lastUnloadTime - parseInt(localStorage.getItem('lastUnloadTime'));
        if (elapsedTime < initialSeconds * 1000) {
          initialSeconds -= elapsedTime / 1000;
        }
        localStorage.setItem('lastUnloadTime', lastUnloadTime);
        localStorage.setItem('logoutTimer', initialSeconds);
      }
    };

    if (isAuth) {
      // Recuperar el valor del temporizador desde el localStorage o establecerlo en 21600(6hroas) segundos por defecto
      initialSeconds = parseInt(localStorage.getItem('logoutTimer')) || 21600;

      const lastUnloadTime = parseInt(localStorage.getItem('lastUnloadTime'));
      const currentTime = new Date().getTime();

      if (lastUnloadTime && currentTime - lastUnloadTime > initialSeconds * 1000) {
        // Si ha pasado más tiempo que el temporizador, cerrar sesión
        handleLogout();
      } else {
        if (initialSeconds > 0) {
          timer = setInterval(() => {
            if (initialSeconds === 0) {
              handleLogout();
              clearInterval(timer);
            } else {
              initialSeconds--;
            }
          }, 1000); // Actualizar cada 1 segundo
        }
      }

      window.addEventListener('beforeunload', handleUnload);

      // Limpia el temporizador y el evento cuando el componente se desmonta
      return () => {
        clearInterval(timer);
        window.removeEventListener('beforeunload', handleUnload);
      };
    }
  }, [isAuth]);



 
  return (
    
    <>
    {isAuth && (
        <header className="header">
        <div
          className={
            isOpen
              ? 'nav-icon-open nav-icon bars'
              : 'nav-icon-close nav-icon bars'
          }
        >
          <HiMiniBars4 id='mos-ocu'  onClick={toggle} style={{transform: "scale(.7)"}} />

          <h5 className="page-title" >{pageTitle}</h5>
        </div>
        
        <div className="header-info-user">
          {/* <span>Bienvenido {userRole}: {userName}</span>
  
          <span ><LogoutButton/></span> */}

         <div className='username-title'>
         <span >
      <div className='c-sesion'>
      <label  htmlFor="" style={{ width: "7rem"}}>Bienvenido {userRole}: </label>
      <Button style={{padding:'5px'}} onClick={handleOpenMenu} >
      <strong>{userName}</strong>
      </Button>
      </div>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        
        <MenuItem >
          <FaSignOutAlt/><LogoutButton />
        </MenuItem>
        {/* <MenuItem onClick={() => handleButtonClick('Opción 3')}>
          <Button variant="outlined">Opción 3</Button>
        </MenuItem> */}
      </Menu>
     </span>
    </div>

     


            
          
        </div>
        
      </header>
    )}

   


{ isAuth ? (


     
        <div className="container-sidebar">
        <aside
          className={isOpen ? 'sidebar sidebarOpen' : 'sidebar sidebarClose'}
        >
          <section
            className="top_section"
            style={{ paddingLeft: !isOpen ? '12px' : '0px' }}
          >
            
            {/* Sidebar completa o incompleta  */}
            {/* isOpen === true -> se mostrará el h1 por defecto, de lo contrario se oculta */}
            <div className="logo">
              <figure className="m-0">
                {/* <img className={isOpen ? "logo-restaurante logo-restaurante-open" : "logo-restaurante logo-restaurante-close"} width="20px" src={Logo} alt="Logo restaurante" /> */}
                <img
                  style={{ borderRadius: '20px' }}
                  className={
                    isOpen
                      ? 'logo-restaurante logo-restaurante-open'
                      : 'logo-restaurante logo-restaurante-close'
                  }
                  src=''
                  alt="Logo Tipicos Chiroy"
                />
              </figure>
              {/* <p className="logo-text-right m-0" style={{ display: isOpen ? "inline" : "none"}}>Café Y Restaurante <br /> La Centenaria</p> */}
            </div>
          </section>
          <br />
          <br />
          <br />
          <br />
          {/* Items de la sidebar */}
          {filteredSidebarData.map((item, index) => {
            // return <SidebarItem item ={item} isOpen={isOpen} key={index} />;
            return <SidebarItem item={item} key={index} />
          })}
          

        </aside>

        
      </div>

      ):(
<div style={{ marginTop: '100px', textAlign:'center'}}><h3>Tipicos Chiroy</h3></div> 

      )}
      


      
    </>
  )
}

export default Sidebar
