import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => {
                if (user) {
                    router.replace('/(tabs)');
                } else {
                    router.replace('/auth/welcome');
                }
            }, 2000); // Show splash for 2 seconds

            return () => clearTimeout(timer);
        }
    }, [loading, user]);

    return (
        <View className="flex-1 bg-white justify-center items-center">
            {/* Logo Container */}
            <View className="items-center mb-8">
                {/* Logo Circle with Gradient Effect */}
                <View className="w-24 h-24 rounded-full bg-primary-500 justify-center items-center mb-4 shadow-lg">
                    <Text className="text-white text-3xl font-bold">RS</Text>
                </View>

                {/* App Name */}
                <Text className="text-3xl font-bold text-gray-900 tracking-wide">
                    REAL SCOUT
                </Text>

                {/* Tagline */}
                <Text className="text-gray-500 text-base mt-2 text-center px-8">
                    Connecting you to your ideal home
                </Text>
            </View>

            {/* Animated Dots */}
            <View className="flex-row space-x-2 mt-12">
                <View className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                <View className="w-2 h-2 bg-primary-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <View className="w-2 h-2 bg-primary-100 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </View>
        </View>
    );
}