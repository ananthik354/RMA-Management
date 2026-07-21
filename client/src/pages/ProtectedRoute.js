import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

    const username = localStorage.getItem("username");

    console.log("ProtectedRoute username:", username);

    if (!username) {
        console.log("Redirecting to login...");
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;