import axiosInstance from '../config/api';

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const uploadImage = async (file) => {
  const base64 = await fileToBase64(file);
  const response = await axiosInstance.post('/upload/media', { image: base64 });
  return response.data.data.url;
};
