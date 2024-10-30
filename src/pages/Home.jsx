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
      <div className="container-fluid mt-4">
       <div className="row">
        <h1>HOME</h1>
       </div>
      </div>

    </div>
  );
}

export default Home;


///aqui inicio 