import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-slide-up">
        <Card className="bg-gradient-card shadow-medical border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-semibold text-foreground">
              Database Setup Required
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Complete your Supabase setup to enable authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h3 className="font-medium text-primary mb-2">Next Steps:</h3>
              <ol className="text-sm text-primary/80 space-y-1 list-decimal list-inside">
                <li>Click the green Supabase button (top-right)</li>
                <li>Connect your Supabase project</li>
                <li>Set up the database schema</li>
                <li>Return here to sign in</li>
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