import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Calendar, Clock, Users, CheckCircle, User } from "lucide-react";
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

        setTodayAppointments((todayData as any[])?.map(item => ({
          ...item,
          patient_profiles: item.profiles
        })) || []);
        setAllAppointments((allData as any[])?.map(item => ({
          ...item,
          patient_profiles: item.profiles
        })) || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
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

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Doctor Dashboard</h1>
        <p className="text-muted-foreground">Manage your patients and appointments</p>
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
                <p className="text-sm text-muted-foreground">Today's Appointments</p>
                <p className="text-2xl font-bold text-foreground">{todayAppointments.length}</p>
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
              <span>Today's Schedule</span>
            </CardTitle>
            <CardDescription>Your appointments for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayAppointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No appointments scheduled for today.</p>
            ) : (
              todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                  <div>
                    <h3 className="font-medium text-foreground">
                      {appointment.patient_profiles?.full_name || 'Patient'}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.appointment_time.slice(0, 5)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'scheduled' 
                          ? 'bg-primary/10 text-primary'
                          : appointment.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {appointment.status}
                      </span>
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

        {/* All Appointments */}
        <Card className="bg-gradient-card shadow-medical border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>All Appointments</span>
            </CardTitle>
            <CardDescription>Complete appointment history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {allAppointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No appointments found.</p>
            ) : (
              allAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 bg-background/50 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-foreground">
                      {appointment.patient_profiles?.full_name || 'Patient'}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'scheduled' 
                        ? 'bg-primary/10 text-primary'
                        : appointment.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.appointment_time.slice(0, 5)}</span>
                    </div>
                  </div>
                  {appointment.notes && (
                    <p className="text-sm text-muted-foreground mt-2 bg-background/80 p-2 rounded">
                      {appointment.notes}
                    </p>
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