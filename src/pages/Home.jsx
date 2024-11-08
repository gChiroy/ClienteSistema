import React, { useEffect, useState } from "react";
import { useStore } from "../providers/GlobalProvider";

function Home(props) {

  useEffect(() => {
    // Para establecer en el módulo en el que nos encontramos
    props.setTitle("Inicio");
  }, []);

  const isOpen = useStore((state) => state.sidebar);

  return (
    <div className={isOpen === true ? "wrapper" : "side"}>
      <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
       <div className="text-center">
        <h1>"Bienvenido al sistema de Tipicos Chiroy"</h1>
        <img 
            src='https://res.cloudinary.com/dtvauhqrt/image/upload/v1729663622/LogoTipicosChiroy_dlufoe.png' 
            alt="Bienvenida al sistema" 
            className="img-fluid mt-3" 
            style={{ maxWidth: "400px", borderRadius: "10px" }} 
            //style={{ marginTop: '100px', textAlign:'center'}}
          />
       </div>
      </div>

    </div>
  );
}

export default Home;


//aqui inicio 