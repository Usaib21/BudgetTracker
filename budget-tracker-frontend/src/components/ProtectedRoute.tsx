// src/components/ProtectedRoute.tsx
import React from 'react';
import { Outlet, Navigate } from 'react-router';
import { getAccessToken } from '../api/auth';

export default function ProtectedRoute() {
    const token = getAccessToken();
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
}
