import {useAuth } from "../context/authcontext.jsx"
import { useNavigate } from "react-router";
import { useEffect } from "react";

const ProtectedRoutes = ({children,requiredRole})=>{
    const {user}=useAuth();
    const navigate=useNavigate();
    useEffect(()=>{
        if(!user){
            navigate("/login");
            return;
        }
        if(!requiredRole.includes(user.role)){
            navigate("/unauthorized");
            return;
        }
    },[user,navigate,requiredRole])
    if(!user) return null;
    if(!requiredRole.includes(user.role)) return null;
    return children;
}
export default ProtectedRoutes;