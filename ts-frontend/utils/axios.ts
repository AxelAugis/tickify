import Axios from "axios";
import { apiUrl } from "./api";

const axios = Axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important pour envoyer automatiquement les cookies
});

// Pas besoin d'interceptor pour les cookies JWT - ils sont automatiquement gérés
export default axios;