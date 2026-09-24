import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

    const token = localStorage.getItem("token");

    if (!token) {

        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("id");

        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;