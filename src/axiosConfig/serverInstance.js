import axios from "axios";
import { env } from "../env";

export const serverInstance = axios.create({
    baseURL: env === 'dev' ? 'http://localhost:4545' : 'https://ticket-server-production.up.railway.app/'
});