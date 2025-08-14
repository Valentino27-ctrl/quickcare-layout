import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <AuthLayout
      title="Welcome Back"
      description="Sign in to your eClinic account"
    >
      <LoginForm />
    </AuthLayout>
  );
}