import { User } from "@/types/user";
import axios from "@/utils/axios";

export const getProjects = async (userId: User['id']) => {
    try {
        const response = await axios.get(`/dashboard/projects/${userId}`);
        if (response.status === 200) {
            return {
                data: response.data,
                status: response.status
            }
        } else {
            return {
                error: `Une erreur s'est produite lors de la récupération des projets.`
            }
        }
    } catch (error) {
        return {
            error: `Une erreur s'est produite lors de la récupération des projets: ${error instanceof Error ? error.message : 'Erreur inconnue.'}`
        }
    }
}