import axios from 'axios';

const apiClient = axios.create({
    baseURL: " http://127.0.0.1:8000/api",
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

apiClient.interceptors.response.use(
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

export default apiClient;