import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Login | Budget Tracker"
        description="Sign in to access your personal finance dashboard."
      />

      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
