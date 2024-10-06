import React, { useState, useEffect } from 'react'
import { Input, Button } from 'reactstrap'
import { FaTimes } from 'react-icons/fa'
import { AiOutlineSearch } from 'react-icons/ai'

const SearchInput = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showInput, setShowInput] = useState(false)

  useEffect(() => {
    // Llamar al callback solo cuando cambia el valor del input
    onSearch(searchTerm)
  }, [searchTerm]) // Añadir searchTerm como dependencia

 

  const toggleInput = () => {
    setShowInput(!showInput)
    setSearchTerm('') // Limpiar el término de búsqueda al ocultar el input
  }

  return (
    <div className="col-12 d-flex justify-content-end">
        <div 
        style={{ display: "flex", width: "100%"}}
        >
          
          <Input
            type="text"
            placeholder="Buscar registros"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: '100%' }}
          />
          <Button
            color='primary' onClick={toggleInput}>
              <AiOutlineSearch size={25}/>
            </Button>
        </div>
    </div>
  )
}

export default SearchInput

