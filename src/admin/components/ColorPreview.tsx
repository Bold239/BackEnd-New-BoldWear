import React from 'react'
import { BasePropertyProps } from 'adminjs'

const ColorPreview: React.FC<BasePropertyProps> = ({ record, property }) => {
  const hex = record?.params[property.path] || '#000000'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: hex,
          border: '1px solid #ccc',
        }}
      />
      <span>{hex}</span>
    </div>
  )
}

export default ColorPreview
