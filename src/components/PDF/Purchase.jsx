import React, { useEffect, useState } from 'react'
import { MdOutlineAutoDelete } from 'react-icons/md';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

export const PdfPurchase = (props) => {
  const URL = import.meta.env.VITE_URL_API;
    const { modalOpen, purchaseId, toggleModal } = props;
    // console.log('pdf generado', purchaseId)
   
    const [pdfLink, setPdfLink] = useState();
    const [pdfBlob, setPdfBlob] = useState(null);

    // const handleGeneratePDF = async () => {
    //   try {
    //     const response = await fetch(`/${URL}/api/pdfp/${purchaseId}`);
    //     if (response.ok) {
    //         // La solicitud fue exitosa, se obtiene el blob del PDF
    //         const blob = await response.blob();
    //         setPdfBlob(blob);
    //         // Descargar el PDF automáticamente
    //         const url = window.URL.createObjectURL(blob);
    //         const a = document.createElement('a');
    //         a.style.display = 'none';
    //         a.href = url;
    //         a.download = 'factura.pdf';
    //         document.body.appendChild(a);
    //         a.click();
    //         window.URL.revokeObjectURL(url);
    //       } else {
    //         // La solicitud no fue exitosa, muestra un mensaje de error
    //         console.error('Error al generar el PDF');
    //       }
    //   } catch (error) {
    //     console.error('Error al generar el PDF', error);
    //   }
    // };

    const handleGeneratePDF = () => {
        // setLoading1(true);
        const url = `${URL}/api/pdfp/${purchaseId}`;
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/pdf',
          },
          credentials:'include',
          responseType: 'blob',
          
        })
          .then((response) => response.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const newWindow = window.open(url, '_blank');
            toggleModal()
            if (!newWindow) {
              throw new Error('No se pudo abrir el PDF en una pestaña nueva.');
            }
            // setLoading1(false);
          })
          .catch((error) => {
            console.error('Error:', error);
            // setLoading1(false);
          });
      };
    return (
        <>
        <Modal isOpen={modalOpen} fade={false} toggle={toggleModal} centered={true} >
        <ModalHeader toggle={toggleModal}>
          <MdOutlineAutoDelete size={30} /> Confirme eliminar dato
        </ModalHeader>
        <ModalBody>
          Dessea imprimir?
        </ModalBody>
        <ModalFooter>
            <Button color="primary" outline onClick={toggleModal}>Cancelar</Button>
            <Button color="primary" outline 
            onClick={handleGeneratePDF}
            >Aceptar</Button>
    
        </ModalFooter>
      </Modal>
        </>

    )
}