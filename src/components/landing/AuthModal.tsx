import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff, Lock, Mail, User, Phone, Loader2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import { useLoginAdvisor } from "../../hooks/advisor/useLoginAdvisor";
import { useRegisterAdvisor } from "../../hooks/advisor/useRegisterAdvisor";

interface AuthModalProps {
  mode: "login" | "register" | null;
  onClose: () => void;
  onSwitch: (m: "login" | "register") => void;
}

export function AuthModal({ mode, onClose, onSwitch }: AuthModalProps) {
  const isLogin = mode === "login";
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
  });

  const { mutate: loginAdvisor, isPending: isLoginPending } = useLoginAdvisor();
  const { mutate: registerAdvisor, isPending: isRegisterPending } = useRegisterAdvisor();

  const validateLogin = () => {
    const newErrors: any = {};
    if (!loginForm.email) newErrors.email = "Email is required";
    if (!loginForm.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors: any = {};
    if (!registerForm.fullName) newErrors.fullName = "Full name is required";
    if (!registerForm.mobileNumber) newErrors.mobileNumber = "Mobile number is required";
    if (!registerForm.email) newErrors.email = "Email is required";
    if (!registerForm.password) newErrors.password = "Password is required";
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(registerForm.password)) {
      newErrors.password = "Strong password required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;

    loginAdvisor(loginForm, {
      onSuccess: (res) => {
        const data = res.data;
        localStorage.setItem("token", data.token);
        dispatch(loginSuccess({
          advisorId: data.advisorId,
          fullName: data.fullName,
          email: data.email
        }));
        toast.success("Welcome back!");
        onClose();
        navigate("/redirect");
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Login failed");
      }
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;

    registerAdvisor(registerForm, {
      onSuccess: () => {
        toast.success("Registration successful! Approval pending.");
        onSwitch("login");
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Registration failed");
      }
    });
  };

  return (
    <Dialog open={!!mode} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md landing-page dark:bg-slate-900 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl dark:text-white">
            {isLogin ? "Welcome back" : "Create account"}
          </DialogTitle>
          <DialogDescription className="dark:text-slate-400">
            {isLogin ? "Sign in to your CRM dashboard" : "Join us and manage your clients"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
          {!isLogin && (
            <>
              <div className="space-y-1">
                <Label htmlFor="fullName" className="dark:text-slate-300">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    className="pl-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    value={registerForm.fullName}
                    onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                  />
                </div>
                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="mobile" className="dark:text-slate-300">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="mobile"
                    placeholder="+91 9876543210"
                    className="pl-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                    value={registerForm.mobileNumber}
                    onChange={(e) => setRegisterForm({ ...registerForm, mobileNumber: e.target.value })}
                  />
                </div>
                {errors.mobileNumber && <p className="text-xs text-red-500">{errors.mobileNumber}</p>}
              </div>
            </>
          )}

          <div className="space-y-1">
            <Label htmlFor="email" className="dark:text-slate-300">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                className="pl-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                value={isLogin ? loginForm.email : registerForm.email}
                onChange={(e) => isLogin 
                  ? setLoginForm({ ...loginForm, email: e.target.value })
                  : setRegisterForm({ ...registerForm, email: e.target.value })
                }
              />
            </div>
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="dark:text-slate-300">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10 pr-10 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                value={isLogin ? loginForm.password : registerForm.password}
                onChange={(e) => isLogin 
                  ? setLoginForm({ ...loginForm, password: e.target.value })
                  : setRegisterForm({ ...registerForm, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full gradient-primary text-white shadow-soft hover:opacity-90 mt-2"
            disabled={isLoginPending || isRegisterPending}
          >
            {isLoginPending || isRegisterPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              isLogin ? "Sign In" : "Create Account"
            )}
            {!isLoginPending && !isRegisterPending && <ArrowRight className="ml-2 w-4 h-4" />}
          </Button>

          <p className="text-center text-sm dark:text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                onSwitch(isLogin ? "register" : "login");
                setErrors({});
              }}
              className="font-semibold text-primary hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
