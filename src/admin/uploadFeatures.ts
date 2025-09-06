// src/admin/uploadFeatures.ts

import uploadFeature from '@adminjs/upload'
import path from 'path'

const uploadPath = path.join(__dirname, '..', '..', 'public', 'uploads')

export const imagePathUploadFeature = uploadFeature({
  provider: { local: { bucket: uploadPath } },
  properties: {
    key: 'imagePath',
    file: 'imagePath_file',
    filePath: 'imagePath_filePath', // nome único
    filesToDelete: 'imagePath_filesToDelete', // nome único
    mimeType: 'imagePath_mime',
    bucket: 'imagePath_bucket',
    size: 'imagePath_size',
    filename: 'imagePath_filename',
  },
  uploadPath: (_record, filename) => `imagePath/${Date.now()}-${filename}`,
})

export const fullWidthImageUploadFeature = uploadFeature({
  provider: { local: { bucket: uploadPath } },
  properties: {
    key: 'fullWidthImageUrl',
    file: 'fullWidthImageUrl_file',
    filePath: 'fullWidthImageUrl_filePath', // corrigido
    filesToDelete: 'fullWidthImageUrl_filesToDelete', // corrigido
    mimeType: 'fullWidthImageUrl_mime',
    bucket: 'fullWidthImageUrl_bucket',
    size: 'fullWidthImageUrl_size',
    filename: 'fullWidthImageUrl_filename',
  },
  uploadPath: (_record, filename) => `fullWidthImageUrl/${Date.now()}-${filename}`,
})

export const measureTableUploadFeature = uploadFeature({
  provider: { local: { bucket: uploadPath } },
  properties: {
    key: 'measureTableUrl',
    file: 'measureTableUrl_file',
    filePath: 'measureTableUrl_filePath', // corrigido
    filesToDelete: 'measureTableUrl_filesToDelete', // corrigido
    mimeType: 'measureTableUrl_mime',
    bucket: 'measureTableUrl_bucket',
    size: 'measureTableUrl_size',
    filename: 'measureTableUrl_filename',
  },
  uploadPath: (_record, filename) => `measureTableUrl/${Date.now()}-${filename}`,
})

