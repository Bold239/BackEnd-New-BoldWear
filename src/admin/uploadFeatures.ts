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

export const videoUploadFeature = uploadFeature({
  provider: { local: { bucket: uploadPath } },
  properties: {
    key: 'url', // campo real no banco
    file: 'video_file', // campo virtual para upload
    filePath: 'video_filePath',
    filesToDelete: 'video_filesToDelete',
    mimeType: 'video_mime',
    bucket: 'video_bucket',
    size: 'video_size',
    filename: 'video_filename',
  },
  uploadPath: (_record, filename) => `videos/${Date.now()}-${filename}`,
})

export const productImageUploadFeature = uploadFeature({
  provider: { local: { bucket: uploadPath } },
  properties: {
    key: 'url', // campo real no banco
    file: 'product_image_file',
    filePath: 'product_image_filePath',
    filesToDelete: 'product_image_filesToDelete',
    mimeType: 'product_image_mime',
    bucket: 'product_image_bucket',
    size: 'product_image_size',
    filename: 'product_image_filename',
  },
  uploadPath: (_record, filename) => `product-images/${Date.now()}-${filename}`,
})

export const categoryBannerUploadFeature = uploadFeature({
  provider: { local: { bucket: uploadPath } },
  properties: {
    key: 'bannerUrl', // campo real no banco
    file: 'bannerUrl_file',
    filePath: 'bannerUrl_filePath',
    filesToDelete: 'bannerUrl_filesToDelete',
    mimeType: 'bannerUrl_mime',
    bucket: 'bannerUrl_bucket',
    size: 'bannerUrl_size',
    filename: 'bannerUrl_filename',
  },
  uploadPath: (_record, filename) => `category-banners/${Date.now()}-${filename}`,
});

export const modelPhotoUploadFeature = uploadFeature({
  provider: { local: { bucket: uploadPath } },
  properties: {
    key: 'url', // campo real no banco
    file: 'modelPhoto_file',
    filePath: 'modelPhoto_filePath',
    filesToDelete: 'modelPhoto_filesToDelete',
    mimeType: 'modelPhoto_mime',
    bucket: 'modelPhoto_bucket',
    size: 'modelPhoto_size',
    filename: 'modelPhoto_filename',
  },
  uploadPath: (_record, filename) => `model-photos/${Date.now()}-${filename}`,
});
