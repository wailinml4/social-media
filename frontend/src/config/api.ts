import axios from 'axios'
import type { AxiosResponse, AxiosError } from 'axios'
import env from './env'

const axiosInstance = axios.create({
  baseURL: `${env.VITE_BACKEND_URL}/api`,
  withCredentials: true,
})

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const message = (error.response?.data as { message?: string })?.message || error.message || 'API Error'
    return Promise.reject(new Error(message))
  },
)

export default axiosInstance
