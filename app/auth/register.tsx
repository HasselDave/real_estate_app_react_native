import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function RegisterScreen() {
    const router = useRouter();
    const { signUp } = useAuth();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    // Same property images as welcome screen
    const propertyImages = [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    ];

    const updateFormData = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Full name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!acceptedTerms) {
            newErrors.terms = 'Please accept the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            await signUp(
                formData.email.trim(),
                formData.password,
                formData.fullName.trim()
            );
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert(
                'Registration Failed',
                error.message || 'An error occurred during registration'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <ScrollView className="flex-1" bounces={false}>
                {/* Background Images Section */}
                <View className="h-80 relative">
                    <View className="flex-1 flex-row">
                        {/* Left Column */}
                        <View className="flex-1 space-y-2 p-1">
                            <ImageBackground
                                source={{ uri: propertyImages[0] }}
                                className="flex-1 rounded-2xl overflow-hidden"
                                resizeMode="cover"
                            >
                                <View className="flex-1 bg-black/20" />
                            </ImageBackground>
                            <ImageBackground
                                source={{ uri: propertyImages[1] }}
                                className="flex-1 rounded-2xl overflow-hidden"
                                resizeMode="cover"
                            >
                                <View className="flex-1 bg-black/20" />
                            </ImageBackground>
                        </View>

                        {/* Middle Column */}
                        <View className="flex-1 space-y-2 p-1">
                            <ImageBackground
                                source={{ uri: propertyImages[2] }}
                                className="flex-2 rounded-2xl overflow-hidden"
                                resizeMode="cover"
                            >
                                <View className="flex-1 bg-black/20" />
                            </ImageBackground>
                            <ImageBackground
                                source={{ uri: propertyImages[3] }}
                                className="flex-1 rounded-2xl overflow-hidden"
                                resizeMode="cover"
                            >
                                <View className="flex-1 bg-black/20" />
                            </ImageBackground>
                        </View>

                        {/* Right Column */}
                        <View className="flex-1 space-y-2 p-1">
                            <ImageBackground
                                source={{ uri: propertyImages[4] }}
                                className="flex-1 rounded-2xl overflow-hidden"
                                resizeMode="cover"
                            >
                                <View className="flex-1 bg-black/20" />
                            </ImageBackground>
                            <ImageBackground
                                source={{ uri: propertyImages[5] }}
                                className="flex-1 rounded-2xl overflow-hidden"
                                resizeMode="cover"
                            >
                                <View className="flex-1 bg-black/20" />
                            </ImageBackground>
                        </View>
                    </View>

                    {/* Overlay Gradient */}
                    <View className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/80" />

                    {/* Back Button */}
                    <View className="absolute top-4 left-6">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 rounded-full bg-black/30 items-center justify-center"
                        >
                            <Ionicons name="arrow-back" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content Section */}
                <View className="flex-1 px-6 pt-8 pb-6">
                    {/* Title */}
                    <View className="mb-8">
                        <Text className="text-white text-3xl font-bold mb-2">
                            Create Account
                        </Text>
                        <Text className="text-gray-300 text-base">
                            Sign up to get started with Real Scout
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="mb-6">
                        <Input
                            label="Full Name"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChangeText={(value) => updateFormData('fullName', value)}
                            icon="person-outline"
                            error={errors.fullName}
                        />

                        <Input
                            label="Email Address"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChangeText={(value) => updateFormData('email', value)}
                            keyboardType="email-address"
                            icon="mail-outline"
                            error={errors.email}
                        />

                        <Input
                            label="Password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChangeText={(value) => updateFormData('password', value)}
                            secureTextEntry
                            icon="lock-closed-outline"
                            error={errors.password}
                        />

                        <Input
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChangeText={(value) => updateFormData('confirmPassword', value)}
                            secureTextEntry
                            icon="lock-closed-outline"
                            error={errors.confirmPassword}
                        />

                        {/* Terms and Conditions */}
                        <View className="mb-6">
                            <TouchableOpacity
                                className="flex-row items-start mb-2"
                                onPress={() => setAcceptedTerms(!acceptedTerms)}
                            >
                                <View className={`w-5 h-5 border-2 rounded mr-3 mt-0.5 items-center justify-center ${
                                    acceptedTerms ? 'bg-primary-500 border-primary-500' : 'border-gray-500'
                                }`}>
                                    {acceptedTerms && (
                                        <Ionicons name="checkmark" size={14} color="white" />
                                    )}
                                </View>
                                <Text className="text-gray-300 text-sm leading-5 flex-1">
                                    By creating an account, you agree to our{' '}
                                    <Text className="text-primary-400 font-medium">Terms of Service</Text>
                                    {' '}and{' '}
                                    <Text className="text-primary-400 font-medium">Privacy Policy</Text>
                                </Text>
                            </TouchableOpacity>
                            {errors.terms && (
                                <Text className="text-red-400 text-sm mt-1">{errors.terms}</Text>
                            )}
                        </View>

                        {/* Register Button */}
                        <Button
                            title="Create Account"
                            onPress={handleRegister}
                            loading={loading}
                            disabled={loading}
                            variant="primary"
                        />
                    </View>

                    {/* Divider */}
                    <View className="flex-row items-center my-6">
                        <View className="flex-1 h-px bg-gray-600" />
                        <Text className="px-4 text-gray-400 text-sm">or continue with</Text>
                        <View className="flex-1 h-px bg-gray-600" />
                    </View>

                    {/* Google Sign Up */}
                    <Button
                        title="Sign up with Google"
                        onPress={() => {
                            console.log('Google Sign-up pressed');
                        }}
                        variant="google"
                        icon="logo-google"
                    />

                    {/* Sign In Link */}
                    <View className="flex-row justify-center items-center mt-8 mb-6">
                        <Text className="text-gray-400 text-base">
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/auth/login')}>
                            <Text className="text-primary-400 font-semibold text-base">
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}