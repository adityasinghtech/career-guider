interface Feedback {
  id: string;
  message: string;
  user_email?: string | null;
  created_at: string;
}

interface FeedbackViewProps {
  feedbacks: Feedback[];
}

const FeedbackView = ({ feedbacks }: FeedbackViewProps) => {
  return (
    <div className="bg-card border-2 border-border rounded-2xl p-6">
      <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
        ⭐ User Feedback
      </h3>
      {feedbacks.length === 0 ? (
        <p className="text-center text-muted-foreground font-body py-8">Abhi tak koi feedback nahi</p>
      ) : (
        <div className="space-y-3">
          {feedbacks.map(fb => (
            <div key={fb.id} className="border border-border rounded-xl p-4 bg-muted/20">
              <p className="text-sm font-body text-foreground">{fb.message}</p>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-muted-foreground">{fb.user_email || 'Anonymous'}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(fb.created_at).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackView;
