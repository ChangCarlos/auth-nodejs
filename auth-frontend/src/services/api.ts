import axios from 'axios';

const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3001';

export const api = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
})