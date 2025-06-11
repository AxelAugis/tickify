import axios from "@/utils/axios";

export const checkProjectNameDuplicate = async (projectName: string, userId: number, projectId?: string | null) => {
    try {
        const datas = {
            projectName: projectName,
            projectId: projectId || null,
            userId: userId
        }
        const response = await axios.post('/project/check-duplicate', { params: datas });
        if(response.status === 200) {
            return {
                status: response.status,
                message: 'Le nom du projet est disponible.',
                isDuplicate: false
            }
        } else if (response.status === 400) {
            return {
                status: response.status,
                message: 'Le nom du projet est déjà utilisé.',
                isDuplicate: true
            }
        } else {
            return {
                status: response.status,
                message: 'Une erreur s\'est produite lors de la vérification du nom du projet.',
                isDuplicate: true
            }
        }
    } catch (error) {
        return {
            error: `Une erreur s'est produite lors de la vérification du nom du projet: ${error instanceof Error ? error.message : 'Erreur inconnue.'}`
        };
    }
}