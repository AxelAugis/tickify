export const logout = async () => {
    try {
        document.cookie = "jwt_hp=; Max-Age=0; path=/";
        document.cookie = "jwt_s=; Max-Age=0; path=/";
        return true;
    } catch {
        return false;
    }
}