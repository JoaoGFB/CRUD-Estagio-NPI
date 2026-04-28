import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', 
});

//intercepta a requisição
api.interceptors.request.use((config) => {
  //tenta pegar o token guardado no navegador
  const token = localStorage.getItem('@NPI_Token');
  
  //se existir um token injeta ela no cabeçalho de autorização
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;