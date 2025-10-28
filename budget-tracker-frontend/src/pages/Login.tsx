import React, { useState } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router';

import api from '../api/axios';
import { setTokens, setUser } from '../api/auth';
// import Button from '../components/Form/Button';
import Button from '../components/ui/button/Button';
// import Input from '../components/Form/inputField';
import Input from '../components/form/input/InputField';
// import Label from '../components/Form/Label';
import Label from '../components/form/Label';

import Message from '../components/Messages';
// import Form from '../components/Form/Form';
import Form from '../components/form/Form';

interface ErrorResponse {
    detail?: string;
}

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState<{
        type: 'success' | 'error';
        message: string;
        description?: string;
    } | null>(null);
    
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        setAlert(null);

        try {
            const response = await api.post('auth/token/', { username, password });
            const { access, refresh } = response.data;
            
            setTokens(access, refresh);
            setUser({ username });
            
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Alert Message */}
                {alert && (
                    <div className="mb-6">
                        <Message
                            type={alert.type}
                            message={alert.message}
                            description={alert.description}
                            onClose={() => setAlert(null)}
                        />
                    </div>
                )}

                {/* Login Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Login
                        </h1>
                        <div className="w-12 h-0.5 bg-gray-300 mx-auto"></div>
                    </div>

                    <Form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* Username Field */}
                            <div>
                                <Label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Type your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 ml-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <Label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Type your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    // className="w-full px-4 py-3 border rounded-2xl border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                />
                            </div>

                            {/* Forgot Password */}
                            <div className="text-right">
                                <a 
                                    href="/forgot-password" 
                                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                                >
                                    Forget password?
                                </a>
                            </div>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="md"
                                    loading={isLoading}
                                    fullWidth
                                    disabled={isLoading}
                                    className="font-semibold py-3.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    {isLoading ? 'Signing in...' : 'LOGIN'}
                                </Button>
                            </div>

                            {/* Social Login Section */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Or Sign Up Using
                                </p>
                                <div className="flex justify-center space-x-4">
                                    {/* Facebook */}
                                    <button
                                        type="button"
                                        className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        <span className="font-semibold">f</span>
                                    </button>
                                    {/* Twitter */}
                                    <button
                                        type="button"
                                        className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white hover:bg-sky-600 transition-colors duration-200"
                                    >
                                        <span className="font-semibold">t</span>
                                    </button>
                                    {/* Google */}
                                    <button
                                        type="button"
                                        className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <span className="font-semibold">G</span>
                                    </button>
                                </div>
                            </div>

                            {/* Sign Up Link */}
                            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Have not account yet?{' '}
                                    <a 
                                        href="/register" 
                                        className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                                    >
                                        SIGN UP
                                    </a>
                                </p>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}