import { motion } from "framer-motion";
import { ShieldCheck, ShieldOff, ChevronUp, ChevronDown, MessageSquare, Send } from "lucide-react";
import { SmartInsightButton } from "./SmartInsightButton";
import { PriorityBadge } from "./PriorityBadge";

interface Student {
  id: string;
  full_name: string;
  email: string;
  city: string;
  class: string;
}

interface QuizResult {
  id: string;
  stream: string;
  created_at: string;
}

interface StudentRowProps {
  student: Student;
  studentResults: QuizResult[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  studentIsAdmin: boolean;
  confirmAdmin: string | null;
  setConfirmAdmin: (id: string | null) => void;
  grantAdminRole: (id: string) => void;
  removeAdminRole: (id: string) => void;
  studentStatus: {
    hasMessage: boolean;
    pendingReply: boolean;
    unrepliedCount: number;
    hasLowScore: boolean;
    hasSuggestion: boolean;
  } | undefined;
  setSendingTo: (data: { studentId: string; resultId?: string } | null) => void;
}

const StudentRow = ({
  student,
  studentResults,
  isExpanded,
  onToggleExpand,
  studentIsAdmin,
  confirmAdmin,
  setConfirmAdmin,
  grantAdminRole,
  removeAdminRole,
  studentStatus,
  setSendingTo,
}: StudentRowProps) => {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          {studentIsAdmin && <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />}
          <div>
            <p className="font-display font-semibold text-foreground">{student.full_name || "No Name"}</p>
            <p className="text-xs text-muted-foreground">
              {student.email} • {student.city || "N/A"} • {student.class || "N/A"}
            </p>
            
            <PriorityBadge 
              unrepliedCount={studentStatus?.unrepliedCount || 0}
              hasLowScore={studentStatus?.hasLowScore || false}
              hasNoSuggestions={!studentStatus?.hasSuggestion}
            />

            <div className="flex flex-wrap gap-1 mt-1.5">
              {studentStatus?.hasMessage && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-display font-semibold border ${
                  studentStatus?.pendingReply 
                    ? 'bg-amber-500/15 text-amber-700 border-amber-500/30' 
                    : 'bg-green-500/15 text-green-700 border-green-500/30'
                }`}>
                  {studentStatus?.pendingReply ? '<span aria-hidden="true">⏳</span> Reply Pending' : '<span aria-hidden="true">✅</span> Replied'}
                </span>
              )}
              {studentResults.length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-display font-semibold bg-blue-500/15 text-blue-700 border border-blue-500/30">
                  <span aria-hidden="true">📝</span> Quiz Diya
                </span>
              )}
              {studentResults.length === 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-display font-semibold bg-muted text-muted-foreground border border-border">
                  <span aria-hidden="true">⏸</span> Quiz Pending
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-display font-semibold text-primary">{studentResults.length} quiz</span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {isExpanded && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="border-t border-border p-4 bg-muted/20">
          <SmartInsightButton studentId={student.id} />

          {confirmAdmin === student.id && (
            <div className="mb-4 p-4 rounded-xl border-2 border-primary/30 bg-card shadow-card space-y-4">
              <p className="text-sm font-body text-foreground leading-relaxed">
                Kya aap{" "}
                <span className="font-display font-semibold">
                  {student.full_name?.trim() || "Is student"}
                </span>{" "}
                ko admin banana chahte hain? Woh poora admin panel access kar sakenge.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => grantAdminRole(student.id)}
                  className="text-sm font-display font-semibold px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Confirm <span aria-hidden="true">✅</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmAdmin(null)}
                  className="text-sm font-display font-semibold px-4 py-2 rounded-xl border-2 border-border text-foreground hover:bg-muted transition-colors"
                >
                  Cancel <span aria-hidden="true">❌</span>
                </button>
              </div>
            </div>
          )}

          {/* Admin Role Toggle */}
          {!(confirmAdmin === student.id && !studentIsAdmin) && (
            <div className="my-4 flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  if (studentIsAdmin) {
                    removeAdminRole(student.id);
                  } else {
                    setConfirmAdmin(student.id);
                  }
                }}
                className={`flex items-center gap-2 text-xs font-display font-semibold px-4 py-2 rounded-lg transition-colors ${
                  studentIsAdmin
                    ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
              >
                {studentIsAdmin ? (
                  <>
                    <ShieldOff className="w-3.5 h-3.5" /> Admin Role Hatayein
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin Banayein
                  </>
                )}
              </button>
            </div>
          )}

          {/* Results */}
          {studentResults.length > 0 ? (
            <div className="space-y-2 mb-4">
              <p className="text-xs font-display font-semibold text-muted-foreground uppercase">Quiz Results:</p>
              {studentResults.map((r) => (
                <div key={r.id} className="flex items-center justify-between bg-card p-3 rounded-lg border border-border">
                  <div>
                    <span className="font-display font-semibold text-foreground capitalize text-sm">{r.stream} Stream</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {new Date(r.created_at).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <button
                    onClick={() => setSendingTo({ studentId: student.id, resultId: r.id })}
                    className="text-xs text-primary font-display font-semibold flex items-center gap-1 hover:underline"
                  >
                    <MessageSquare className="w-3 h-3" /> Suggestion Dein
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mb-4">Koi quiz result nahi hai</p>
          )}

          <button
            onClick={() => setSendingTo({ studentId: student.id })}
            className="text-xs gradient-hero text-primary-foreground font-display font-semibold px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-1"
          >
            <Send className="w-3 h-3" /> General Suggestion Bhejein
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default StudentRow;
