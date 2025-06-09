import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert, ImageBackground } from 'react-native';
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

    // Same property images as welcome screen
    const propertyImages = [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    ];

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
                            Welcome Back
                        </Text>
                        <Text className="text-gray-300 text-base">
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
                            <Text className="text-primary-400 text-sm font-medium">
                                Forgot Password?
                            </Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <Button
                            title="Sign In"
                            onPress={handleLogin}
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
                        <Text className="text-gray-400 text-base">
                            Don't have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/auth/register')}>
                            <Text className="text-primary-400 font-semibold text-base">
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}