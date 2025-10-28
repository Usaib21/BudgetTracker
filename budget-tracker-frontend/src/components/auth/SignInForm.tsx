import { useState } from "react";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import api from "../../api/axios";
import { setTokens, setUser } from "../../api/auth";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import Message from "../Messages";
import useFormValidation from "../../hooks/useFormValidation";

interface ErrorResponse {
  detail?: string;
}

interface LoginFormData {
  username: string;
  password: string;
}

const validationRules = {
  username: { isRequired: true, labelName: 'Username' },
  password: { isRequired: true, labelName: 'Password' },
};

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
    description?: string;
  } | null>(null);

  const navigate = useNavigate();

  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    handleSubmit: validateAndSubmit,
  } = useFormValidation<LoginFormData>(
    { username: '', password: '' },
    validationRules
  );

  async function handleLogin(formData: LoginFormData) {
    setIsLoading(true);
    setAlert(null);

    try {
      const response = await api.post('auth/token/', formData);
      const { access, refresh } = response.data;

      setTokens(access, refresh);
      setUser({ username: formData.username });

      setAlert({
        type: 'success',
        message: 'Login successful!',
        description: 'Redirecting to dashboard...'
      });

      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (error: unknown) {
      if (isAxiosError<ErrorResponse>(error) && error.response?.data?.detail) {
        setAlert({
          type: 'error',
          message: 'Login failed',
          description: error.response.data.detail
        });
      } else {
        setAlert({
          type: 'error',
          message: 'Login failed',
          description: 'An unexpected error occurred. Please try again.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        {/* Message alert */}
        {alert && (
          <div className="mb-5">
            <Message
              type={alert.type}
              message={alert.message}
              description={alert.description}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username and password to sign in!
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={validateAndSubmit(handleLogin)}>
            <div className="space-y-6">
              <div>
                <Label>
                  Username <span className="text-error-500">*</span>
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Type your username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={() => handleBlur('username')}
                  disabled={isLoading}
                />
                {errors.username && (
                  <span className="text-sm text-red-500">{errors.username}</span>
                )}
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Type your password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur('password')}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <span className="text-sm text-red-500">{errors.password}</span>
                  )}
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Keep me logged in
                  </span>
                </div>
                <Link
                  to=""
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Forgot password?
                </Link>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  size="sm"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Don&apos;t have an account?{" "}
              <Link
                to=""
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}