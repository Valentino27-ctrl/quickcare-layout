import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { signUp, createDoctorProfile } from "@/lib/auth";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Stethoscope, UserPlus } from "lucide-react";

export const SignupForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "patient" as "patient" | "doctor"
  });
  const [doctorData, setDoctorData] = useState({
    specialization: "",
    licenseNumber: "",
    phone: "",
    bio: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        formData.role
      );
      
      if (error) {
        setError(error.message);
      } else if (data.user) {
        // If user is a doctor, create doctor profile
        if (formData.role === "doctor") {
          const { error: doctorError } = await createDoctorProfile({
            specialization: doctorData.specialization,
            license_number: doctorData.licenseNumber,
            phone: doctorData.phone || undefined,
            bio: doctorData.bio || undefined
          });
          
          if (doctorError) {
            console.error("Error creating doctor profile:", doctorError);
          }
        }
        
        setSuccess("Account created successfully! Please check your email to verify your account.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDoctorDataChange = (field: string, value: string) => {
    setDoctorData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="pl-10 pr-10"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Account Type</Label>
          <RadioGroup
            value={formData.role}
            onValueChange={(value) => handleInputChange("role", value)}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex items-center space-x-2 border border-border rounded-lg p-3 hover:bg-secondary/50">
              <RadioGroupItem value="patient" id="patient" />
              <Label htmlFor="patient" className="flex items-center cursor-pointer">
                <UserPlus className="w-4 h-4 mr-2" />
                Patient
              </Label>
            </div>
            <div className="flex items-center space-x-2 border border-border rounded-lg p-3 hover:bg-secondary/50">
              <RadioGroupItem value="doctor" id="doctor" />
              <Label htmlFor="doctor" className="flex items-center cursor-pointer">
                <Stethoscope className="w-4 h-4 mr-2" />
                Doctor
              </Label>
            </div>
          </RadioGroup>
        </div>

        {formData.role === "doctor" && (
          <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h3 className="font-medium text-primary">Doctor Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                type="text"
                placeholder="e.g., Cardiology, Pediatrics"
                value={doctorData.specialization}
                onChange={(e) => handleDoctorDataChange("specialization", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">Medical License Number</Label>
              <Input
                id="licenseNumber"
                type="text"
                placeholder="Your medical license number"
                value={doctorData.licenseNumber}
                onChange={(e) => handleDoctorDataChange("licenseNumber", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Your contact number"
                value={doctorData.phone}
                onChange={(e) => handleDoctorDataChange("phone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio (Optional)</Label>
              <Input
                id="bio"
                type="text"
                placeholder="Brief description about yourself"
                value={doctorData.bio}
                onChange={(e) => handleDoctorDataChange("bio", e.target.value)}
              />
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="medical"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="space-y-4">
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign in here
          </Link>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};