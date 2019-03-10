import axios from 'axios';

const api = process.env.REACT_APP_RECORDS_API_URL || "http://localhost:3001";

export const getAll = () => axios.get(`${api}/data`);
export const create = (body) => axios.post(`${api}/data`, body);
export const update = (id, body) => axios.put(`${api}/data/${id}`, body);
export const remove = (id) => axios.delete(`${api}/data/${id}`);
