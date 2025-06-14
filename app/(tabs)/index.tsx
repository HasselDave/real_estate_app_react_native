// app/(tabs)/index.tsx - Home Screen with API Test
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    RefreshControl,
    Alert,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import BayutApiService from '../../services/bayutApi';

const { width } = Dimensions.get('window');

// Type definitions for the API response
interface Photo {
    id: number;
    externalID: string;
    title: string;
    orderIndex: number;
    nimaScore: number;
    url: string;
}

interface Location {
    id: number;
    level: number;
    externalID: string;
    name: string;
    slug: string;
    namePrimary?: string;
    nameSecondary?: string;
}

interface Property {
    id: number;
    externalID: string;
    title: string;
    description?: string;
    price: number;
    rentFrequency?: string;
    rooms?: number;
    baths?: number;
    area?: number;
    areaUnit?: string;
    purpose: string;
    furnishingStatus?: string;
    propertyType?: string;
    location?: Location[];
    contactName?: string;
    photos?: Photo[];
    coverPhoto?: Photo;
    isVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

interface ApiResponse {
    hits: Property[];
    nbHits: number;
    page: number;
    nbPages: number;
}

export default function HomeScreen() {
    const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
    const [recommendedProperties, setRecommendedProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadProperties = async (isRefresh: boolean = false): Promise<void> => {
        try {
            if (!isRefresh) setLoading(true);
            setError(null);

            console.log('Loading properties...');

            // Load both featured and recommended properties
            const [featuredResponse, recommendedResponse] = await Promise.all([
                BayutApiService.getFeaturedProperties(8),
                BayutApiService.getRecommendedProperties(8)
            ]);

            console.log('Featured response:', featuredResponse);
            console.log('Recommended response:', recommendedResponse);

            // Check if responses have the expected structure
            if (featuredResponse && (featuredResponse as ApiResponse).hits) {
                setFeaturedProperties((featuredResponse as ApiResponse).hits);
                console.log(`Loaded ${(featuredResponse as ApiResponse).hits.length} featured properties`);
            } else {
                console.warn('Featured properties response missing hits array');
            }

            if (recommendedResponse && (recommendedResponse as ApiResponse).hits) {
                setRecommendedProperties((recommendedResponse as ApiResponse).hits);
                console.log(`Loaded ${(recommendedResponse as ApiResponse).hits.length} recommended properties`);
            } else {
                console.warn('Recommended properties response missing hits array');
            }

        } catch (err) {
            console.error('Error loading properties:', err);
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
            Alert.alert(
                'Error Loading Properties',
                errorMessage,
                [
                    { text: 'Retry', onPress: () => loadProperties() },
                    { text: 'Cancel', style: 'cancel' }
                ]
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = (): void => {
        setRefreshing(true);
        loadProperties(true);
    };

    useEffect(() => {
        loadProperties();
    }, []);

    const formatPrice = (price: number | undefined, rentFrequency?: string): string => {
        if (!price) return 'Price on request';
        const formattedPrice = `AED ${price.toLocaleString()}`;
        return rentFrequency ? `${formattedPrice} / ${rentFrequency}` : formattedPrice;
    };

    const getLocationString = (locationArray?: Location[]): string => {
        if (!locationArray || locationArray.length === 0) {
            return 'Location not specified';
        }
        // Get the most specific location names
        return locationArray
            .slice(0, 2)
            .map(loc => loc.name || loc.namePrimary || 'Unknown')
            .join(', ');
    };

    const getImageUrl = (property: Property): string | null => {
        if (property.coverPhoto?.url) {
            return property.coverPhoto.url;
        }
        if (property.photos && property.photos.length > 0 && property.photos[0]?.url) {
            return property.photos[0].url;
        }
        return null;
    };

    interface PropertyCardProps {
        property: Property;
        index: number;
    }

    const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
        const imageUrl = getImageUrl(property);

        return (
            <TouchableOpacity
                className="bg-white rounded-2xl shadow-soft overflow-hidden mr-4"
                style={{ width: width * 0.75 }}
                onPress={() => console.log('Property pressed:', property.externalID)}
            >
                {imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        className="w-full h-48"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="w-full h-48 bg-gray-200 justify-center items-center">
                        <Feather name="image" size={40} color="#9CA3AF" />
                        <Text className="text-gray-500 mt-2">No Image</Text>
                    </View>
                )}

                <View className="p-4">
                    <Text className="text-lg font-display font-semibold text-gray-900 mb-2" numberOfLines={2}>
                        {property.title || 'Property Title'}
                    </Text>

                    <Text className="text-xl font-bold text-primary-600 mb-2">
                        {formatPrice(property.price, property.rentFrequency)}
                    </Text>

                    <View className="flex-row items-center mb-3">
                        <Feather name="map-pin" size={14} color="#6B7280" />
                        <Text className="text-sm text-gray-600 ml-1 flex-1" numberOfLines={1}>
                            {getLocationString(property.location)}
                        </Text>
                    </View>

                    <View className="flex-row items-center space-x-4">
                        {property.rooms && property.rooms > 0 && (
                            <View className="flex-row items-center">
                                <Feather name="home" size={14} color="#6B7280" />
                                <Text className="text-sm text-gray-600 ml-1">
                                    {property.rooms} bed{property.rooms !== 1 ? 's' : ''}
                                </Text>
                            </View>
                        )}

                        {property.baths && property.baths > 0 && (
                            <View className="flex-row items-center">
                                <Feather name="droplet" size={14} color="#6B7280" />
                                <Text className="text-sm text-gray-600 ml-1">
                                    {property.baths} bath{property.baths !== 1 ? 's' : ''}
                                </Text>
                            </View>
                        )}
                    </View>

                    {property.area && property.area > 0 && (
                        <Text className="text-sm text-gray-500 mt-2">
                            {property.area.toLocaleString()} sqft
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <View className="flex-1 justify-center items-center">
                    <View className="bg-white p-8 rounded-2xl shadow-soft">
                        <Text className="text-lg font-display font-semibold text-center mb-2">
                            Loading Properties
                        </Text>
                        <Text className="text-gray-600 text-center">
                            Please wait while we fetch the latest listings...
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView
                className="flex-1"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="px-6 py-4">
                    <Text className="text-3xl font-display font-bold text-gray-900 mb-2">
                        Real Scout
                    </Text>
                    <Text className="text-gray-600 text-base">
                        Find your perfect home
                    </Text>
                </View>

                {/* API Status */}
                <View className="mx-6 mb-6 p-4 bg-white rounded-xl shadow-soft">
                    <Text className="text-lg font-display font-semibold mb-2">
                        API Status
                    </Text>
                    <Text className="text-sm text-gray-600 mb-1">
                        Featured Properties: {featuredProperties.length}
                    </Text>
                    <Text className="text-sm text-gray-600">
                        Recommended Properties: {recommendedProperties.length}
                    </Text>
                    {error && (
                        <Text className="text-sm text-error mt-2">
                            Error: {error}
                        </Text>
                    )}
                </View>

                {/* Featured Properties */}
                {featuredProperties.length > 0 && (
                    <View className="mb-8">
                        <View className="flex-row justify-between items-center px-6 mb-4">
                            <Text className="text-xl font-display font-bold text-gray-900">
                                Featured Properties
                            </Text>
                            <TouchableOpacity>
                                <Text className="text-primary-600 font-medium">See all</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 24 }}
                        >
                            {featuredProperties.map((property, index) => (
                                <PropertyCard
                                    key={property.externalID || `featured-${index}`}
                                    property={property}
                                    index={index}
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Recommended Properties */}
                {recommendedProperties.length > 0 && (
                    <View className="mb-8">
                        <View className="flex-row justify-between items-center px-6 mb-4">
                            <Text className="text-xl font-display font-bold text-gray-900">
                                Our Recommendations
                            </Text>
                            <TouchableOpacity>
                                <Text className="text-primary-600 font-medium">See all</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 24 }}
                        >
                            {recommendedProperties.map((property, index) => (
                                <PropertyCard
                                    key={property.externalID || `recommended-${index}`}
                                    property={property}
                                    index={index}
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Empty State */}
                {featuredProperties.length === 0 && recommendedProperties.length === 0 && !loading && (
                    <View className="flex-1 justify-center items-center px-6 py-20">
                        <Feather name="home" size={64} color="#D1D5DB" />
                        <Text className="text-xl font-display font-semibold text-gray-900 mt-4 mb-2">
                            No Properties Found
                        </Text>
                        <Text className="text-gray-600 text-center mb-6">
                            We're having trouble loading properties. Please check your internet connection and try again.
                        </Text>
                        <TouchableOpacity
                            onPress={() => loadProperties()}
                            className="bg-primary-500 px-6 py-3 rounded-xl"
                        >
                            <Text className="text-white font-medium">Retry</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}