import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner} from 'reactstrap';

import { ToastContainer, toast } from 'react-toastify'
import { ModalSpinner } from '../../../providers/ModalSpinner';
import { BsPrinter } from 'react-icons/bs';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ModalReportShopping from './shopping/ModalReportShopping';
import ModalReportShoopWeek from './shopping/ModalReportShoopWeek';
import ModalReportShoopMonth from './shopping/ModalReportShoopMonth';


  export const ReportPdfShopping = ()=> {
    const URL = import.meta.env.VITE_URL_API;
  
      const [loading, setLoading] = useState(false)
      const [dropdownOpen, setDropdownOpen] = useState(false);

      const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
      };
      
         // ******************************Eliminar
    const [isOpenDel, setIsOpenDel] = useState(false)
  
    const toggleModalDel = () => {
      setIsOpenDel(!isOpenDel)
    }
    // console.log(selectedShoppingId)
    /********************************FIN delete */

// ******************************REPORTE SEMANAL
    const [isOpenWeek, setIsOpenWeek] = useState(false)

    const toggleModalWeek = () => {
      setIsOpenWeek(!isOpenWeek)
    }
// console.log(selectedShoppingId)
/********************************FIN REPORTE SEMANAL*/

// ******************************REPORTE mensual
const [isOpenMonth, setIsOpenMonth] = useState(false)

const toggleModalMonth = () => {
  setIsOpenMonth(!isOpenMonth)
}
// console.log(selectedShoppingId)
/********************************FIN REPORTE mensual*/

  
  
      return(
  
          <>
          <ModalReportShopping
          modalOpen={isOpenDel}
          toggleModal={toggleModalDel}
          />
          <ModalReportShoopWeek
          modalOpen={isOpenWeek}
          toggleModal={toggleModalWeek}
          />
          <ModalReportShoopMonth
          modalOpen={isOpenMonth}
          toggleModal={toggleModalMonth}
          />
  
                 {/*  */}
                 <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                    <DropdownToggle caret color="info" disabled={loading}>
                        {loading ? <Spinner size="sm" color="primary" /> : <><BsPrinter /> Imprimir </>}
                    </DropdownToggle>
                    <DropdownMenu>
                    <DropdownItem onClick={toggleModalDel}>
                    {loading ? <Spinner size="sm" color="primary" /> : <><BsPrinter /> Reporte Diario </>}
                    </DropdownItem>
                    <DropdownItem onClick={toggleModalWeek} disabled={loading}>
                        {loading ? <Spinner size="sm" color="primary" /> : <><BsPrinter /> Reporte Semanal </>}
                    </DropdownItem>
                    <DropdownItem onClick={toggleModalMonth} disabled={loading}>
                        {loading ? <Spinner size="sm" color="primary" /> : <><BsPrinter /> Reporte Mensual </>}
                    </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
        </>
  
      )
  }