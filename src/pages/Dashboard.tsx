import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PatientDashboard } from "@/components/dashboard/PatientDashboard";
import { DoctorDashboard } from "@/components/dashboard/DoctorDashboard";
import { getCurrentUser, getUserProfile, type Profile } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user } = await getCurrentUser();
        
        if (!user) {
          navigate("/login");
          return;
        }

        const { profile: userProfile } = await getUserProfile(user.id);
        if (!userProfile) {
          navigate("/login");
          return;
        }

        setProfile(userProfile);
      } catch (error) {
        console.error("Error checking auth:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <DashboardLayout>
      {profile.role === "patient" ? (
        <PatientDashboard />
      ) : (
        <DoctorDashboard />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;