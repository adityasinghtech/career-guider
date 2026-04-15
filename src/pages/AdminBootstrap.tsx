import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { KeyRound, Loader2, Shield, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const errorMessages: Record<string, string> = {
  not_authenticated: "Pehle login karein.",
  not_configured: "Server par abhi setup secret set nahi hai — Supabase SQL se configure karein.",
  invalid_secret: "Galat secret. Dobara try karein.",
  admin_already_exists: "Pehle se koi admin hai. Dashboard se naye admin bana sakte hain.",
};

const AdminBootstrap = () => {
  const navigate = useNavigate();
  const { user, loading, refreshRole } = useAuth();
  const [secret, setSecret] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Pehle login karein");
      return;
    }
    const trimmed = secret.trim();
    if (!trimmed) {
      toast.error("Setup secret likhein");
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.rpc("bootstrap_first_admin", {
      p_secret: trimmed,
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message || "Kuch galat ho gaya");
      return;
    }

    const payload = data as { ok?: boolean; error?: string } | null;
    if (payload?.ok) {
      toast.success("Aap ab admin hain! Dashboard khol rahe hain.");
      await refreshRole();
      navigate("/dashboard");
      return;
    }
    const code = payload?.error ?? "unknown";
    toast.error(errorMessages[code] ?? `Error: ${code}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce"><span aria-hidden="true">⏳</span></div>
          <p className="text-muted-foreground font-display">Loading...</p>
        </div>
      </div>
    );
  }

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
            <div className="w-14 h-14 mx-auto rounded-xl gradient-hero flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="font-display font-bold text-2xl text-foreground">Team access</h1>
            <p className="text-muted-foreground font-body text-sm mt-2">
              Pehla admin banane ke liye deploy par set kiye gaye setup secret ka upyog karein. Ye URL team ko
              batayein — public nav mein link nahi hai.
            </p>
          </div>

          {!user ? (
            <div className="space-y-4 text-center">
              <p className="font-body text-sm text-muted-foreground">
                Pehle apne team account se login karein (wahi email/password jo aap use karenge).
              </p>
              <Link
                to="/auth?redirect=/admin/bootstrap"
                className="inline-flex items-center justify-center gap-2 w-full gradient-hero text-primary-foreground font-display font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                Login karein <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-muted-foreground font-body">
                Google OAuth bhi chalega — redirect wapas yahi aayega.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  autoComplete="off"
                  placeholder="Setup secret (Supabase mein set)..."
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border bg-card font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 gradient-hero text-primary-foreground font-display font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Ho raha hai...
                  </>
                ) : (
                  "Pehla admin confirm karein"
                )}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-border text-center">
            <Link to="/" className="text-sm text-primary font-display font-semibold hover:underline">
              Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminBootstrap;
