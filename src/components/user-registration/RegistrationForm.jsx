"use client"
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'fullName':
        if (!value?.trim()) {
          newErrors.fullName = 'Full name is required';
        } else if (value?.trim()?.length < 2) {
          newErrors.fullName = 'Full name must be at least 2 characters';
        } else {
          delete newErrors?.fullName;
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = 'Email address is required';
        } else if (!emailRegex?.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors?.email;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value?.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(value)) {
          newErrors.password = 'Password must contain uppercase, lowercase, and number';
        } else {
          delete newErrors?.password;
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData?.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors?.confirmPassword;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (touchedFields?.[name]) {
      validateField(name, value);
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e?.target;
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    const allTouched = Object.keys(formData)?.reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouchedFields(allTouched);

    let isValid = true;
    Object.keys(formData)?.forEach(key => {
      if (!validateField(key, formData?.[key])) {
        isValid = false;
      }
    });

    if (!isValid) return;

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Registration successful:', formData);
      
      navigate('/dashboard-overview');
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Full Name"
        type="text"
        name="fullName"
        placeholder="Enter your full name"
        value={formData?.fullName}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        error={touchedFields?.fullName ? errors?.fullName : ''}
        required
        disabled={isLoading}
      />
      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="Enter your email address"
        value={formData?.email}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        error={touchedFields?.email ? errors?.email : ''}
        required
        disabled={isLoading}
      />
      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Create a strong password"
        description="Must be at least 8 characters with uppercase, lowercase, and number"
        value={formData?.password}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        error={touchedFields?.password ? errors?.password : ''}
        required
        disabled={isLoading}
      />
      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        placeholder="Confirm your password"
        value={formData?.confirmPassword}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        error={touchedFields?.confirmPassword ? errors?.confirmPassword : ''}
        required
        disabled={isLoading}
      />
      {errors?.submit && (
        <div className="flex items-center space-x-2 p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error">
          <Icon name="AlertCircle" size={16} />
          <span>{errors?.submit}</span>
        </div>
      )}
      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
        iconName="UserPlus"
        iconPosition="left"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default RegistrationForm;