import { Navigate } from "react-router-dom";

const getUserFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));

    return {
      role: decoded.Role,
    };
  } catch {
    return null;
  }
};

const RoleRedirect = () => {
  const user = getUserFromToken();
  const isAdmin = user?.role === "SuperAdmin";

  if (isAdmin) {
    return <Navigate to="/company" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

export default RoleRedirect;