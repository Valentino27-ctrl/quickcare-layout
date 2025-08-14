import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Calendar, Clock, User, Heart, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Doctor {
  id: string;
  user_id: string;
  specialization: string;
  license_number: string;
  phone: string | null;
  bio: string | null;
  profiles?: {
    full_name: string;
  } | null;
}

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
  doctors?: {
    specialization: string;
    profiles?: {
      full_name: string;
    } | null;
  } | null;
}

export const PatientDashboard = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch doctors
        const { data: doctorsData } = await supabase
          .from('doctors')
          .select(`
            *,
            profiles(full_name)
          `);

        // Fetch patient's appointments
        const { data: appointmentsData } = await supabase
          .from('appointments')
          .select(`
            *,
            doctors(
              specialization,
              profiles(full_name)
            )
          `)
          .eq('patient_id', (await supabase.auth.getUser()).data.user?.id)
          .order('appointment_date', { ascending: true })
          .order('appointment_time', { ascending: true });

        setDoctors((doctorsData as unknown as Doctor[]) || []);
        setAppointments((appointmentsData as unknown as Appointment[]) || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const bookAppointment = async (doctorId: string) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      // For demo purposes, book an appointment for tomorrow at 10:00 AM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const { error } = await supabase
        .from('appointments')
        .insert([{
          patient_id: user.data.user.id,
          doctor_id: doctorId,
          appointment_date: tomorrow.toISOString().split('T')[0],
          appointment_time: '10:00:00',
          status: 'scheduled'
        }]);

      if (error) {
        console.error('Error booking appointment:', error);
        alert('Error booking appointment. Please try again.');
      } else {
        alert('Appointment booked successfully!');
        // Refresh appointments
        window.location.reload();
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Error booking appointment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Patient Dashboard</h1>
        <p className="text-muted-foreground">Manage your appointments and healthcare</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Appointments</p>
                <p className="text-2xl font-bold text-foreground">{appointments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Doctors</p>
                <p className="text-2xl font-bold text-foreground">{doctors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Health Score</p>
                <p className="text-2xl font-bold text-foreground">98%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Available Doctors */}
        <Card className="bg-gradient-card shadow-medical border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Available Doctors</span>
            </CardTitle>
            <CardDescription>Book an appointment with our qualified doctors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {doctors.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No doctors available at the moment.</p>
            ) : (
              doctors.map((doctor) => (
                <div key={doctor.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
                  <div>
                    <h3 className="font-medium text-foreground">{doctor.profiles?.full_name || 'Doctor'}</h3>
                    <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                    {doctor.bio && <p className="text-xs text-muted-foreground mt-1">{doctor.bio}</p>}
                  </div>
                  <Button
                    variant="medical"
                    size="sm"
                    onClick={() => bookAppointment(doctor.user_id)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Book
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="bg-gradient-card shadow-medical border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Your Appointments</span>
            </CardTitle>
            <CardDescription>Manage your scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No appointments scheduled.</p>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment.id} className="p-4 bg-background/50 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-foreground">
                      Dr. {appointment.doctors?.profiles?.full_name || 'Doctor'}
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
                  <p className="text-sm text-muted-foreground mt-1">{appointment.doctors?.specialization}</p>
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