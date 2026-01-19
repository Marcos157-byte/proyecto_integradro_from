import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:3000/api
  headers: { "Content-Type": "application/json" },
});

// 👉 Interceptor de request: agrega el token automáticamente
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 👉 Interceptor de response: captura errores globalmente
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || "Error en el servidor";
    return Promise.reject(new Error(msg));
  }
);

export default client;