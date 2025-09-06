import React from 'react'
import { BasePropertyProps } from 'adminjs'

const ModelPreview: React.FC<BasePropertyProps> = ({ record, onChange, property }) => {
  const value = record?.params?.model || ''

  const models = value.split(',').map((item: string) => item.trim()).filter(Boolean)

  const handleClick = (model: string) => {
    const newValue = value === model ? '' : model
    onChange?.(property.name, newValue)
  }

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {models.map((model: string) => (
        <div
          key={model}
          onClick={() => handleClick(model)}
          style={{
            border: value === model ? '2px solid #FCA311' : '1px solid #ccc',
            borderRadius: 4,
            padding: 4,
            width: 60,
            height: 60,
            cursor: 'pointer',
            backgroundImage: `url(${model})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}
    </div>
  )
}

export default ModelPreview
