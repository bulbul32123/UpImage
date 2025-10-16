"use client";
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef
} from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        profileImage: "",
    });

    const uploadAbortControllerRef = useRef(null);

    const fetchUser = useCallback(async () => {
        try {
            const { data } = await api.get("/auth/me");
            if (data.success) {
                setUser(data.user);
                setFormData({
                    name: data.user.name,
                    email: data.user.email,
                    profileImage: data.user.profileImage,
                });
            }
        } catch (err) {
            console.error("Fetch user error:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const signIn = useCallback(
        async (credentials) => {
            try {
                const { data } = await api.post("/auth/signin", credentials);
                if (data.success) {
                    setUser(data.user);
                    setFormData({
                        name: data.user.name,
                        email: data.user.email,
                        profileImage: data.user.profileImage,
                    });
                }
                return data;
            } catch (error) {
                console.error("Sign in error:", error);
                throw error;
            }
        },
        []
    );

    const signOut = useCallback(async () => {
        try {
            await api.post("/auth/signout");
            setUser(null);
            setFormData({ name: "", email: "", profileImage: "" });
            router.push("/auth/signin");
        } catch (error) {
            console.error("Sign out error:", error);
        }
    }, [router]);

    const uploadImageToCloudinary = useCallback(
        async (file, oldImageUrl) => {
            uploadAbortControllerRef.current = new AbortController();

            try {
                const formDataObj = new FormData();
                formDataObj.append("file", file);

                const { data } = await api.post("/upload", formDataObj, {
                    headers: { "Content-Type": "multipart/form-data" },
                    signal: uploadAbortControllerRef.current.signal,
                });

                if (data.success && oldImageUrl) {
                    console.log("oldImageUrl", oldImageUrl);
                    deleteImageFromCloudinary(oldImageUrl).catch((err) =>
                        console.error("Failed to delete old image:", err)
                    );
                }

                return data.url;
            } catch (error) {
                if (error) {
                    console.log("Upload cancelled");
                    throw new Error("Upload cancelled");
                }
                throw error;
            }
        },
        []
    );

    const deleteImageFromCloudinary = useCallback(
        async (imageUrl) => {
            try {
                await api.post("/auth/delete-user-image", { url: imageUrl });
            } catch (error) {
                console.error("Delete image error:", error);
            }
        },
        []
    );

    const cancelPendingUpload = useCallback(() => {
        if (uploadAbortControllerRef.current) {
            uploadAbortControllerRef.current.abort();
            uploadAbortControllerRef.current = null;
        }
    }, []);

    const updateProfile = useCallback(
        async (data) => {
            try {
                const response = await api.patch("/profile/update", data);
                if (response.data.success) {
                    setUser(response.data.user);
                    setFormData({
                        name: response.data.user.name,
                        email: response.data.user.email,
                        profileImage: response.data.user.profileImage,
                    });
                    return { success: true };
                }
                return { success: false, error: "Failed to update profile" };
            } catch (error) {
                return { success: false, error: error };
            }
        },
        []
    );

    return (
        <AuthContext.Provider
            value={{
                fetchUser,
                user,
                formData,
                setFormData,
                setUser,
                setLoading,
                loading,
                signOut,
                signIn,
                updateProfile,
                uploadImageToCloudinary,
                cancelPendingUpload,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
