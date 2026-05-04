import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AuthModalProps {
  mode: "login" | "register" | null;
  onClose: () => void;
  onSwitch: (m: "login" | "register") => void;
}

export function AuthModal({ mode, onClose, onSwitch }: AuthModalProps) {
  const isLogin = mode === "login";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(isLogin ? "Welcome back!" : "Account created!");
    onClose();
  };

  return (
    <Dialog open={!!mode} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {isLogin ? "Welcome back" : "Create your account"}
          </DialogTitle>
          <DialogDescription>
            {isLogin ? "Sign in to your Insurance CRM dashboard." : "Start your 14-day free trial. No card required."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          {!isLogin && (
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required placeholder="Jane Doe" />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required placeholder="you@company.com" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full gradient-primary text-white">
            {isLogin ? "Sign in" : "Create account"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => onSwitch(isLogin ? "register" : "login")}
              className="font-medium text-primary hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
