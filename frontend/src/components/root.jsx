import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/authcontext.jsx";

const Root = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/customer/dashboard");
            }
        } else {
            navigate("/login");
        }
    }, [user, navigate]);

    return null;
};

export default Root;