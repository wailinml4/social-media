import cloudinary from "../config/cloudinary.js"

export const uploadMediaService = async (base64Data) => {
  const result = await cloudinary.uploader.upload(base64Data, {
    folder: 'social-media/posts',
    resource_type: 'auto',
  })

  return {
    url: result.secure_url,
    publicId: result.public_id,
  }
}
