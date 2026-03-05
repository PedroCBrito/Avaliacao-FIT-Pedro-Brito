import axios from 'axios';

export const api = axios.create({
  // Atualize a baseURL de acordo com a URL onde seu backend está rodando
  baseURL: 'http://localhost:5000', 
  headers: {
    'Content-Type': 'application/json',
  },
});
