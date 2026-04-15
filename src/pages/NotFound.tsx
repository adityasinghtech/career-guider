import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-4">
        <div className="text-6xl mb-4">😅</div>
        <h1 className="mb-4 text-5xl font-display font-bold text-foreground">404</h1>
        <p className="mb-6 text-xl text-muted-foreground font-body">Maaf kijiye! Ye page nahi mila</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 gradient-hero text-primary-foreground font-display font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          <Home className="w-4 h-4" /> Home pe Jaayein
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

