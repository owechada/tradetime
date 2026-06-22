import { useParams } from "react-router-dom";

export const useAuth = (): boolean => {
    const { slug } = useParams()
    const user = localStorage.getItem(`UserData`);
    return user ? true : false;
};