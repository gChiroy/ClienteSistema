// import { Modal, ModalBody, Spinner } from "reactstrap";

// export const ModalSpinner = (props) =>{
//     const { loading } = props;

//     return(
//         <>
//     <Modal isOpen={loading} centered backdrop="static" keyboard={false}>
//         <ModalBody className="text-center">
//           <p>Espere...</p>
//         </ModalBody>
//       </Modal></>
//     )
// }

import { Spinner } from "reactstrap";

export const ModalSpinner = ({ loading }) => {
  if (!loading) return null;

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semi-transparente
    zIndex: 9999, // Asegura que esté por encima de otros elementos
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const spinnerStyle = {
    display: "flex",
    alignItems: "center",
    fontSize: "1.2rem",
    color: "#fff", // Texto blanco para mejor visibilidad
  };

  return (
    <div style={overlayStyle}>
      <div style={spinnerStyle}>
        <Spinner size="sm" />
        <h4 style={{ marginLeft: "10px" }}>Espere...</h4>
      </div>
    </div>
  );
};

