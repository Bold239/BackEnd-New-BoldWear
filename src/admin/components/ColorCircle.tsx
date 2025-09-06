import React from 'react'
import { BasePropertyProps } from 'adminjs'

const ColorCircle: React.FC<BasePropertyProps> = ({ record, onChange, property }) => {
  const value = record?.params?.color || ''

  const colors = value.split(',').map((item: string) => item.trim()).filter(Boolean)

  const handleClick = (color: string) => {
    const newValue = value === color ? '' : color
    onChange?.(property.name, newValue)
  }

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {colors.map((color: string) => (

        <div
          key={color}
          title={color}
          onClick={() => handleClick(color)}
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            border: value === color ? '3px solid #FCA311' : '1px solid #ccc',
            backgroundColor: color,
            cursor: 'pointer',
          }}
        />
      ))}
    </div>
  )
}

export default ColorCircle
