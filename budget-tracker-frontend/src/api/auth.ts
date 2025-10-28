// src/api/auth.ts
import axios from 'axios';
import type { User } from '../types';

const ACCESS_KEY = 'bt_access';
const REFRESH_KEY = 'bt_refresh';
const USER_KEY = 'bt_user';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export function setTokens(access: string, refresh: string) {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
}

export function setAccessToken(access: string) {
    localStorage.setItem(ACCESS_KEY, access);
}

export function getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
}
export function getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
}

export function clearTokens() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
}

export function logout() {
    clearTokens();
    // navigate to login
    window.location.href = '/login';
}

export function setUser(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}
export function getUser(): User | null {
    const u = localStorage.getItem(USER_KEY);
    return u ? (JSON.parse(u) as User) : null;
}

/**
 * Attempt to refresh access token using stored refresh token.
 * Returns the new access token string on success, or null on failure.
 *
 * IMPORTANT: this uses the raw axios package (not your axios instance)
 * to avoid circular imports with src/api/axios.ts.
 */
export async function refreshAccessToken(): Promise<string | null> {
    const refresh = getRefreshToken();
    if (!refresh) return null;

    try {
        const res = await axios.post(`${API_BASE}/auth/token/refresh/`, { refresh }, {
            headers: { 'Content-Type': 'application/json' }
        });
        const newAccess = res.data?.access;
        if (newAccess) {
            setAccessToken(newAccess);
            return newAccess;
        } else {
            // If backend didn't return an access token, clear stored tokens
            clearTokens();
            return null;
        }
    } catch (err) {
        // refresh failed (expired refresh or invalid) -> clear tokens
        clearTokens();
        return null;
    }
}
