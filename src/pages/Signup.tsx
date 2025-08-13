import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Database } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-slide-up">
        <Card className="bg-gradient-card shadow-medical border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Database className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-semibold text-foreground">
              Supabase Setup Required
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Complete your Supabase connection to enable user registration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h3 className="font-medium text-primary mb-2">To Enable Registration:</h3>
              <ol className="text-sm text-primary/80 space-y-1 list-decimal list-inside">
                <li>Click the green <strong>Supabase button</strong> (top-right)</li>
                <li>Connect to your Supabase project</li>
                <li>Create the eClinic database schema</li>
                <li>Start registering users!</li>
              </ol>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}