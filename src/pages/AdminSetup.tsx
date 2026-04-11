import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, KeyRound, Loader2, Shield, UserPlus } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Tables } from "@/integrations/supabase/types";

type InviteRow = Tables<"admin_invite_codes">;

const AdminSetup = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, role, refreshRole } = useAuth();
  const [inviteInput, setInviteInput] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [codeName, setCodeName] = useState("");
  const [creating, setCreating] = useState(false);
  const [codes, setCodes] = useState<InviteRow[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?redirect=/admin-setup", { replace: true });
    }
  }, [authLoading, user, navigate]);

  const loadCodes = async () => {
    setLoadingCodes(true);
    const { data, error } = await supabase
      .from("admin_invite_codes")
      .select("*")
      .order("created_at", { ascending: false });
    setLoadingCodes(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setCodes((data as InviteRow[]) ?? []);
  };

  useEffect(() => {
    if (role === "admin" && user) {
      loadCodes();
    }
  }, [role, user]);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const trimmed = inviteInput.trim();
    if (!trimmed) {
      toast.error("Invite code daalein");
      return;
    }
    setRedeeming(true);
    const { data, error } = await supabase.rpc("redeem_admin_invite", { p_code: trimmed });
    setRedeeming(false);

    if (error) {
      toast.error("Galat code hai ya already use ho chuka hai.");
      return;
    }

    const payload = data as { ok?: boolean; already_admin?: boolean } | null;
    if (payload?.ok) {
      if (payload.already_admin) {
        toast.success("Aap pehle se admin hain.");
      } else {
        toast.success("Admin ban gaye! Dashboard reload karo.");
      }
      await refreshRole();
      return;
    }
    toast.error("Galat code hai ya already use ho chuka hai.");
  };

  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || role !== "admin") return;
    const trimmed = codeName.trim();
    if (!trimmed) {
      toast.error("Code naam likhein");
      return;
    }
    setCreating(true);
    const { error } = await supabase.from("admin_invite_codes").insert({
      code: trimmed,
      created_by: user.id,
      is_active: true,
    });
    setCreating(false);
    if (error) {
      if (error.code === "23505") {
        toast.error("Yeh code pehle se maujood hai.");
      } else {
        toast.error(error.message);
      }
      return;
    }
    toast.success("Naya code ban gaya.");
    setCodeName("");
    loadCodes();
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Copy ho gaya!");
    } catch {
      toast.error("Copy nahi ho saka");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">⏳</div>
          <p className="text-muted-foreground font-display">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border-2 border-border p-8 shadow-card"
        >
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-xl gradient-hero flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="font-display font-bold text-2xl text-foreground">Admin setup</h1>
            <p className="text-muted-foreground font-body text-xs mt-3 opacity-90">
              Yeh page sirf authorized log ke liye hai. 🔒
            </p>
          </div>

          <Tabs defaultValue="redeem" className="w-full">
            <TabsList
              className={`grid w-full ${role === "admin" ? "grid-cols-2" : "grid-cols-1"} mb-4`}
            >
              <TabsTrigger value="redeem" className="font-display text-xs sm:text-sm">
                Invite Code se Admin Bano
              </TabsTrigger>
              {role === "admin" && (
                <TabsTrigger value="create" className="font-display text-xs sm:text-sm">
                  Admin Invite Code Banao
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="redeem" className="space-y-4 mt-4">
              <form onSubmit={handleRedeem} className="space-y-4">
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="Admin Invite Code daalo"
                    value={inviteInput}
                    onChange={(e) => setInviteInput(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border bg-card font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={redeeming}
                  className="w-full flex items-center justify-center gap-2 gradient-hero text-primary-foreground font-display font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {redeeming ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Ho raha hai...
                    </>
                  ) : (
                    "Admin Access Lo"
                  )}
                </button>
              </form>
            </TabsContent>

            {role === "admin" && (
              <TabsContent value="create" className="space-y-6 mt-4">
                <form onSubmit={handleCreateCode} className="space-y-4">
                  <div className="relative">
                    <UserPlus className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Code naam (e.g. FOR-TEACHER-1)"
                      value={codeName}
                      onChange={(e) => setCodeName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border bg-card font-body text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full flex items-center justify-center gap-2 gradient-hero text-primary-foreground font-display font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Ban raha hai...
                      </>
                    ) : (
                      "Naya Code Banao"
                    )}
                  </button>
                </form>

                <div>
                  <p className="font-display font-semibold text-sm text-foreground mb-3">Sab codes</p>
                  {loadingCodes ? (
                    <p className="text-sm text-muted-foreground font-body">Loading...</p>
                  ) : codes.length === 0 ? (
                    <p className="text-sm text-muted-foreground font-body">Abhi koi code nahi.</p>
                  ) : (
                    <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {codes.map((row) => {
                        const used = !row.is_active || row.used_by != null;
                        return (
                          <li
                            key={row.id}
                            className="flex items-center justify-between gap-2 rounded-xl border border-border bg-background/50 px-3 py-2.5"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="font-mono text-sm text-foreground truncate">{row.code}</p>
                              <p className="text-xs text-muted-foreground font-body">
                                {used ? "Used" : "Active"}
                                {row.used_at ? ` · ${new Date(row.used_at).toLocaleString()}` : ""}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => copyCode(row.code)}
                              className="shrink-0 p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                              aria-label="Copy code"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>

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

export default AdminSetup;
