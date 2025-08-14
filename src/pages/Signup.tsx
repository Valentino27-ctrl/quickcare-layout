import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";

export default function Signup() {
  return (
    <AuthLayout
      title="Join Quick Care"
      description="Create your account to get started"
    >
      <SignupForm />
    </AuthLayout>
  );
}