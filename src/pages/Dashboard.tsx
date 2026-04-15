import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const { user, loading, role, roleLoading, refreshRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user?.id) void refreshRole();
  }, [user?.id, refreshRole]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce"><span aria-hidden="true">⏳</span></div>
          <p className="text-muted-foreground font-display">
            {roleLoading ? "Role check ho raha hai..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 max-w-6xl mx-auto">
        {role === "admin" ? <AdminDashboard /> : <StudentDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
