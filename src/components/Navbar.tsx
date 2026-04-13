import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, Menu, X, Moon, Sun, LogIn, LayoutDashboard, 
  Route, BookOpen, GraduationCap, Brain, Search, HelpCircle 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const centerLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Help" },
];

const sidebarLinks = [
  { to: "/stream-recommender", label: "Stream Finder", icon: <Route className="w-4 h-4" /> },
  { to: "/learning", label: "Free Resources", icon: <BookOpen className="w-4 h-4" /> },
  { to: "/after-12th", label: "12th ke Baad", icon: <GraduationCap className="w-4 h-4" /> },
  { to: "/practice-quiz", label: "Practice Quiz", icon: <Brain className="w-4 h-4" /> },
  { to: "/deep-analysis", label: "Deep Analysis", icon: <Search className="w-4 h-4" /> },
  { to: "/contact", label: "Help", icon: <HelpCircle className="w-4 h-4" /> },
];

const Navbar = () => {
  const location = useLocation();
  const { user, role, roleLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("pathfinder-theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("pathfinder-theme", dark ? "dark" : "light");
  }, [dark]);

  // Prevent scroll when sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-40 bg-white/75 dark:bg-slate-950/75 backdrop-blur-lg border-b border-border/50 shadow-sm transition-colors duration-300"
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="font-display font-extrabold text-xl md:text-2xl text-foreground tracking-tight ml-1">
              Path<span className="text-orange-500">Finder</span>
            </span>
          </Link>

          {/* Center: Home & About (Desktop only) */}
          <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2 mt-1">
            {centerLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative font-display font-bold text-[15px] transition-colors py-1 ${
                    isActive ? "text-orange-500" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-orange-500 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: Actions & Menu */}
          <div className="flex items-center gap-4 md:gap-6 shrink-0 mt-1">
            {location.pathname !== "/quiz" && (
              <Link
                to="/quiz"
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-display font-bold px-5 py-2 md:px-6 md:py-2 rounded-full text-xs md:text-[15px] shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
              >
                Quiz Shuru Karein 🚀
              </Link>
            )}

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 font-display font-bold text-[15px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center gap-1.5 font-display font-bold text-[15px] text-foreground hover:text-orange-500 transition-colors"
                >
                  <LogIn className="w-4 h-4" /> Login
                </Link>
              )}
            </div>

            {/* Hamburger Icon */}
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded-lg text-foreground hover:bg-muted transition-colors focus:outline-none"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 md:w-7 md:h-7" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Sliding Sidebar Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-background/60 backdrop-blur-md z-50"
            />
            
            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] bg-card border-l border-border shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <span className="font-display font-bold text-lg text-foreground">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                
                {/* Mobile Auth / Dashboard */}
                <div className="md:hidden">
                  <span className="text-xs font-display font-semibold text-muted-foreground uppercase opacity-70 mb-3 block px-2">Account</span>
                  {user ? (
                    <div className="space-y-1">
                      <div className="px-3 py-2 text-xs text-muted-foreground font-body truncate bg-muted/30 rounded-lg">
                        {user.email}
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 font-display font-bold text-[15px] p-3 rounded-lg hover:bg-muted transition-colors text-foreground"
                      >
                        <LayoutDashboard className="w-4 h-4 text-muted-foreground" /> Dashboard
                      </Link>
                    </div>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 font-display font-bold text-[15px] p-3 rounded-lg bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition-colors"
                    >
                      <LogIn className="w-4 h-4" /> Login
                    </Link>
                  )}
                  <div className="h-px bg-border my-6" />
                </div>

                {/* Features Links */}
                <div>
                  <span className="text-xs font-display font-semibold text-muted-foreground uppercase opacity-70 mb-2 block px-2">Tools & Guidance</span>
                  <div className="space-y-1">
                    {sidebarLinks.map((link) => {
                      const isActive = location.pathname === link.to;
                      return (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-3 font-display font-bold text-[15px] p-3 rounded-xl transition-all ${
                            isActive
                              ? "bg-orange-500/10 text-orange-500"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          <span className={isActive ? "text-orange-500" : "text-muted-foreground"}>
                            {link.icon}
                          </span>
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="h-px bg-border my-2" />

                {/* Settings */}
                <div>
                  <span className="text-xs font-display font-semibold text-muted-foreground uppercase opacity-70 mb-2 block px-2">Settings</span>
                  <button
                    onClick={() => setDark(!dark)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <div className="flex items-center gap-3 font-display font-bold text-[15px]">
                      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      {dark ? "Light Mode" : "Dark Mode"}
                    </div>
                    <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${dark ? 'bg-orange-500' : 'bg-muted-foreground/30'}`}>
                      <div className={`bg-white w-3 h-3 rounded-full transition-transform ${dark ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
