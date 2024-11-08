import React, { useState, useEffect, useRef } from 'react'
import dayjs from 'dayjs';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import es from 'date-fns/locale/es';
import addDays from 'date-fns/addDays';
import '../../styles/DatePicker.scss'
import { FcOvertime } from 'react-icons/fc'
import { InputGroup, InputGroupText } from 'reactstrap'

function DatePicker(props) {
  // const [selectedDateRange, setSelectedDateRange] = useState([
  //   {
  //     startDate: new Date(),
  //     endDate: addDays(new Date(),7),
  //     key: 'selection',
  //   },
  // ]);
  /* Rango seleccionado */
  // useEffect(() => {

  // }, [selectedDateRange])
  /* Abrir y cerrar el datepicker */
  const [openDate, setOpenDate] = useState(false)
  // get the element to toggle
  const refOne = useRef(null)

  /* EVENTOS PARA OCULTAR EL DATE PICKER */
  const hideOnClickOutside = e => {
    if(refOne.current && !refOne.current.contains(e.target)) {
      setOpenDate(false)
    }
  }

  const hideOnEscape = (e) => {
    // console.log(e.key)
    if(e.key === "Escape") {
      setOpenDate(false)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', hideOnEscape, true)
    document.addEventListener('click', hideOnClickOutside, true)
  }, [])

  // const handleDateChange = (ranges) => {
  //   setSelectedDateRange([ranges.selection]);
  // };
  
  /* Opciones de personalización del datepicker range */
  const options = {
    locale: es,
    ranges: props.selectedDateRange,
    onChange: props.handleDateChange,
    months: 2,
    direction: "horizontal",
    /* moveRangeOnFirstSelection: false, */
  }; 
  return (
    <div>
      <InputGroup className="date-picker">
        <label htmlFor="date-filter">
        <InputGroupText >
          <FcOvertime />
        </InputGroupText>
        </label>
        <input 
          value={ `Fecha desde ${dayjs(props.selectedDateRange[0].startDate).format('YYYY-MM-DD')} hasta ${dayjs(props.selectedDateRange[0].startDate).format('YYYY-MM-DD')}` }
          className='form-control inputBox'
          readOnly
          onClick={() => setOpenDate(prevState => !prevState)}
          id="date-filter"
        />
      
      </InputGroup>
        <div className="calendarContainer" ref={refOne}>
        {openDate && 
          <DateRange
            {...options}
          />
        }
      </div>
    </div>
  )
}

export default DatePicker