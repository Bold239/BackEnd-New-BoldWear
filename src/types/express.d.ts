// src/types/express.d.ts
import { Request, Response, NextFunction } from 'express'

export type TypedHandler<TBody> = (
  req: Request<{}, {}, TBody>,
  res: Response,
  next: NextFunction
) => any
