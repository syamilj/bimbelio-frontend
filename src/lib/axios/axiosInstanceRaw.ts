import { env } from '@/env.mjs';
import axios from 'axios';

const axiosInstanceRaw = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstanceRaw;
