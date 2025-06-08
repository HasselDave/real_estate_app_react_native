import React from 'react';
import { View, Text, ScrollView, ImageBackground, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../../components/Button';

export default function WelcomeScreen() {
    const router = useRouter();

    // Sample property images - you'll replace these with actual property images
    const propertyImages = [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <ScrollView className="flex-1" bounces={false}>
                {/* Property Images Collage */}
                <View className="h-2/3 relative">
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
                </View>

                {/* Content Section */}
                <View className="flex-1 px-6 pt-8 pb-6">
                    {/* Welcome Text */}
                    <View className="mb-8">
                        <Text className="text-white text-4xl font-bold mb-3 text-center">
                            Let's Get Closer
                        </Text>
                        <Text className="text-white text-4xl font-bold mb-4 text-center">
                            to Your Ideal Home
                        </Text>
                        <Text className="text-gray-300 text-base text-center leading-6">
                            Login to Real Scout with Google
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    <View className="space-y-4">
                        <Button
                            title="Sign up with Google"
                            onPress={() => {

                                console.log('Google Sign-in pressed');
                            }}
                            variant="google"
                            icon="logo-google"
                        />

                        <View className="flex-row items-center my-4">
                            <View className="flex-1 h-px bg-gray-600" />
                            <Text className="px-4 text-gray-400 text-sm">or continue with</Text>
                            <View className="flex-1 h-px bg-gray-600" />
                        </View>

                        <Button
                            title="Sign up"
                            onPress={() => router.push('/auth/register')}
                            variant="primary"
                        />

                        <Button
                            title="Continue"
                            onPress={() => router.push('/auth/login')}
                            variant="outline"
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}