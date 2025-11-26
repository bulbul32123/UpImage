import { useState, useCallback, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export const useProfileUpdate = (initialFormData) => {
  const { uploadImageToCloudinary, updateProfile, cancelPendingUpload, formData } =
    useAuth();

  const [localFormData, setLocalFormData] = useState(initialFormData);
  const [uiState, setUiState] = useState({
    isEditing: false,
    isSaving: false,
    isUploadingImage: false,
    error: "",
    success: "",
  });

  const fileInputRef = useRef(null);
  const tempFileRef = useRef(null);
  const messageTimeoutRef = useRef();

  useEffect(() => {
    setLocalFormData({
      name: formData.name,
      email: formData.email,
      profileImage: formData.profileImage,
      originalProfileImage: formData.profileImage,
    });
  }, [formData]);

  useEffect(() => {
    if (uiState.success || uiState.error) {
      messageTimeoutRef.current = setTimeout(() => {
        setUiState((prev) => ({ ...prev, success: "", error: "" }));
      }, 3000);
    }
    return () => {
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, [uiState.success, uiState.error]);

  const showMessage = useCallback(
    (type, message) => {
      setUiState((prev) => ({
        ...prev,
        [type]: message,
      }));
    },
    []
  );

  const handleInputChange = useCallback(
    (field, value) => {
      setLocalFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      if (uiState.error) {
        setUiState((prev) => ({ ...prev, error: "" }));
      }
    },
    [uiState.error]
  );

  const validateFile = useCallback((file) => {
    const MAX_SIZE = 5 * 1024 * 1024;
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!file) return { valid: false, error: "No file selected" };
    if (file.size > MAX_SIZE) return { valid: false, error: "File size must be less than 5MB" };
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: "Please upload JPG, PNG, GIF or WebP image" };
    }
    return { valid: true };
  }, []);

  const handleImageUpload = useCallback(
    (event) => {
      const file = event?.target?.files?.[0];
      if (!file) return;

      const validation = validateFile(file);
      if (!validation.valid) {
        showMessage("error", validation.error);
        return;
      }

      tempFileRef.current = file;
      const previewUrl = URL.createObjectURL(file);
      setLocalFormData((prev) => ({
        ...prev,
        profileImage: previewUrl,
      }));
      showMessage("success", "Image selected. Click save to confirm.");
    },
    [validateFile, showMessage]
  );

  const handleSave = useCallback(async () => {
    if (!localFormData.name.trim()) {
      showMessage("error", "Name is required");
      return;
    }
    if (!localFormData.email.trim()) {
      showMessage("error", "Email is required");
      return;
    }

    setUiState((prev) => ({ ...prev, isSaving: true }));

    try {
      let finalProfileImage = localFormData.profileImage;

      if (tempFileRef.current && localFormData.profileImage.startsWith("blob:")) {
        setUiState((prev) => ({ ...prev, isUploadingImage: true }));
        finalProfileImage = await uploadImageToCloudinary(
          tempFileRef.current,
          localFormData.originalProfileImage
        );

        if (!finalProfileImage) {
          showMessage("error", "Failed to upload image");
          setUiState((prev) => ({ ...prev, isUploadingImage: false, isSaving: false }));
          return;
        }

        tempFileRef.current = null;
      }

      const result = await updateProfile({
        name: localFormData.name,
        email: localFormData.email,
        profileImage: finalProfileImage,
      });

      if (result.success) {
        setLocalFormData((prev) => ({
          ...prev,
          originalProfileImage: finalProfileImage,
        }));
        showMessage("success", "Profile updated successfully!");
        setUiState((prev) => ({ ...prev, isEditing: false }));
      } else {
        showMessage("error", result.error || "Failed to update profile");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update profile";
      showMessage("error", message);
    } finally {
      setUiState((prev) => ({
        ...prev,
        isSaving: false,
        isUploadingImage: false,
      }));
    }
  }, [localFormData, uploadImageToCloudinary, updateProfile, showMessage]);

  const handleCancel = useCallback(() => {
    setLocalFormData({
      name: formData.name,
      email: formData.email,
      profileImage: formData.profileImage,
      originalProfileImage: formData.profileImage,
    });

    if (tempFileRef.current) {
      cancelPendingUpload();
      tempFileRef.current = null;
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setUiState((prev) => ({
      ...prev,
      isEditing: false,
      error: "",
      success: "",
    }));
  }, [formData, cancelPendingUpload]);

  const handleEditClick = useCallback(() => {
    setUiState((prev) => ({ ...prev, isEditing: true }));
  }, []);

  const isImageChanged =
    localFormData.profileImage !== localFormData.originalProfileImage;

  const isFormChanged =
    localFormData.name !== formData.name ||
    localFormData.email !== formData.email ||
    isImageChanged;

  return {
    localFormData,
    setLocalFormData,
    uiState,
    setUiState,
    fileInputRef,
    handleInputChange,
    handleImageUpload,
    handleSave,
    handleCancel,
    handleEditClick,
    showMessage,
    isFormChanged,
    isImageChanged,
  };
};
