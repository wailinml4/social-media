import axios from "axios"

const axiosInstance = axios.create({
	baseURL: "http://localhost:3000/api",
	withCredentials: true,
})

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		const message = error.response?.data?.message || error.message || "API Error"
		return Promise.reject(new Error(message))
	}
)

export default axiosInstance