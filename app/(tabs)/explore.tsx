import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
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
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1" bounces={false}>
                {/* Header */}
                <View className="flex-row items-center px-6 pt-4 pb-2">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                    >
                        <Ionicons name="arrow-back" size={20} color="#374151" />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View className="flex-1 px-6 pt-8">
                    {/* Title */}
                    <View className="mb-8">
                        <Text className="text-3xl font-bold text-gray-900 mb-2">
                            Create Account
                        </Text>
                        <Text className="text-gray-500 text-base">
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
                        <View className="flex-row items-start mb-6">
                            <View className="w-5 h-5 border border-gray-300 rounded mr-3 mt-0.5" />
                            <Text className="text-gray-600 text-sm leading-5 flex-1">
                                By creating an account, you agree to our{' '}
                                <Text className="text-primary-500 font-medium">Terms of Service</Text>
                                {' '}and{' '}
                                <Text className="text-primary-500 font-medium">Privacy Policy</Text>
                            </Text>
                        </View>

                        {/* Register Button */}
                        <Button
                            title="Create Account"
                            onPress={handleRegister}
                            loading={loading}
                            disabled={loading}
                        />
                    </View>

                    {/* Divider */}
                    <View className="flex-row items-center my-6">
                        <View className="flex-1 h-px bg-gray-200" />
                        <Text className="px-4 text-gray-400 text-sm">or continue with</Text>
                        <View className="flex-1 h-px bg-gray-200" />
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
                        <Text className="text-gray-500 text-base">
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/auth/login')}>
                            <Text className="text-primary-500 font-semibold text-base">
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}