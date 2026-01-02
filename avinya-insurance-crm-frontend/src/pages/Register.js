import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, Loader2, } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterAdvisor } from "../hooks/advisor/useRegisterAdvisor";
const Register = () => {
    const [form, setForm] = useState({
        fullName: "",
        mobileNumber: "",
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { mutate: registerAdvisor, isPending, isError, error, } = useRegisterAdvisor();
    /* ---------------- VALIDATION ---------------- */
    const validate = () => {
        const newErrors = {};
        // Full Name
        if (!form.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }
        else if (form.fullName.trim().length < 2) {
            newErrors.fullName = "Name must be at least 2 characters";
        }
        // Mobile
        if (!form.mobileNumber.trim()) {
            newErrors.mobileNumber = "Mobile number is required";
        }
        else if (!/^\+?[1-9]\d{9,14}$/.test(form.mobileNumber)) {
            newErrors.mobileNumber = "Enter a valid mobile number";
        }
        // Email
        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        }
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            newErrors.email = "Enter a valid email address";
        }
        // Password (Strong)
        if (!form.password) {
            newErrors.password = "Password is required";
        }
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(form.password)) {
            newErrors.password =
                "Password must contain uppercase, lowercase, number & special character";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    /* ---------------- REGISTER ---------------- */
    const handleRegister = () => {
        if (!validate())
            return;
        registerAdvisor(form, {
            onSuccess: () => {
                navigate("/login");
            },
        });
    };
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-green-50 px-4 py-8", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-green-800 rounded-2xl mb-4 shadow-lg", children: _jsx(User, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Create Account" }), _jsx("p", { className: "text-gray-800", children: "Join us and start managing your clients" })] }), _jsxs("div", { className: "bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden", children: [_jsxs("div", { className: "p-8 space-y-5", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-medium text-gray-700 block", children: "Full Name" }), _jsxs("div", { className: "relative", children: [_jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }), _jsx("input", { type: "text", name: "fullName", value: form.fullName, onChange: handleChange, placeholder: "John Doe", className: `w-full pl-11 pr-4 py-3 rounded-lg outline-none
                    ${errors.fullName
                                                        ? "border border-red-500 focus:ring-2 focus:ring-red-500"
                                                        : "border border-gray-300 focus:ring-2 focus:ring-green-500"}` })] }), errors.fullName && (_jsx("p", { className: "text-xs text-red-600", children: errors.fullName }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-medium text-gray-700 block", children: "Mobile Number" }), _jsxs("div", { className: "relative", children: [_jsx(Phone, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }), _jsx("input", { type: "tel", name: "mobileNumber", value: form.mobileNumber, onChange: handleChange, placeholder: "+91 9876543210", className: `w-full pl-11 pr-4 py-3 rounded-lg outline-none
                    ${errors.mobileNumber
                                                        ? "border border-red-500 focus:ring-2 focus:ring-red-500"
                                                        : "border border-gray-300 focus:ring-2 focus:ring-green-500"}` })] }), errors.mobileNumber && (_jsx("p", { className: "text-xs text-red-600", children: errors.mobileNumber }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-medium text-gray-700 block", children: "Email Address" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }), _jsx("input", { type: "email", name: "email", value: form.email, onChange: handleChange, placeholder: "you@company.com", className: `w-full pl-11 pr-4 py-3 rounded-lg outline-none
                    ${errors.email
                                                        ? "border border-red-500 focus:ring-2 focus:ring-red-500"
                                                        : "border border-gray-300 focus:ring-2 focus:ring-green-500"}` })] }), errors.email && (_jsx("p", { className: "text-xs text-red-600", children: errors.email }))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-sm font-medium text-gray-700 block", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }), _jsx("input", { type: showPassword ? "text" : "password", name: "password", value: form.password, onChange: handleChange, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: `w-full pl-11 pr-11 py-3 rounded-lg outline-none
                    ${errors.password
                                                        ? "border border-red-500 focus:ring-2 focus:ring-red-500"
                                                        : "border border-gray-300 focus:ring-2 focus:ring-green-500"}` }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800", children: showPassword ? (_jsx(EyeOff, { className: "w-5 h-5" })) : (_jsx(Eye, { className: "w-5 h-5" })) })] }), errors.password && (_jsx("p", { className: "text-xs text-red-600", children: errors.password }))] }), isError && (_jsx("p", { className: "text-sm text-red-600 text-center", children: error?.response?.data?.message ||
                                        "Registration failed" })), _jsx("button", { onClick: handleRegister, disabled: isPending, className: "w-full bg-green-800 text-white py-3 rounded-lg font-medium hover:bg-green-900 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60", children: isPending ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-5 h-5 animate-spin" }), "Creating account..."] })) : (_jsxs(_Fragment, { children: ["Create Account", _jsx(ArrowRight, { className: "w-5 h-5" })] })) })] }), _jsxs("div", { className: "bg-gray-50 px-8 py-4 border-t border-gray-100 text-center text-sm text-gray-800", children: ["Already have an account?", " ", _jsx(Link, { to: "/login", className: "text-green-800 hover:text-green-700 font-semibold", children: "Sign in" })] })] })] }) }));
};
export default Register;
