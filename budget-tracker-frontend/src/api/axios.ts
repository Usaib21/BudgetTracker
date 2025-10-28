// src/api/axios.ts
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, logout, refreshAccessToken } from './auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_BASE + '/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// attach access token
api.interceptors.request.use((config) => {
    const access = getAccessToken();
    if (access && config.headers) {
        config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
});

// refresh logic on 401 response from expired access token
let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

function onRefreshed(token: string | null) {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
}

api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        // defensive: ensure we have a config to retry
        if (!error.config) return Promise.reject(error);

        type AxiosRequestWithRetry = AxiosRequestConfig & { _retry?: boolean; headers?: any };
        const originalRequest = error.config as AxiosRequestWithRetry;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refresh = getRefreshToken();
            if (!refresh) {
                logout();
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // queue the request until token refreshed
                return new Promise((resolve, reject) => {
                    refreshSubscribers.push((token) => {
                        if (token) {
                            if (!originalRequest.headers) originalRequest.headers = {};
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(api(originalRequest));
                        } else {
                            reject(error);
                        }
                    });
                });
            }

            isRefreshing = true;
            try {
                // centralized refresh helper (uses raw axios internally)
                const newAccess = await refreshAccessToken();
                if (!newAccess) {
                    onRefreshed(null);
                    logout();
                    return Promise.reject(error);
                }

                onRefreshed(newAccess);
                if (!originalRequest.headers) originalRequest.headers = {};
                originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                return api(originalRequest);
            } catch (err) {
                onRefreshed(null);
                logout();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
