import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(form.email, form.password);
      if (error) {
        toast.error(error.message || "Login nahi ho paaya");
      } else {
        toast.success("Login safal! Swagat hai! 🎉");
        navigate("/dashboard");
      }
    } else {
      if (!form.name.trim()) {
        toast.error("Kripya apna naam likhein!");
        setLoading(false);
        return;
      }
      const { error } = await signUp(form.email, form.password, form.name);
      if (error) {
        toast.error(error.message || "Signup nahi ho paaya");
      } else {
        toast.success("Account ban gaya! Aapka swagat hai! 🎉");
        navigate("/dashboard");
      }
    }
    setLoading(false);
  };

  const inputClass =
    "w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border bg-card font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border-2 border-border p-8 shadow-card"
        >
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">{isLogin ? "👋" : "🚀"}</div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              {isLogin ? "Swagat Hai!" : "Account Banayein"}
            </h1>
            <p className="text-muted-foreground font-body text-sm mt-1">
              {isLogin ? "Login karke apna dashboard dekhein" : "Free mein signup karein aur career guide paayein"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Aapka naam..."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  maxLength={100}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email address..."
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password (min 6 characters)..."
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`${inputClass} pr-11`}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 gradient-hero text-primary-foreground font-display font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? "Kripya Rukein... ⏳" : isLogin ? "Login Karein" : "Sign Up Karein"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary font-display font-semibold hover:underline"
            >
              {isLogin ? "Account nahi hai? Sign Up karein" : "Pehle se account hai? Login karein"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
