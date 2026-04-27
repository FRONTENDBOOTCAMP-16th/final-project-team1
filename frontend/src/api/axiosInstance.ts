import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'https://final-project-team1.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
})
