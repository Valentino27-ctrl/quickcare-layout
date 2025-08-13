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
  Users, 
  Activity,
  CheckCircle,
  User
} from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  patient: {
    full_name: string;
  };
  notes?: string;
}

export function DoctorDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    todayTotal: 0,
    weekTotal: 0,
    completedToday: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);

      if (userData?.id) {
        // Load appointments for today
        const today = new Date().toISOString().split('T')[0];
        
        const { data: todayData } = await supabase
          .from('appointments')
          .select(`
            id,
            appointment_date,
            appointment_time,
            status,
            notes,
            profiles!appointments_patient_id_fkey(full_name)
          `)
          .eq('doctor_id', userData.id)
          .eq('appointment_date', today)
          .order('appointment_time', { ascending: true });

        if (todayData) {
          const formattedToday = todayData.map((apt: any) => ({
            id: apt.id,
            appointment_date: apt.appointment_date,
            appointment_time: apt.appointment_time,
            status: apt.status,
            notes: apt.notes,
            patient: {
              full_name: apt.profiles.full_name,
            },
          }));
          setTodayAppointments(formattedToday);
        }

        // Load upcoming appointments (next 7 days, excluding today)
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const { data: upcomingData } = await supabase
          .from('appointments')
          .select(`
            id,
            appointment_date,
            appointment_time,
            status,
            notes,
            profiles!appointments_patient_id_fkey(full_name)
          `)
          .eq('doctor_id', userData.id)
          .gt('appointment_date', today)
          .lte('appointment_date', nextWeek.toISOString().split('T')[0])
          .order('appointment_date', { ascending: true })
          .order('appointment_time', { ascending: true })
          .limit(10);

        if (upcomingData) {
          const formattedUpcoming = upcomingData.map((apt: any) => ({
            id: apt.id,
            appointment_date: apt.appointment_date,
            appointment_time: apt.appointment_time,
            status: apt.status,
            notes: apt.notes,
            patient: {
              full_name: apt.profiles.full_name,
            },
          }));
          setUpcomingAppointments(formattedUpcoming);
        }

        // Calculate stats
        setStats({
          todayTotal: todayData?.length || 0,
          weekTotal: (todayData?.length || 0) + (upcomingData?.length || 0),
          completedToday: todayData?.filter(apt => apt.status === 'completed').length || 0,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (!error) {
        // Refresh the data
        loadDashboardData();
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
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

  const formatAppointmentDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-slide-up">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Welcome, Dr. {user?.full_name?.split(' ')[0]}!
          </h1>
          <p className="text-lg text-muted-foreground">
            {user?.specialty && `${user.specialty} Specialist • `}
            Your patient care dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{stats.todayTotal}</h3>
              <p className="text-sm text-muted-foreground">Today's Appointments</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{stats.weekTotal}</h3>
              <p className="text-sm text-muted-foreground">This Week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{stats.completedToday}</h3>
              <p className="text-sm text-muted-foreground">Completed Today</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Appointments */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary" />
              <span>Today's Schedule</span>
            </CardTitle>
            <CardDescription>
              {format(new Date(), 'EEEE, MMMM dd, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No appointments scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">{appointment.appointment_time}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(`2000-01-01T${appointment.appointment_time}`), 'h:mm a')}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{appointment.patient.full_name}</p>
                        {appointment.notes && (
                          <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      {appointment.status === 'scheduled' && (
                        <Button
                          variant="accent"
                          size="sm"
                          onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <Card className="bg-gradient-card shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span>Upcoming Appointments</span>
              </CardTitle>
              <CardDescription>
                Next week's schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          {formatAppointmentDate(appointment.appointment_date)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(`2000-01-01T${appointment.appointment_time}`), 'h:mm a')}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{appointment.patient.full_name}</p>
                        {appointment.notes && (
                          <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                        )}
                      </div>
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

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-card shadow-card border-0 hover:shadow-medical transition-all cursor-pointer"
                onClick={() => navigate('/appointments')}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">All Appointments</h3>
              <p className="text-sm text-muted-foreground">View and manage all your appointments</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-0 hover:shadow-medical transition-all cursor-pointer"
                onClick={() => navigate('/profile')}>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">My Profile</h3>
              <p className="text-sm text-muted-foreground">Update your professional information</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}