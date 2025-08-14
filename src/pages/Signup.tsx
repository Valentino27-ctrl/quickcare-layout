import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export default function Signup() {
  return (
    <AuthLayout
      title="Join eClinic"
      description="Create your account to get started"
    >
      <SignupForm />
    </AuthLayout>
  );
}