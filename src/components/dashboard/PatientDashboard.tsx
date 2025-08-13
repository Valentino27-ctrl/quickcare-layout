import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser, UserProfile } from "@/lib/auth";
import { DashboardLayout } from "./DashboardLayout";
import { 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  Stethoscope,
  MapPin,
  Star
} from "lucide-react";
import { format } from "date-fns";

interface Doctor {
  id: string;
  full_name: string;
  specialty: string;
  bio?: string;
}

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  doctor: {
    full_name: string;
    specialty: string;
  };
}

export function PatientDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);

      // Load doctors
      const { data: doctorsData } = await supabase
        .from('doctors')
        .select(`
          id,
          profiles!inner(full_name, specialty)
        `)
        .limit(6);

      if (doctorsData) {
        const formattedDoctors = doctorsData.map((doc: any) => ({
          id: doc.id,
          full_name: doc.profiles.full_name,
          specialty: doc.profiles.specialty,
        }));
        setDoctors(formattedDoctors);
      }

      // Load recent appointments if user exists
      if (userData?.id) {
        const { data: appointmentsData } = await supabase
          .from('appointments')
          .select(`
            id,
            appointment_date,
            appointment_time,
            status,
            doctors!inner(
              profiles!inner(full_name, specialty)
            )
          `)
          .eq('patient_id', userData.id)
          .order('appointment_date', { ascending: true })
          .limit(3);

        if (appointmentsData) {
          const formattedAppointments = appointmentsData.map((apt: any) => ({
            id: apt.id,
            appointment_date: apt.appointment_date,
            appointment_time: apt.appointment_time,
            status: apt.status,
            doctor: {
              full_name: apt.doctors.profiles.full_name,
              specialty: apt.doctors.profiles.specialty,
            },
          }));
          setRecentAppointments(formattedAppointments);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-primary/10 text-primary border-primary/20';
      case 'completed': return 'bg-accent/10 text-accent border-accent/20';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-slide-up">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Welcome back, {user?.full_name?.split(' ')[0]}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your health appointments and connect with doctors
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gradient-card shadow-card border-0 hover:shadow-medical transition-all cursor-pointer"
                onClick={() => navigate('/book-appointment')}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Book Appointment</h3>
              <p className="text-sm text-muted-foreground">Schedule a visit with our doctors</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-0 hover:shadow-medical transition-all cursor-pointer"
                onClick={() => navigate('/my-appointments')}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">My Appointments</h3>
              <p className="text-sm text-muted-foreground">View and manage your appointments</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-0 hover:shadow-medical transition-all cursor-pointer"
                onClick={() => navigate('/profile')}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">My Profile</h3>
              <p className="text-sm text-muted-foreground">Update your personal information</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Appointments */}
        {recentAppointments.length > 0 && (
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Upcoming Appointments</span>
              </CardTitle>
              <CardDescription>
                Your next scheduled appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                    <div className="space-y-1">
                      <p className="font-medium">Dr. {appointment.doctor.full_name}</p>
                      <p className="text-sm text-muted-foreground">{appointment.doctor.specialty}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(appointment.appointment_date), 'MMM dd, yyyy')} at {appointment.appointment_time}
                      </p>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Doctors */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              <span>Available Doctors</span>
            </CardTitle>
            <CardDescription>
              Connect with our healthcare professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="p-4 bg-background/50 rounded-lg border border-border/50 hover:shadow-medical transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium">Dr. {doctor.full_name}</h4>
                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                      </div>
                    </div>
                    <Button 
                      variant="medical" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate('/book-appointment', { state: { doctorId: doctor.id } })}
                    >
                      Book Appointment
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}