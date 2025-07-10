import Axios from "axios";
import { apiUrl } from "./api";

const axios = Axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export default axios;