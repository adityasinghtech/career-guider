import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Emoji, ScreenReaderOnly } from "@/components/a11y/A11yUtils";

const OAUTH_PENDING_KEY = "pf_oauth_pending";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const handledByFormRef = useRef(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [showAdminLoginSuccess, setShowAdminLoginSuccess] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    if (handledByFormRef.current) return;

    const oauthPending = sessionStorage.getItem(OAUTH_PENDING_KEY) === "1";

    if (oauthPending) {
      console.info("[Auth] OAuth login detected, session found:", !!user);
      sessionStorage.removeItem(OAUTH_PENDING_KEY);

      (async () => {
        console.log("[Auth] Fetching user role for:", user.id);
        const { data: rows, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);

        if (roleError) console.error("[Auth] Role fetch error:", roleError);

        const isAdmin = rows?.some((r) => r.role === "admin");

        if (isAdmin) {
          toast.success("Admin login safal! 🛡️");
        } else {
          toast.success("Login safal! 🎉");
        }

        navigate(redirectTo, { replace: true });
      })();

      return;
    }

    sessionStorage.removeItem(OAUTH_PENDING_KEY);

    let cancelled = false;
    (async () => {
      const { data: rows } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      if (cancelled) return;
      const isAdmin = rows?.some((r) => r.role === "admin");
      if (isAdmin) {
        toast.success("Admin login safal! 🛡️ Admin dashboard khul raha hai...");
        setShowAdminLoginSuccess(true);
        await new Promise((r) => setTimeout(r, 2000));
        if (!cancelled) navigate(redirectTo, { replace: true });
      } else {
        toast.success("Login safal! Swagat hai! 🎉");
        navigate(redirectTo, { replace: true });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(form.email, form.password);
      if (error) {
        toast.error(error.message || "Login nahi ho paaya");
        setLoading(false);
        return;
      }
      handledByFormRef.current = true;

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error("Session nahi mila");
        setLoading(false);
        handledByFormRef.current = false;
        return;
      }

      const { data: rows } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      const isAdmin = rows?.some((r) => r.role === "admin");

      if (isAdmin) {
        toast.success("Admin login safal! 🛡️ Admin dashboard khul raha hai...");
        setShowAdminLoginSuccess(true);
        setLoading(false);
        setTimeout(() => navigate(redirectTo), 2000);
        return;
      }

      toast.success("Login safal! Swagat hai! 🎉");
      navigate(redirectTo);
      setLoading(false);
      return;
    }

    if (!form.name.trim()) {
      toast.error("Kripya apna naam likhein!");
      setLoading(false);
      return;
    }

    handledByFormRef.current = true;
    const { error } = await signUp(form.email, form.password, form.name);
    if (error) {
      handledByFormRef.current = false;
      toast.error(error.message || "Signup nahi ho paaya");
    } else {
      toast.success("Account ban gaya! Aapka swagat hai! 🎉");
      navigate(redirectTo);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    console.info("[Auth] Starting Google OAuth flow...");
    setGoogleLoading(true);
    sessionStorage.setItem(OAUTH_PENDING_KEY, "1");
    
    const loginRedirect = `${window.location.origin}/auth?redirect=${encodeURIComponent(redirectTo)}`;
    console.log("[Auth] OAuth Redirect URI:", loginRedirect);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: loginRedirect,
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline',
        }
      },
    });
    if (error) {
      console.error("[Auth] Google Login Error:", error);
      sessionStorage.removeItem(OAUTH_PENDING_KEY);
      toast.error(error.message);
      setGoogleLoading(false);
    }
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
            <div className="text-4xl mb-3" aria-hidden="true">
              {isLogin ? <Emoji symbol="👋" label="waving hand" /> : <Emoji symbol="🚀" label="rocket" />}
            </div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            {isLogin ? "Swagat Hai!" : "Account Banayein"}
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-1">
            {isLogin ? "Login karke apna dashboard dekhein" : "Free mein signup karein aur career guide paayein"}
          </p>
      </div>

      {showAdminLoginSuccess ? (
        <div className="p-4 rounded-xl border-2 border-green-600/50 bg-green-500/10 flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center rounded-full bg-green-600 text-white px-3 py-1.5 text-xs font-display font-bold uppercase tracking-wide shadow-sm" role="status">
            Admin Account
          </span>
          <p className="text-sm text-muted-foreground font-body" aria-live="polite">Thodi der mein dashboard khul jayega...</p>
          <Link
            to={redirectTo}
            className="text-sm text-primary font-display font-semibold hover:underline"
          >
            Dashboard kholo →
          </Link>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 border-2 border-border bg-card font-display font-semibold text-foreground py-3 rounded-xl hover:bg-muted transition-colors disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 shrink-0 animate-spin text-muted-foreground" />
            ) : (
              <svg
                className="w-5 h-5 shrink-0"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {isLogin ? "Google se Login Karein" : "Google se Signup Karein"}
            <ScreenReaderOnly> (Google login external window khulega)</ScreenReaderOnly>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-sm text-muted-foreground font-body">ya email se</span>
            </div>
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
                    aria-label="Aapka poora naam"
                    required={!isLogin}
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
                aria-label="Email address"
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
                aria-label="Password (kam se kam 6 characters)"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground"
                aria-label={showPass ? "Password chhupao" : "Password dikhao"}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 gradient-hero text-primary-foreground font-display font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? (
                <>Kripya Rukein... ⏳</>
              ) : isLogin ? (
                "Login Karein"
              ) : (
                "Sign Up Karein"
              )}
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
    </>
  )
}
        </motion.div >
      </div >
    </div >
  );
};

export default Auth;

