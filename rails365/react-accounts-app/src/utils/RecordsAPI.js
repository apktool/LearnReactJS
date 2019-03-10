import axios from 'axios';

const api = process.env.REACT_APP_RECORDS_API_URL || "http://localhost:3001";

export const getAll = () => axios.get(`${api}/data`);
