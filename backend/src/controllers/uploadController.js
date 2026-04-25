import { uploadMediaService } from "../services/uploadService.js"

export const uploadMedia = async (req, res, next) => {
  try {
    const { image } = req.body
    
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "No media provided",
      })
    }

    const result = await uploadMediaService(image)

    return res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
