import { useState } from "react";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminReplySectionProps {
  message: {
    id: string;
    admin_reply?: string | null;
    replied_at?: string | null;
  };
  onReplySent: (id: string, reply: string) => void;
}

const AdminReplySection = ({ message, onReplySent }: AdminReplySectionProps) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState(message.admin_reply || "");
  const [sending, setSending] = useState(false);

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    const { error } = await supabase
      .from("contact_messages")
      .update({
        admin_reply: replyText.trim(),
        replied_at: new Date().toISOString(),
        status: 'replied',
        is_read: true,
      })
      .eq("id", message.id);

    if (error) {
      toast.error("Reply save nahi ho payi");
    } else {
      toast.success("Reply saved! ✅");
      onReplySent(message.id, replyText.trim());
      setShowReply(false);
    }
    setSending(false);
  };

  if (message.admin_reply && !showReply) {
    return (
      <div className="mt-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
        <p className="text-xs font-display font-semibold text-green-700 dark:text-green-400 mb-1">
          ✅ Admin Reply bhej di gayi:
        </p>
        <p className="text-sm text-foreground/80 font-body">{message.admin_reply}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {message.replied_at ? new Date(message.replied_at).toLocaleString("en-IN") : ""}
        </p>
        <button
          onClick={() => { setReplyText(message.admin_reply || ""); setShowReply(true); }}
          className="text-xs text-primary font-display font-semibold mt-2 hover:underline"
        >
          ✏️ Edit Reply
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3">
      {!showReply ? (
        <button
          onClick={() => setShowReply(true)}
          className="text-xs font-display font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1"
        >
          <Send className="w-3 h-3" /> Reply Karein
        </button>
      ) : (
        <div className="space-y-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Yahan reply likhein..."
            rows={3}
            className="w-full px-3 py-2 rounded-xl border-2 border-border bg-background font-body text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-colors resize-none"
            maxLength={500}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSendReply}
              disabled={sending || !replyText.trim()}
              className="text-xs font-display font-semibold px-4 py-2 rounded-lg gradient-hero text-primary-foreground hover:opacity-90 disabled:opacity-50 flex items-center gap-1"
            >
              {sending ? "Bhej rahe hain..." : "✈️ Reply Save Karo"}
            </button>
            <button
              onClick={() => setShowReply(false)}
              className="text-xs font-display font-semibold px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-muted-foreground">{replyText.length}/500</p>
        </div>
  )
}
    </div >
  );
};

export default AdminReplySection;

