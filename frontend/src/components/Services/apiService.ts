import axios from 'axios';

const apiService = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    
});

apiService.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

apiService.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;
        if (response.status === 401) {
            localStorage.removeItem("token");
        }
        throw error;
    }
);

export default apiService;