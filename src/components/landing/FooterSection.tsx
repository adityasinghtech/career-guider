import { useState } from "react";
import { Link } from "react-router-dom";
import { Compass, Heart, MessageSquare } from "lucide-react";
import FeedbackModal from "@/components/FeedbackModal";

const FooterSection = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <>
      <footer className="bg-secondary text-secondary-foreground py-14 px-4 relative overflow-hidden">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 gradient-hero" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                  <Compass className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-xl">PathFinder</span>
              </div>
              <p className="text-secondary-foreground/60 text-sm leading-relaxed">
                Aapka Future, Aapki Choice — India ka #1 FREE career guidance platform! Har confused student ko clarity dena humara mission hai. 🎯
              </p>
            </div>
            <div>
              <h4 className="font-display font-bold text-sm mb-4 text-secondary-foreground/80 uppercase tracking-wider">Quick Links</h4>
              <div className="space-y-3">
                <Link to="/quiz" className="block text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Free Career Quiz 🚀</Link>
                <Link to="/about" className="block text-sm text-secondary-foreground/60 hover:text-primary transition-colors">About PathFinder</Link>
                <Link to="/contact" className="block text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Help & Support</Link>
                <button
                  onClick={() => setIsFeedbackOpen(true)}
                  className="flex items-center gap-1.5 text-sm text-secondary-foreground/60 hover:text-orange-500 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Give Feedback
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-display font-bold text-sm mb-4 text-secondary-foreground/80 uppercase tracking-wider">Students ke liye</h4>
              <div className="space-y-3">
                {[
                  "100% Free Forever",
                  "All India Coverage",
                  "Class 8-12 + Beyond",
                  "Hindi + English Support",
                ].map((item) => (
                  <p key={item} className="text-sm text-secondary-foreground/60 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-secondary-foreground/10 pt-8 text-center">
            <p className="text-secondary-foreground/40 text-xs flex items-center justify-center gap-1">
              © 2026 PathFinder. Made with <Heart className="w-3 h-3 text-primary fill-primary" /> for Indian students.
            </p>
          </div>
        </div>
      </footer>

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </>
  );
};

export default FooterSection;
