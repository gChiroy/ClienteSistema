import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRouteGuard = ({ children }) => {
  const { isAuth } = useSelector((state) => state.auth);
  const userRole = localStorage.getItem('userRole'); // Obtén el rol del localStorage

  if (isAuth && userRole === 'admin') {
    return children; // Muestra el contenido del componente si es un administrador
  } else {
    return <Navigate to="/home" />; // Redirige a /home si no es un administrador o no está autenticado
  }
};

export default AdminRouteGuard;
