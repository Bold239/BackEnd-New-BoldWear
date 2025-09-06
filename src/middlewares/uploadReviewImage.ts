// src/middlewares/uploadReviewImage.ts
import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { Request } from 'express'

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, path.join(__dirname, '../../public/reviews'))
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

export const uploadReviewImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|webp/
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, allowedTypes.test(ext))
  },
})
