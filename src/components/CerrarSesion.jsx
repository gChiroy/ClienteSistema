import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { MenuItem, Button, Menu} from '@mui/material'

function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/login;';
}
const LogoutButton = () => {
  // const [seconds, setSeconds] = useState(60); // 60 segundos = 1 minuto
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

        // deleteCookie('token')
        // Cookies.remove('token');


        window.location.href = '/login';
      } else {
        console.log('Error logging out');
      }
    } catch (error) {
      console.log(error.message);
    }
  };



  return (
    <div>
      {/* <p>Auto logout in {seconds} seconds</p> */}
      <Button onClick={handleLogout}>Cerrar Sesión</Button>
    </div>
  );
};

export default LogoutButton;
