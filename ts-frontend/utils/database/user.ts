import axios from "../axios";

export const checkEmailDuplication = async (email: string): Promise<boolean> => {
    try {
        const response = await axios.post('/user/check-email-duplication', {
            email: email
        });

        return response.data.exists;
    } catch  {
        return false;
    }
}