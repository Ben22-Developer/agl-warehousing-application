import { useState, useRef, useEffect } from 'react'
import './Select.css'

function SelectComponent({ items, setSelected, placeholder = 'Select an option', className="" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const selectRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (item) => {
    setSelectedItem(item)
    setSelected(item)
    setIsOpen(false)
  }

  return (
    <div className="custom-select" ref={selectRef}>
      <div
        className={`custom-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="custom-select-value">
          {selectedItem || placeholder}
        </span>
        <span className={`custom-select-arrow ${isOpen ? 'open' : ''}`}>
          ▼
        </span>
      </div>

      {isOpen && (
        <div className={`custom-select-options ${className}`}>
          {items.map((item, index) => (
            <div
              key={index}
              className={`custom-select-option ${selectedItem === item ? 'selected' : ''}`}
              onClick={() => handleSelect(item)}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SelectComponent
