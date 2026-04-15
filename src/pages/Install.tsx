import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Smartphone, CheckCircle2, Share, MoreVertical } from "lucide-react";
import Navbar from "@/components/Navbar";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Check iOS
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-3xl gradient-hero flex items-center justify-center mx-auto mb-6 shadow-elevated">
            <Smartphone className="w-10 h-10 text-primary-foreground" />
          </div>

          <h1 className="font-display font-bold text-3xl text-foreground mb-3">
            PathFinder Install Karein <span aria-hidden="true">📱</span>
          </h1>
          <p className="text-muted-foreground font-body mb-8">
            Apne phone pe app ki tarah install karein — bina Play Store ke!
          </p>

          {isInstalled ? (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-accent/10 border-2 border-accent/30 rounded-2xl p-6 mb-8"
            >
              <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-3" />
              <h2 className="font-display font-bold text-xl text-foreground mb-2">
                Already Installed! <span aria-hidden="true">✅</span>
              </h2>
              <p className="text-muted-foreground text-sm">
                PathFinder aapke phone pe already installed hai. Home screen pe dekhein!
              </p>
            </motion.div>
          ) : deferredPrompt ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleInstall}
              className="w-full gradient-hero text-primary-foreground font-display font-bold py-4 px-8 rounded-2xl text-lg shadow-elevated animate-pulse-glow flex items-center justify-center gap-3 mb-8"
            >
              <Download className="w-6 h-6" /> Install Karein — FREE! <span aria-hidden="true">🚀</span>
            </motion.button>
          ) : (
            <div className="space-y-6 mb-8">
              {isIOS ? (
                <div className="bg-card border-2 border-border rounded-2xl p-6 text-left">
                  <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                    <span aria-hidden="true">🍎</span> iPhone / iPad pe Install karein:
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold text-sm flex-shrink-0">1</div>
                      <p className="text-sm text-muted-foreground pt-1">
                        Neeche <Share className="w-4 h-4 inline text-primary" /> <strong className="text-foreground">Share</strong> button pe tap karein
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold text-sm flex-shrink-0">2</div>
                      <p className="text-sm text-muted-foreground pt-1">
                        <strong className="text-foreground">"Add to Home Screen"</strong> pe tap karein
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold text-sm flex-shrink-0">3</div>
                      <p className="text-sm text-muted-foreground pt-1">
                        <strong className="text-foreground">"Add"</strong> pe tap karein — Done! <span aria-hidden="true">🎉</span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-card border-2 border-border rounded-2xl p-6 text-left">
                  <h3 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                    <span aria-hidden="true">🤖</span> Android pe Install karein:
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold text-sm flex-shrink-0">1</div>
                      <p className="text-sm text-muted-foreground pt-1">
                        Browser mein <MoreVertical className="w-4 h-4 inline text-primary" /> <strong className="text-foreground">3 dots menu</strong> pe tap karein
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold text-sm flex-shrink-0">2</div>
                      <p className="text-sm text-muted-foreground pt-1">
                        <strong className="text-foreground">"Install app"</strong> ya <strong className="text-foreground">"Add to Home Screen"</strong> pe tap karein
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold text-sm flex-shrink-0">3</div>
                      <p className="text-sm text-muted-foreground pt-1">
                        <strong className="text-foreground">"Install"</strong> pe tap karein — Done! <span aria-hidden="true">🎉</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-3 text-left">
            {[
              { emoji: "<span aria-hidden="true">⚡</span>", text: "Super Fast Loading" },
              { emoji: "<span aria-hidden="true">📴</span>", text: "Offline Bhi Chale" },
              { emoji: "<span aria-hidden="true">🔔</span>", text: "App Jaisa Feel" },
              { emoji: "<span aria-hidden="true">💾</span>", text: "No Storage Use" },
            ].map((b) => (
              <div key={b.text} className="bg-card border border-border/50 rounded-xl p-3 flex items-center gap-2">
                <span className="text-lg">{b.emoji}</span>
                <span className="text-xs font-display font-semibold text-foreground">{b.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Install;