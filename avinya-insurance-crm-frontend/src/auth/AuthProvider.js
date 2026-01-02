import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { saveToken, clearToken, getToken } from "../utils/token";
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(getToken());
    const login = (jwt) => {
        saveToken(jwt);
        setToken(jwt);
    };
    const logout = () => {
        clearToken();
        localStorage.removeItem("advisor");
        setToken(null);
    };
    return (_jsx(AuthContext.Provider, { value: { token, login, logout }, children: children }));
};
