
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Calendar, Clock, Users, CheckCircle, User, TrendingUp, Activity, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
  patient_profiles?: {
    full_name: string;
  } | null;
}

// Mock data for demonstration
const mockTodayAppointments: Appointment[] = [
  {
    id: "1",
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: "09:00:00",
    status: "scheduled",
    notes: "Annual cardiac checkup",
    patient_profiles: { full_name: "John Smith" }
  },
  {
    id: "2",
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: "10:30:00",
    status: "scheduled",
    notes: "Follow-up for chest pain",
    patient_profiles: { full_name: "Maria Garcia" }
  },
  {
    id: "3",
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: "14:00:00",
    status: "completed",
    notes: "EKG results review - normal",
    patient_profiles: { full_name: "Robert Johnson" }
  },
  {
    id: "4",
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: "15:30:00",
    status: "scheduled",
    notes: "Hypertension consultation",
    patient_profiles: { full_name: "Sarah Wilson" }
  }
];

const mockAllAppointments: Appointment[] = [
  ...mockTodayAppointments,
  {
    id: "5",
    appointment_date: "2025-01-15",
    appointment_time: "11:00:00",
    status: "completed",
    notes: "Routine cardiac screening - excellent results",
    patient_profiles: { full_name: "David Brown" }
  },
  {
    id: "6",
    appointment_date: "2025-01-16",
    appointment_time: "16:00:00",
    status: "completed",
    notes: "Post-surgery follow-up - healing well",
    patient_profiles: { full_name: "Lisa Davis" }
  },
  {
    id: "7",
    appointment_date: "2025-01-20",
    appointment_time: "10:00:00",
    status: "scheduled",
    notes: "New patient consultation",
    patient_profiles: { full_name: "Michael Anderson" }
  },
  {
    id: "8",
    appointment_date: "2025-01-21",
    appointment_time: "14:30:00",
    status: "scheduled",
    notes: "Stress test evaluation",
    patient_profiles: { full_name: "Jennifer Martinez" }
  }
];

export const DoctorDashboard = () => {
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const user = await supabase.auth.getUser();
        if (!user.data.user) return;

        const today = new Date().toISOString().split('T')[0];

        // Fetch today's appointments
        const { data: todayData } = await supabase
          .from('appointments')
          .select(`
            *,
            profiles!appointments_patient_id_fkey(full_name)
          `)
          .eq('doctor_id', user.data.user.id)
          .eq('appointment_date', today)
          .order('appointment_time', { ascending: true });

        // Fetch all appointments
        const { data: allData } = await supabase
          .from('appointments')
          .select(`
            *,
            profiles!appointments_patient_id_fkey(full_name)
          `)
          .eq('doctor_id', user.data.user.id)
          .order('appointment_date', { ascending: true })
          .order('appointment_time', { ascending: true });

        if (todayData && todayData.length > 0) {
          setTodayAppointments((todayData as any[])?.map(item => ({
            ...item,
            patient_profiles: item.profiles
          })) || []);
        } else {
          setTodayAppointments(mockTodayAppointments);
        }

        if (allData && allData.length > 0) {
          setAllAppointments((allData as any[])?.map(item => ({
            ...item,
            patient_profiles: item.profiles
          })) || []);
        } else {
          setAllAppointments(mockAllAppointments);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        // Fallback to mock data
        setTodayAppointments(mockTodayAppointments);
        setAllAppointments(mockAllAppointments);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const completeAppointment = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'completed',
          notes: 'Appointment completed successfully'
        })
        .eq('id', appointmentId);

      if (error) {
        console.error('Error completing appointment:', error);
        alert('Error completing appointment. Please try again.');
      } else {
        alert('Appointment marked as completed!');
        // Refresh appointments
        window.location.reload();
      }
    } catch (error) {
      console.error('Error completing appointment:', error);
      alert('Error completing appointment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const completedAppointments = allAppointments.filter(apt => apt.status === 'completed').length;
  const scheduledAppointments = allAppointments.filter(apt => apt.status === 'scheduled').length;
  const todayCompleted = todayAppointments.filter(apt => apt.status === 'completed').length;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Doctor's Clinical Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive patient care management system</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Schedule</p>
                <p className="text-2xl font-bold text-foreground">{todayAppointments.length}</p>
                <p className="text-xs text-muted-foreground">{todayCompleted} completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold text-foreground">{allAppointments.length}</p>
                <p className="text-xs text-muted-foreground">Active cases</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">{completedAppointments}</p>
                <p className="text-xs text-muted-foreground">Success rate: 98%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold text-foreground">{scheduledAppointments}</p>
                <p className="text-xs text-muted-foreground">Next 30 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Patient Satisfaction</p>
                <p className="text-xl font-bold text-foreground">4.9/5.0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Consultation</p>
                <p className="text-xl font-bold text-foreground">45 min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="text-xl font-bold text-foreground">15 Years</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Today's Schedule */}
        <Card className="bg-gradient-card shadow-medical border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Today's Clinical Schedule</span>
            </CardTitle>
            <CardDescription>Your appointments for {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No appointments scheduled for today</p>
                <p className="text-sm text-muted-foreground">Enjoy your free time!</p>
              </div>
            ) : (
              todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">
                        {appointment.patient_profiles?.full_name || 'Patient'}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(`2000-01-01T${appointment.appointment_time}`).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit', 
                            hour12: true 
                          })}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'scheduled' 
                            ? 'bg-primary/10 text-primary'
                            : appointment.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{appointment.notes}</p>
                      )}
                    </div>
                  </div>
                  {appointment.status === 'scheduled' && (
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => completeAppointment(appointment.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Complete
                    </Button>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Patient History */}
        <Card className="bg-gradient-card shadow-medical border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Patient History & Records</span>
            </CardTitle>
            <CardDescription>Complete patient appointment history and notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {allAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No patient records found</p>
                <p className="text-sm text-muted-foreground">Start seeing patients to build your history</p>
              </div>
            ) : (
              allAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 bg-background/50 rounded-lg border border-border/50 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {appointment.patient_profiles?.full_name || 'Patient'}
                        </h3>
                        <p className="text-sm text-muted-foreground">Patient ID: #{appointment.id.slice(0, 8)}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'scheduled' 
                        ? 'bg-primary/10 text-primary'
                        : appointment.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(appointment.appointment_date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(`2000-01-01T${appointment.appointment_time}`).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit', 
                        hour12: true 
                      })}</span>
                    </div>
                  </div>
                  {appointment.notes && (
                    <div className="mt-3 p-3 bg-background/80 rounded border-l-4 border-accent/30">
                      <p className="text-sm text-foreground">{appointment.notes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
