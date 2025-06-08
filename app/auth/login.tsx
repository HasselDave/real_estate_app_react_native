import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import Button from '../../components/Button';
import Input from '../../components/Input';


export default function LoginScreen() {
    const router = useRouter();
    const { signIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{email?: string; password?: string}>({});

    const validateForm = () => {
        const newErrors: {email?: string; password?: string} = {};

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            await signIn(email.trim(), password);
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert(
                'Login Failed',
                error.message || 'An error occurred during login'
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
                            Welcome Back
                        </Text>
                        <Text className="text-gray-500 text-base">
                            Sign in to your account to continue
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="mb-6">
                        <Input
                            label="Email Address"
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            icon="mail-outline"
                            error={errors.email}
                        />

                        <Input
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            icon="lock-closed-outline"
                            error={errors.password}
                        />

                        {/* Forgot Password */}
                        <TouchableOpacity className="self-end mb-6">
                            <Text className="text-primary-500 text-sm font-medium">
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <Button
                            title="Sign In"
                            onPress={handleLogin}
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

                    {/* Google Sign In */}
                    <Button
                        title="Sign in with Google"
                        onPress={() => {

                            console.log('Google Sign-in pressed');
                        }}
                        variant="google"
                        icon="logo-google"
                    />

                    {/* Sign Up Link */}
                    <View className="flex-row justify-center items-center mt-8">
                        <Text className="text-gray-500 text-base">
                            Don't have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/auth/register')}>
                            <Text className="text-primary-500 font-semibold text-base">
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}