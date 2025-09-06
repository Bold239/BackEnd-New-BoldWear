import React from 'react'
import { BasePropertyProps } from 'adminjs'

const ImagePreview: React.FC<BasePropertyProps> = (props) => {
  const { record, property } = props

  if (!record) return <p>Registro não encontrado.</p>

  const imageUrl = record.params[property.name]

  if (!imageUrl) return <p>Nenhuma imagem enviada.</p>

  return (
    <div>
      <img
        src={imageUrl.startsWith('/') ? imageUrl : `/uploads/${imageUrl}`}
        alt="Preview"
        style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
      />
    </div>
  )
}

export default ImagePreview
