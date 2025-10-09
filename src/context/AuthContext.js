"use client";
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const { data } = await api.get('/auth/me');
            if (data.success) setUser(data.user);
        } catch (err) {
            console.error(err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);
    const refreshUser = async () => {
        try {
            const response = await api.get('/user/profile');
            if (response.data.success) {
                setUser(response.data.data);
            }
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    const signIn = async (credentials) => {
        const { data } = await api.post('/auth/signin', credentials);
        if (data.success) {
            setUser(data.user);
        }
        return data;
    };

    const signOut = async () => {
        await api.post('/auth/signout');
        setUser(null);
        router.push('/auth/signin');
    };



    return (
        <AuthContext.Provider value={{ fetchUser, user, setUser, loading, refreshUser, signOut, signIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);