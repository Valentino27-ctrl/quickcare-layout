
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Calendar, Clock, User, Heart, Plus, MapPin, Phone, Award } from "lucide-react";
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

// Mock data for demonstration
const mockDoctors: Doctor[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    user_id: "550e8400-e29b-41d4-a716-446655440001",
    specialization: "Cardiology",
    license_number: "MD-2024-001",
    phone: "+1 (555) 123-4567",
    bio: "Board-certified cardiologist with 15 years of experience in interventional cardiology and heart disease prevention.",
    profiles: { full_name: "Dr. Sarah Johnson" }
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    user_id: "550e8400-e29b-41d4-a716-446655440002",
    specialization: "Dermatology",
    license_number: "MD-2024-002",
    phone: "+1 (555) 234-5678",
    bio: "Specialist in medical and cosmetic dermatology, with expertise in skin cancer detection and treatment.",
    profiles: { full_name: "Dr. Michael Chen" }
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    user_id: "550e8400-e29b-41d4-a716-446655440003",
    specialization: "Orthopedics",
    license_number: "MD-2024-003",
    phone: "+1 (555) 345-6789",
    bio: "Orthopedic surgeon specializing in sports medicine and joint replacement procedures.",
    profiles: { full_name: "Dr. Emily Rodriguez" }
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    user_id: "550e8400-e29b-41d4-a716-446655440004",
    specialization: "Pediatrics",
    license_number: "MD-2024-004",
    phone: "+1 (555) 456-7890",
    bio: "Pediatrician with special interest in child development and preventive care.",
    profiles: { full_name: "Dr. James Wilson" }
  }
];

const mockAppointments: Appointment[] = [
  {
    id: "1",
    appointment_date: "2025-01-20",
    appointment_time: "10:00:00",
    status: "scheduled",
    notes: "Annual cardiac checkup",
    doctors: {
      specialization: "Cardiology",
      profiles: { full_name: "Dr. Sarah Johnson" }
    }
  },
  {
    id: "2",
    appointment_date: "2025-01-18",
    appointment_time: "14:30:00",
    status: "completed",
    notes: "Routine skin examination - all clear",
    doctors: {
      specialization: "Dermatology",
      profiles: { full_name: "Dr. Michael Chen" }
    }
  },
  {
    id: "3",
    appointment_date: "2025-01-25",
    appointment_time: "09:15:00",
    status: "scheduled",
    notes: "Follow-up for knee injury",
    doctors: {
      specialization: "Orthopedics",
      profiles: { full_name: "Dr. Emily Rodriguez" }
    }
  }
];

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
        const user = await supabase.auth.getUser();
        if (user.data.user) {
          const { data: appointmentsData } = await supabase
            .from('appointments')
            .select(`
              *,
              doctors(
                specialization,
                profiles(full_name)
              )
            `)
            .eq('patient_id', user.data.user.id)
            .order('appointment_date', { ascending: true })
            .order('appointment_time', { ascending: true });

          setAppointments((appointmentsData as unknown as Appointment[]) || mockAppointments);
        }

        // Use mock data if no real data, otherwise use real data
        setDoctors((doctorsData as unknown as Doctor[])?.length > 0 ? (doctorsData as unknown as Doctor[]) : mockDoctors);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to mock data
        setDoctors(mockDoctors);
        setAppointments(mockAppointments);
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
        <h1 className="text-3xl font-bold text-foreground">Welcome to Your Health Dashboard</h1>
        <p className="text-muted-foreground">Your comprehensive healthcare management center</p>
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

        <Card className="bg-gradient-card shadow-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wellness Points</p>
                <p className="text-2xl font-bold text-foreground">1,247</p>
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
              <span>Our Medical Specialists</span>
            </CardTitle>
            <CardDescription>Book an appointment with our qualified healthcare professionals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="p-4 bg-background/50 rounded-lg border border-border/50 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-foreground">{doctor.profiles?.full_name || 'Doctor'}</h3>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                        {doctor.specialization}
                      </span>
                    </div>
                    {doctor.bio && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{doctor.bio}</p>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      {doctor.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{doctor.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Award className="w-3 h-3" />
                        <span>License: {doctor.license_number}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="medical"
                    size="sm"
                    onClick={() => bookAppointment(doctor.id)}
                    className="ml-4"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Book
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="bg-gradient-card shadow-medical border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Your Healthcare Schedule</span>
            </CardTitle>
            <CardDescription>Manage your upcoming and past appointments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No appointments scheduled</p>
                <p className="text-sm text-muted-foreground">Book your first appointment with one of our specialists</p>
              </div>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment.id} className="p-4 bg-background/50 rounded-lg border border-border/50 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {appointment.doctors?.profiles?.full_name || 'Doctor'}
                        </h3>
                        <p className="text-sm text-muted-foreground">{appointment.doctors?.specialization}</p>
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
                    <div className="mt-3 p-3 bg-background/80 rounded border-l-4 border-primary/30">
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
