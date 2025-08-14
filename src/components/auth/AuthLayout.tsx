import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export const AuthLayout = ({ children, title, description }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-slide-up">
        <Card className="bg-gradient-card shadow-medical border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-medical">
              <Stethoscope className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-semibold text-foreground">
              {title}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};