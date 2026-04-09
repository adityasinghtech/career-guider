import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, Menu, X, Moon, Sun, LogIn, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Help" },
];

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();
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

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            Path<span className="text-primary">Finder</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-display font-semibold text-sm transition-colors ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {location.pathname !== "/quiz" && (
            <Link
              to="/quiz"
              className="gradient-hero text-primary-foreground font-display font-semibold px-5 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
            >
              Quiz Shuru Karein 🚀
            </Link>
          )}
          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 font-display font-semibold text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-1.5 font-display font-semibold text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogIn className="w-4 h-4" /> Login
            </Link>
          )}
          <button
            onClick={() => setDark(!dark)}
            className="w-9 h-9 rounded-lg border-2 border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-card border-b border-border px-4 pb-4 space-y-3"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block font-display font-semibold text-sm py-2 ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 font-display font-semibold text-sm py-2 text-muted-foreground"
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
          ) : (
            <Link
              to="/auth"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 font-display font-semibold text-sm py-2 text-muted-foreground"
            >
              <LogIn className="w-4 h-4" /> Login
            </Link>
          )}
          {location.pathname !== "/quiz" && (
            <Link
              to="/quiz"
              onClick={() => setMobileOpen(false)}
              className="block gradient-hero text-primary-foreground font-display font-semibold px-5 py-2.5 rounded-lg text-sm text-center"
            >
              Quiz Shuru Karein 🚀
            </Link>
          )}
          <button
            onClick={() => setDark(!dark)}
            className="flex items-center gap-2 font-display font-semibold text-sm py-2 text-muted-foreground"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
