import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Copy, Loader2, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type InviteRow = Tables<"admin_invite_codes">;
type RedeemStatus = "idle" | "loading" | "success" | "error";

const AdminSetup = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, role, refreshRole } = useAuth();

  const [tab, setTab] = useState<"invite" | "manage">("invite");

  const [codeInput, setCodeInput] = useState("");
  const [redeemStatus, setRedeemStatus] = useState<RedeemStatus>("idle");
  const [redeemMessage, setRedeemMessage] = useState("");

  const [newCode, setNewCode] = useState("");
  const [generating, setGenerating] = useState(false);
  const [codes, setCodes] = useState<InviteRow[]>([]);
  const [codesLoading, setCodesLoading] = useState(false);

  const loadCodes = async () => {
    setCodesLoading(true);
    const { data, error } = await supabase
      .from("admin_invite_codes")
      .select("*")
      .order("created_at", { ascending: false });
    setCodesLoading(false);
    if (error) {
      setCodes([]);
      return;
    }
    setCodes((data as InviteRow[]) ?? []);
  };

  useEffect(() => {
    if (role === "admin" && user) {
      loadCodes();
    }
  }, [role, user?.id]);

  const handleRedeem = async () => {
    if (!user) {
      navigate("/auth?redirect=/admin-setup");
      return;
    }

    const normalized = codeInput.trim().toUpperCase();
    if (!normalized) return;

    setRedeemStatus("loading");
    setRedeemMessage("");

    /* RLS blocks direct select/update on admin_invite_codes for non-admins.
       Atomic redeem (validate + user_roles + mark used) runs in SECURITY DEFINER RPC. */
    const { data, error } = await supabase.rpc("redeem_admin_invite", { p_code: normalized });

    if (error) {
      setRedeemStatus("error");
      setRedeemMessage("Galat code hai ya already use ho chuka hai <span aria-hidden='true'>❌</span>");
      return;
    }

    const payload = data as { ok?: boolean; already_admin?: boolean } | null;
    if (!payload?.ok) {
      setRedeemStatus("error");
      setRedeemMessage("Galat code hai ya already use ho chuka hai <span aria-hidden='true'>❌</span>");
      return;
    }

    await refreshRole();
    setRedeemStatus("success");
    setRedeemMessage(
      payload.already_admin ? "Aap pehle se admin hain! Dashboard pe jao <span aria-hidden='true'>✅</span>" : "Admin ban gaye! Dashboard pe jao <span aria-hidden='true'>✅</span>",
    );
  };

  const handleGenerateCode = async () => {
    if (!user || role !== "admin") return;
    const trimmed = newCode.trim();
    if (!trimmed) return;

    setGenerating(true);
    const { error } = await supabase.from("admin_invite_codes").insert({
      code: trimmed.toUpperCase(),
      created_by: user.id,
      is_active: true,
    });
    setGenerating(false);

    if (error) {
      return;
    }
    setNewCode("");
    loadCodes();
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* ignore */
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce"><span aria-hidden='true'>⏳</span></div>
          <p className="text-muted-foreground font-display">Loading...</p>
        </div>
      </div>
    );
  }

  const inputClass =
    "border-2 border-border rounded-xl px-4 py-3 bg-background font-body text-foreground w-full focus:border-primary outline-none transition-colors";

  const btnPrimary =
    "gradient-hero text-primary-foreground font-display font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:pointer-events-none";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-card border-2 border-border rounded-2xl p-8 shadow-card"
      >
        <header className="text-center mb-8">
          <div className="text-3xl mb-2"><span aria-hidden='true'>🔒</span></div>
          <h1 className="font-display font-semibold text-lg text-muted-foreground">Restricted Access</h1>
        </header>

        <div className="flex gap-2 mb-8">
          <button
            type="button"
            onClick={() => setTab("invite")}
            className={`flex-1 rounded-xl py-3 px-2 text-center font-display text-sm font-semibold transition-opacity ${
              tab === "invite" ? "gradient-hero text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:opacity-90"
            }`}
          >
            Invite Code Use Karo
          </button>
          <button
            type="button"
            onClick={() => setTab("manage")}
            className={`flex-1 rounded-xl py-3 px-2 text-center font-display text-sm font-semibold transition-opacity ${
              tab === "manage" ? "gradient-hero text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:opacity-90"
            }`}
          >
            Codes Manage Karo
          </button>
        </div>

        {tab === "invite" && (
          <div className="space-y-5">
            <div>
              <h2 className="font-display font-bold text-2xl text-foreground">Admin Access Lo <span aria-hidden='true'>🛡️</span></h2>
              <p className="text-muted-foreground font-body text-sm mt-2">
                Agar tumhare paas invite code hai toh yahan daalo
              </p>
            </div>

            {redeemStatus === "success" && (
              <div className="rounded-xl border-2 border-green-600/60 bg-green-500/5 p-4 flex gap-3 items-start">
                <Check className="w-6 h-6 text-green-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-foreground">{redeemMessage}</p>
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className={`mt-4 ${btnPrimary} w-full sm:w-auto`}
                  >
                    Dashboard Kholo →
                  </button>
                </div>
              </div>
            )}

            {redeemStatus === "error" && (
              <div className="rounded-xl border-2 border-red-600/60 bg-red-500/5 p-4 flex gap-3 items-start">
                <X className="w-6 h-6 text-red-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                <p className="font-body text-sm text-foreground">{redeemMessage}</p>
              </div>
            )}

            {redeemStatus !== "success" && (
              <>
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="PATHFINDER-ADMIN-XXX"
                  value={codeInput}
                  onChange={(e) => {
                    setCodeInput(e.target.value);
                    if (redeemStatus === "error") {
                      setRedeemStatus("idle");
                      setRedeemMessage("");
                    }
                  }}
                  className={inputClass}
                />
                <button
                  type="button"
                  disabled={redeemStatus === "loading" || !codeInput.trim()}
                  onClick={handleRedeem}
                  className={`w-full ${btnPrimary} flex items-center justify-center gap-2`}
                >
                  {redeemStatus === "loading" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Ho raha hai...
                    </>
                  ) : (
                    "Admin Access Lo"
                  )}
                </button>
              </>
            )}

            <p className="text-xs text-muted-foreground font-body text-center pt-1">
              Yeh page sirf authorized log ke liye hai <span aria-hidden='true'>🔒</span>
            </p>
          </div>
        )}

        {tab === "manage" && (
          <div className="space-y-6">
            {role !== "admin" ? (
              <p className="text-muted-foreground font-body text-sm text-center">
                Pehle Tab 1 se admin bano, phir yahan aao
              </p>
            ) : (
              <>
                <div className="space-y-3">
                  <h3 className="font-display font-semibold text-foreground">Naya code</h3>
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder="e.g. FOR-TEACHER-RAMESH"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    disabled={generating || !newCode.trim()}
                    onClick={handleGenerateCode}
                    className={`w-full ${btnPrimary}`}
                  >
                    {generating ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Ban raha hai...
                      </span>
                    ) : (
                      "Naya Code Banao +"
                    )}
                  </button>
                </div>

                <div>
                  <h3 className="font-display font-semibold text-foreground mb-3">Sab codes</h3>
                  {codesLoading ? (
                    <p className="text-sm text-muted-foreground font-body">Loading...</p>
                  ) : codes.length === 0 ? (
                    <p className="text-sm text-muted-foreground font-body">Abhi koi code nahi.</p>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-border">
                      <table className="w-full text-sm font-body">
                        <thead>
                          <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
                            <th className="px-3 py-2 font-display font-semibold">Code</th>
                            <th className="px-3 py-2 font-display font-semibold">Status</th>
                            <th className="px-3 py-2 font-display font-semibold">Created</th>
                            <th className="px-3 py-2 font-display font-semibold">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {codes.map((row) => {
                            const active = row.is_active === true;
                            return (
                              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                                <td className="px-3 py-2.5 font-mono text-foreground whitespace-nowrap">{row.code}</td>
                                <td className="px-3 py-2.5">
                                  <span
                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-display font-semibold ${
                                      active ? "bg-green-600/20 text-green-700 dark:text-green-400" : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {active ? "Active" : "Used"}
                                  </span>
                                </td>
                                <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">
                                  {new Date(row.created_at).toLocaleString()}
                                </td>
                                <td className="px-3 py-2.5">
                                  <button
                                    type="button"
                                    onClick={() => copyCode(row.code)}
                                    className="text-primary font-display font-semibold text-xs hover:underline"
                                  >
                                    Copy
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminSetup;
