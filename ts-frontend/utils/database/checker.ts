import axios from "@/utils/axios";
import { isAxiosError } from "axios";

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
                datas: response.data,
                status: response.status
           }
        }
    } catch (error: unknown) {
        return {
            status: isAxiosError(error) ? error.response?.status || 500 : 500,
        }
    }
}