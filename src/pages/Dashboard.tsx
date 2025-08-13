import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Database } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6 animate-slide-up">
        <Card className="bg-gradient-card shadow-medical border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
              <Database className="w-10 h-10 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground">
              eClinic Dashboard
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Your healthcare management platform is almost ready!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h3 className="font-semibold text-primary mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Complete Database Setup
              </h3>
              <p className="text-primary/80 mb-4">
                To unlock the full power of your eClinic app, you need to set up your Supabase database.
              </p>
              <div className="space-y-2">
                <h4 className="font-medium text-primary">What you'll get:</h4>
                <ul className="text-sm text-primary/80 space-y-1 list-disc list-inside ml-4">
                  <li>Patient and Doctor registration</li>
                  <li>Appointment booking system</li>
                  <li>Role-based dashboards</li>
                  <li>Secure data storage</li>
                  <li>Real-time notifications</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-6">
              <h3 className="font-semibold text-accent mb-2">Quick Setup Steps:</h3>
              <ol className="text-sm text-accent/80 space-y-2 list-decimal list-inside">
                <li>Click the <strong>green Supabase button</strong> in the top-right corner</li>
                <li>Connect to your Supabase project (or create a new one)</li>
                <li>Run the database migration to create tables</li>
                <li>Your eClinic app will be fully functional!</li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button
                variant="medical"
                className="flex-1"
                onClick={() => alert('Click the green Supabase button in the top-right to set up your database!')}
              >
                <Database className="w-4 h-4 mr-2" />
                Ready to Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}