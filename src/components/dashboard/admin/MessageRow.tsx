import { Eye } from "lucide-react";
import AdminReplySection from "./AdminReplySection";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
  is_read: boolean;
  sender_type: string;
  admin_reply?: string | null;
  status?: string;
}

interface MessageRowProps {
  msg: Message;
  issueKind: string | null;
  body: string;
  senderTypeLabels: Record<string, string>;
  issueBadgeClass: Record<string, string>;
  issueBadgeLabel: Record<string, string>;
  onMarkRead: (id: string) => void;
  onReplySent: (id: string, reply: string) => void;
}

const MessageRow = ({
  msg,
  issueKind,
  body,
  senderTypeLabels,
  issueBadgeClass,
  issueBadgeLabel,
  onMarkRead,
  onReplySent,
}: MessageRowProps) => {
  return (
    <div
      className={`border rounded-xl p-4 transition-colors ${
        msg.is_read ? "border-border bg-muted/20" : "border-primary/30 bg-primary/5"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-display font-bold text-foreground">{msg.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-display border border-border">
              {senderTypeLabels[msg.sender_type] || msg.sender_type}
            </span>
            {issueKind && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-display font-semibold border ${issueBadgeClass[issueKind]}`}
              >
                {issueBadgeLabel[issueKind]}
              </span>
            )}
            {!msg.is_read && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-display font-semibold">
                Naya
              </span>
            )}
            {msg.status === 'replied' ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-700 dark:text-green-400 font-display font-semibold border border-green-500/30">
                ✅ Replied
              </span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-display font-semibold border border-amber-500/30">
                ⏳ Pending
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {msg.email && <span>{msg.email}</span>}
            {msg.email && msg.phone && <span> • </span>}
            {msg.phone && <span>{msg.phone}</span>}
          </p>
          <p className="text-foreground font-body text-sm whitespace-pre-wrap break-words">{body}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {new Date(msg.created_at).toLocaleString("en-IN")}
          </p>
          <AdminReplySection
            message={msg}
            onReplySent={onReplySent}
          />
        </div>
        {!msg.is_read && (
          <button
            onClick={() => onMarkRead(msg.id)}
            className="flex items-center gap-1 text-xs font-display font-semibold text-primary hover:underline shrink-0"
          >
            <Eye className="w-3 h-3" /> Padh Liya
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageRow;
