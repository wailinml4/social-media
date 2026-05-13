import type { Request, Response, NextFunction } from 'express'
import { uploadMediaService } from '../services/uploadService.js'

export const uploadMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { image } = req.body

    if (!image) {
      return res.status(400).json({
        success: false,
        message: 'No media provided',
      })
    }

    const result = await uploadMediaService({ base64Data: image })

    return res.status(200).json({
      success: true,
      message: 'Media uploaded successfully',
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
