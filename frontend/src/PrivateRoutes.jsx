import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContex";

export default function PrivateRoute({children}){
    const {token}= useAuth()

    return token ?  children : <Navigate to="/login-form" replace />;
}