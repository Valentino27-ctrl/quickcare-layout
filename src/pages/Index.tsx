import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Users, Calendar, Shield, Heart, Clock, AlertCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description: "Book appointments with just a few clicks"
    },
    {
      icon: Users,
      title: "Expert Doctors",
      description: "Connect with qualified healthcare professionals"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your health data is protected and confidential"
    },
    {
      icon: Clock,
      title: "24/7 Access",
      description: "Manage your health anytime, anywhere"
    }
  ];

  const handleAuthNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-medical">
                <Stethoscope className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Quick Care
                </h1>
                <p className="text-xs text-muted-foreground">Digital Healthcare Platform</p>
              </div>
            </div>
            <div className="space-x-4">
              <Button
                variant="ghost"
                onClick={() => handleAuthNavigation('/login')}
              >
                Sign In
              </Button>
              <Button
                variant="medical"
                onClick={() => handleAuthNavigation('/signup')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>


      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Your Health,{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Simplified
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with healthcare professionals, book appointments, and manage your health 
              journey all in one secure platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                variant="hero"
                size="hero"
                onClick={() => handleAuthNavigation('/signup')}
                className="animate-pulse-glow"
              >
                <Heart className="w-5 h-5 mr-2" />
                Start Your Health Journey
              </Button>
              <Button
                variant="outline"
                size="hero"
                onClick={() => handleAuthNavigation('/login')}
              >
                Sign In to Your Account
              </Button>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-16 relative">
            <div className="w-full max-w-4xl mx-auto h-64 bg-gradient-card rounded-2xl border border-border/50 shadow-medical flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                  <Stethoscope className="w-12 h-12 text-primary-foreground" />
                </div>
                <p className="text-muted-foreground">Professional Healthcare Management</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Why Choose Quick Care?
            </h2>
            <p className="text-lg text-muted-foreground">
              Experience modern healthcare management designed for your convenience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gradient-card shadow-card border-0 hover:shadow-medical transition-all">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-primary border-0 shadow-glow">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Ready to Take Control of Your Health?
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Join thousands of patients and doctors who trust Quick Care for their healthcare needs.
              </p>
              <Button
                variant="secondary"
                size="hero"
                onClick={() => handleAuthNavigation('/signup')}
                className="bg-background text-foreground hover:bg-background/90"
              >
                <Users className="w-5 h-5 mr-2" />
                Join Quick Care Today
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-border/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
              Quick Care
            </span>
          </div>
          <p className="text-muted-foreground">
            © 2024 Quick Care. Empowering better healthcare for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;