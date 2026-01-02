import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginAdvisor } from "../hooks/advisor/useLoginAdvisor";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { mutate: loginAdvisor, isPending, isError, error, } = useLoginAdvisor();
    /* ---------------- VALIDATION ---------------- */
    const validate = () => {
        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = "Email is required";
        }
        else if (!/^\S+@\S+\.\S+$/.test(email)) {
            newErrors.email = "Enter a valid email address";
        }
        if (!password.trim()) {
            newErrors.password = "Password is required";
        }
        else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    /* ---------------- LOGIN ---------------- */
    const handleLogin = () => {
        if (!validate())
            return;
        loginAdvisor({ email, password }, {
           onSuccess: (res) => {
            const data = res.data;

            localStorage.setItem("token", data.token);

            dispatch(loginSuccess({
                advisorId: data.advisorId,
                fullName: data.fullName,
                email: data.email,
            }));

            // ✅ allow auth guards to see token
            setTimeout(() => {
                navigate("/", { replace: true });
            }, 0);
            },

        });
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-green-50 px-4 py-8", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-2xl mb-4 shadow-lg", children: _jsx(Lock, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Welcome Back" }), _jsx("p", { className: "text-gray-800", children: "Sign in to access your CRM dashboard" })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden", children: [_jsxs("div", { className: "p-8 space-y-6", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-medium text-gray-700 block", children: "Email Address" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }), _jsx("input", { type: "email", placeholder: "you@company.com", value: email, onChange: (e) => {
                                                        setEmail(e.target.value);
                                                        setErrors((prev) => ({ ...prev, email: undefined }));
                                                    }, className: `w-full pl-11 pr-4 py-3 rounded-lg outline-none transition-all
                    ${errors.email
                                                        ? "border border-red-500 focus:ring-2 focus:ring-red-500"
                                                        : "border border-gray-300 focus:ring-2 focus:ring-green-500"}` })] }), errors.email && (_jsx("p", { className: "text-xs text-red-600", children: errors.email }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-medium text-gray-700 block", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }), _jsx("input", { type: showPassword ? "text" : "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: (e) => {
                                                        setPassword(e.target.value);
                                                        setErrors((prev) => ({ ...prev, password: undefined }));
                                                    }, className: `w-full pl-11 pr-11 py-3 rounded-lg outline-none transition-all
                    ${errors.password
                                                        ? "border border-red-500 focus:ring-2 focus:ring-red-500"
                                                        : "border border-gray-300 focus:ring-2 focus:ring-green-500"}` }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800", children: showPassword ? (_jsx(EyeOff, { className: "w-5 h-5" })) : (_jsx(Eye, { className: "w-5 h-5" })) })] }), errors.password && (_jsx("p", { className: "text-xs text-red-600", children: errors.password }))] }), isError && (_jsx("p", { className: "text-sm text-red-600 text-center", children: error?.response?.data?.message ||
                                        "Invalid email or password" })), _jsx("button", { onClick: handleLogin, disabled: isPending, className: "w-full bg-slate-800 text-white py-3 rounded-lg font-medium hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60", children: isPending ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-5 h-5 animate-spin" }), "Signing in..."] })) : (_jsxs(_Fragment, { children: ["Sign In", _jsx(ArrowRight, { className: "w-5 h-5" })] })) })] }), _jsxs("div", { className: "bg-gray-50 px-8 py-4 border-t border-gray-100 text-center text-sm text-gray-800", children: ["Don't have an account?", " ", _jsx(Link, { to: "/register", className: "text-green-800 hover:text-green-700 font-semibold", children: "Create one now" })] })] })] }) }));
};
export default Login;
