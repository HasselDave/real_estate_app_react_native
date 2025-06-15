// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Image,
    Alert,
    RefreshControl,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router'; // Add this import
import PropertyAPI from '../../services/api';

const { width } = Dimensions.get('window');

// Define the Property interface
interface Property {
    id: string;
    title: string;
    price: number;
    images: string[];
    type: string;
    city: string;
    state: string;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
}

// Remove the navigation prop since we're using Expo Router
const HomeScreen: React.FC = () => {
    const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
    const [recommendedProperties, setRecommendedProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await PropertyAPI.getAllProperties();

            if (response.success) {
                // Set most recent properties as featured
                setFeaturedProperties(response.data.slice(0, 5));
                // Set remaining properties as recommendations (most appreciated)
                setRecommendedProperties(response.data.slice(5, 10));
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load properties. Please try again.');
            console.error('Load properties error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async (): Promise<void> => {
        setRefreshing(true);
        await loadProperties();
        setRefreshing(false);
    };

    interface PropertyCardProps {
        item: Property;
        featured?: boolean;
    }

    const PropertyCard: React.FC<PropertyCardProps> = ({ item, featured = false }) => (
        <TouchableOpacity
            className={`bg-gray-800 rounded-2xl overflow-hidden mr-4 ${
                featured ? 'w-72' : 'w-64'
            }`}
            onPress={() => {
                router.push(`/properties/${item.id}`);
            }}
        >
            <View className="relative">
                <Image
                    source={{ uri: item.images[0] }}
                    className={`w-full ${featured ? 'h-48' : 'h-40'} bg-gray-700`}
                    resizeMode="cover"
                />
                <View className="absolute top-3 left-3">
                    <View className="bg-primary-500 px-2 py-1 rounded-lg">
                        <Text className="text-white text-xs font-medium capitalize">{item.type}</Text>
                    </View>
                </View>
                <TouchableOpacity className="absolute top-3 right-3 bg-black/30 rounded-full p-2">
                    <Text className="text-white">♡</Text>
                </TouchableOpacity>

                {/* Gradient overlay at bottom */}
                <View className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
            </View>

            <View className="p-4">
                <Text className="text-white text-lg font-bold mb-1" numberOfLines={1}>
                    {item.title}
                </Text>
                <Text className="text-primary-400 font-bold text-xl mb-2">
                    {PropertyAPI.formatPrice(item.price)}
                </Text>

                <View className="flex-row items-center mb-3">
                    <Text className="text-gray-400 text-sm">📍 {item.city}, {item.state}</Text>
                </View>

                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center space-x-4">
                        <View className="flex-row items-center">
                            <Text className="text-gray-300 text-sm">🛏️ {item.bedrooms}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Text className="text-gray-300 text-sm">🚿 {item.bathrooms}</Text>
                        </View>
                    </View>
                    <Text className="text-gray-400 text-xs">{item.sqft} sqft</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const RecommendationCard: React.FC<PropertyCardProps> = ({ item }) => (
        <TouchableOpacity
            className="bg-gray-800 rounded-xl overflow-hidden mr-3 w-56"
            onPress={() => {
                router.push(`/properties/${item.id}`);
            }}
        >
            <View className="relative">
                <Image
                    source={{ uri: item.images[0] }}
                    className="w-full h-32 bg-gray-700"
                    resizeMode="cover"
                />
                <View className="absolute top-2 left-2">
                    <View className="bg-secondary-500 px-2 py-1 rounded-md">
                        <Text className="text-white text-xs font-medium">⭐ Recommended</Text>
                    </View>
                </View>
            </View>
            <View className="p-3">
                <Text className="text-white font-semibold mb-1" numberOfLines={1}>
                    {item.title}
                </Text>
                <Text className="text-primary-400 font-bold text-lg">
                    {PropertyAPI.formatPrice(item.price)}
                </Text>
                <Text className="text-gray-400 text-xs mt-1">
                    {item.city}, {item.state}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading && !refreshing) {
        return (
            <SafeAreaView className="flex-1 bg-gray-900">
                <View className="flex-1 justify-center items-center">
                    <Text className="text-lg text-gray-300">Loading properties...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <ScrollView
                className="flex-1"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="#ffffff"
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="px-6 pt-4 pb-6">
                    <View className="flex-row items-center justify-between mb-6">
                        <View className="flex-1">
                            <Text className="text-gray-400 text-sm mb-1">Good Evening</Text>
                            <Text className="text-white text-2xl font-bold">
                                Welcome to Real Scout
                            </Text>
                            <Text className="text-gray-400 text-base mt-1">
                                Find your perfect home
                            </Text>
                        </View>
                        <TouchableOpacity className="bg-gray-800 rounded-full p-3">
                            <Text className="text-white text-xl">🔔</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Quick Action Button to Explore - FIXED */}
                    <TouchableOpacity
                        className="bg-primary-500 rounded-2xl p-4 mb-6"
                        onPress={() => router.push('/explore')} // Changed from navigation.navigate
                    >
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                                <Text className="text-white font-bold text-lg mb-1">
                                    Start Your Search
                                </Text>
                                <Text className="text-primary-100 text-sm">
                                    Browse thousands of properties
                                </Text>
                            </View>
                            <View className="bg-white/20 rounded-full p-3">
                                <Text className="text-white text-xl">🔍</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Featured Properties Section */}
                {featuredProperties.length > 0 && (
                    <View className="mb-8">
                        <View className="flex-row items-center justify-between px-6 mb-4">
                            <View>
                                <Text className="text-white text-xl font-bold">Featured</Text>
                                <Text className="text-gray-400 text-sm">Recently added properties</Text>
                            </View>
                            <TouchableOpacity>
                                <Text className="text-primary-400 font-medium">See All</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={featuredProperties}
                            renderItem={({ item }) => <PropertyCard item={item} featured />}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 24 }}
                        />
                    </View>
                )}

                {/* Our Recommendation Section */}
                {recommendedProperties.length > 0 && (
                    <View className="mb-8">
                        <View className="flex-row items-center justify-between px-6 mb-4">
                            <View>
                                <Text className="text-white text-xl font-bold">Our Recommendation</Text>
                                <Text className="text-gray-400 text-sm">Handpicked for you</Text>
                            </View>
                            <TouchableOpacity>
                                <Text className="text-primary-400 font-medium">See All</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={recommendedProperties}
                            renderItem={({ item }) => <RecommendationCard item={item} />}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 24 }}
                        />
                    </View>
                )}

                {/* Empty State */}
                {featuredProperties.length === 0 && recommendedProperties.length === 0 && (
                    <View className="flex-1 justify-center items-center py-20">
                        <Text className="text-6xl mb-4">🏠</Text>
                        <Text className="text-xl font-semibold text-white mb-2">No Properties Available</Text>
                        <Text className="text-gray-400 text-center px-8 mb-6">
                            Properties will appear here once they are loaded from the server
                        </Text>
                        <TouchableOpacity
                            className="bg-primary-500 px-6 py-3 rounded-xl"
                            onPress={loadProperties}
                        >
                            <Text className="text-white font-medium">
                                Retry Loading
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen;