import axiosInstance from '../config/api.js'

const fileToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error: ProgressEvent<FileReader>) => reject(error)
  })
}

export const uploadImage = async (file: File): Promise<string> => {
  const base64 = await fileToBase64(file)
  const response = await axiosInstance.post('/upload/media', { image: base64 })
  return response.data.data.url
}
