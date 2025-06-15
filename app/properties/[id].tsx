// app/property/[id].tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    Dimensions,
    Share,
    Linking,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import PropertyAPI from '../../services/api';

const { width, height } = Dimensions.get('window');

interface Property {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    type: string;
    city: string;
    state: string;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    address: string;
    zipcode: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    features: string[];
    agent: {
        name: string;
        phone: string;
        email: string;
    };
    status: string;
    createdAt: string;
}

const PropertyDetailsScreen: React.FC = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user, userProfile } = useAuth();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [favoriteLoading, setFavoriteLoading] = useState<boolean>(false);

    useEffect(() => {
        if (id) {
            loadProperty();
            if (user) {
                checkIfFavorite();
            }
        }
    }, [id, user]);

    const loadProperty = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await PropertyAPI.getPropertyById(id as string);

            if (response.success) {
                setProperty(response.data);
            } else {
                Alert.alert('Error', 'Property not found');
                router.back();
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load property details');
            console.error('Load property error:', error);
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const checkIfFavorite = async (): Promise<void> => {
        if (!user) return;

        try {
            const response = await PropertyAPI.getFavorites(user.uid);
            if (response.success) {
                const isFav = response.data.some((favProperty: Property) => favProperty.id === id);
                setIsFavorite(isFav);
            }
        } catch (error) {
            console.error('Error checking favorite status:', error);
        }
    };

    const handleShare = async (): Promise<void> => {
        if (!property) return;

        try {
            await Share.share({
                message: `Check out this amazing ${property.type}: ${property.title} - ${PropertyAPI.formatPrice(property.price)}`,
                title: property.title,
            });
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    const handleCall = (): void => {
        if (!property?.agent.phone) return;

        const phoneNumber = property.agent.phone.replace(/[^\d]/g, '');
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const handleEmail = (): void => {
        if (!property?.agent.email) return;

        const subject = `Inquiry about ${property.title}`;
        const body = `Hi ${property.agent.name},\n\nI'm interested in the property at ${property.address}. Could you please provide more information?\n\nThanks!`;

        Linking.openURL(`mailto:${property.agent.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    };

    const toggleFavorite = async (): Promise<void> => {
        if (!user) {
            Alert.alert('Login Required', 'Please log in to save favorites', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Login', onPress: () => router.push('/auth/login') }
            ]);
            return;
        }

        setFavoriteLoading(true);
        try {
            const response = await PropertyAPI.toggleFavorite(user.uid, id as string);
            if (response.success) {
                setIsFavorite(response.isFavorite);

                // Show feedback to user
                const message = response.isFavorite
                    ? 'Added to favorites!'
                    : 'Removed from favorites!';

                Alert.alert('Success', message);
            }
        } catch (error) {
            console.error('Toggle favorite error:', error);
            Alert.alert('Error', 'Failed to update favorites. Please try again.');
        } finally {
            setFavoriteLoading(false);
        }
    };

    const ImageGallery: React.FC = () => {
        if (!property?.images.length) return null;

        const renderImage = ({ item, index }: { item: string; index: number }) => (
            <Image
                source={{ uri: item }}
                style={{ width, height: 300 }}
                className="bg-gray-700"
                resizeMode="cover"
            />
        );

        return (
            <View className="relative">
                <FlatList
                    data={property.images}
                    renderItem={renderImage}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(event) => {
                        const index = Math.round(event.nativeEvent.contentOffset.x / width);
                        setCurrentImageIndex(index);
                    }}
                />

                {/* Image indicators */}
                <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
                    {property.images.map((_, index) => (
                        <View
                            key={index}
                            className={`w-2 h-2 rounded-full mx-1 ${
                                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                        />
                    ))}
                </View>

                {/* Header overlay */}
                <View className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent pt-12 pb-6">
                    <View className="flex-row items-center justify-between px-6">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="bg-black/30 rounded-full p-3"
                        >
                            <Text className="text-white text-lg">←</Text>
                        </TouchableOpacity>

                        <View className="flex-row items-center space-x-3">
                            <TouchableOpacity
                                onPress={handleShare}
                                className="bg-black/30 rounded-full p-3"
                            >
                                <Text className="text-white text-lg">↗</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={toggleFavorite}
                                className={`rounded-full p-3 ${
                                    favoriteLoading
                                        ? 'bg-black/30'
                                        : isFavorite
                                            ? 'bg-red-500/80'
                                            : 'bg-black/30'
                                }`}
                                disabled={favoriteLoading}
                            >
                                <Text className="text-white text-lg">
                                    {favoriteLoading ? '⏳' : isFavorite ? '❤️' : '♡'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Property type badge */}
                <View className="absolute top-20 left-6">
                    <View className="bg-primary-500 px-3 py-1 rounded-lg">
                        <Text className="text-white text-sm font-medium capitalize">
                            {property.type}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    const PropertyInfo: React.FC = () => {
        if (!property) return null;

        return (
            <View className="px-6 py-6">
                {/* Price and Title */}
                <View className="mb-6">
                    <Text className="text-primary-400 text-3xl font-bold mb-2">
                        {PropertyAPI.formatPrice(property.price)}
                    </Text>
                    <Text className="text-white text-2xl font-bold mb-2">
                        {property.title}
                    </Text>
                    <Text className="text-gray-400 text-base">
                        📍 {property.address}, {property.city}, {property.state} {property.zipcode}
                    </Text>
                </View>

                {/* Property Stats */}
                <View className="flex-row items-center justify-between bg-gray-800 rounded-xl p-4 mb-6">
                    <View className="items-center flex-1">
                        <Text className="text-white text-xl font-bold">{property.bedrooms}</Text>
                        <Text className="text-gray-400 text-sm">Bedrooms</Text>
                    </View>
                    <View className="w-px h-8 bg-gray-700" />
                    <View className="items-center flex-1">
                        <Text className="text-white text-xl font-bold">{property.bathrooms}</Text>
                        <Text className="text-gray-400 text-sm">Bathrooms</Text>
                    </View>
                    <View className="w-px h-8 bg-gray-700" />
                    <View className="items-center flex-1">
                        <Text className="text-white text-xl font-bold">{property.sqft.toLocaleString()}</Text>
                        <Text className="text-gray-400 text-sm">Sq Ft</Text>
                    </View>
                </View>

                {/* Description */}
                <View className="mb-6">
                    <Text className="text-white text-xl font-bold mb-3">Description</Text>
                    <Text className="text-gray-300 text-base leading-6">
                        {property.description}
                    </Text>
                </View>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                    <View className="mb-6">
                        <Text className="text-white text-xl font-bold mb-3">Features</Text>
                        <View className="flex-row flex-wrap">
                            {property.features.map((feature, index) => (
                                <View
                                    key={index}
                                    className="bg-gray-800 px-3 py-2 rounded-lg mr-2 mb-2"
                                >
                                    <Text className="text-gray-300 text-sm capitalize">
                                        ✓ {feature}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Agent Information */}
                <View className="bg-gray-800 rounded-xl p-5 mb-6">
                    <Text className="text-white text-xl font-bold mb-4">Contact Agent</Text>

                    <View className="flex-row items-center mb-4">
                        <View className="bg-primary-500 rounded-full w-12 h-12 items-center justify-center mr-4">
                            <Text className="text-white font-bold text-lg">
                                {property.agent.name.charAt(0)}
                            </Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-white text-lg font-semibold">
                                {property.agent.name}
                            </Text>
                            <Text className="text-gray-400 text-sm">Real Estate Agent</Text>
                        </View>
                    </View>

                    <View className="flex-row space-x-3">
                        <TouchableOpacity
                            onPress={handleCall}
                            className="flex-1 bg-primary-500 rounded-xl py-3 items-center"
                        >
                            <Text className="text-white font-semibold">📞 Call</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleEmail}
                            className="flex-1 bg-gray-700 rounded-xl py-3 items-center"
                        >
                            <Text className="text-white font-semibold">✉️ Email</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Location */}
                <View className="bg-gray-800 rounded-xl p-5 mb-6">
                    <Text className="text-white text-xl font-bold mb-3">Location</Text>
                    <Text className="text-gray-300 text-base mb-3">
                        {property.address}
                    </Text>
                    <Text className="text-gray-300 text-base mb-4">
                        {property.city}, {property.state} {property.zipcode}
                    </Text>

                    {/* Mock map placeholder */}
                    <View className="bg-gray-700 rounded-lg h-32 items-center justify-center">
                        <Text className="text-gray-400 text-base">📍 Map View</Text>
                        <Text className="text-gray-500 text-sm mt-1">
                            Lat: {property.coordinates.lat.toFixed(4)},
                            Lng: {property.coordinates.lng.toFixed(4)}
                        </Text>
                    </View>
                </View>

                {/* Property Details */}
                <View className="bg-gray-800 rounded-xl p-5 mb-20">
                    <Text className="text-white text-xl font-bold mb-4">Property Details</Text>

                    <View className="space-y-3">
                        <View className="flex-row justify-between py-2">
                            <Text className="text-gray-400">Property Type</Text>
                            <Text className="text-white capitalize">{property.type}</Text>
                        </View>
                        <View className="h-px bg-gray-700" />

                        <View className="flex-row justify-between py-2">
                            <Text className="text-gray-400">Status</Text>
                            <Text className="text-primary-400 capitalize font-medium">
                                {property.status}
                            </Text>
                        </View>
                        <View className="h-px bg-gray-700" />

                        <View className="flex-row justify-between py-2">
                            <Text className="text-gray-400">Listed Date</Text>
                            <Text className="text-white">
                                {new Date(property.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                        <View className="h-px bg-gray-700" />

                        <View className="flex-row justify-between py-2">
                            <Text className="text-gray-400">Price per Sq Ft</Text>
                            <Text className="text-white">
                                ${Math.round(property.price / property.sqft).toLocaleString()}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-900">
                <View className="flex-1 justify-center items-center">
                    <Text className="text-lg text-gray-300">Loading property details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!property) {
        return (
            <SafeAreaView className="flex-1 bg-gray-900">
                <View className="flex-1 justify-center items-center px-6">
                    <Text className="text-6xl mb-4">🏠</Text>
                    <Text className="text-xl font-semibold text-white mb-2">Property Not Found</Text>
                    <Text className="text-gray-400 text-center mb-6">
                        The property you're looking for doesn't exist or has been removed.
                    </Text>
                    <TouchableOpacity
                        className="bg-primary-500 px-6 py-3 rounded-xl"
                        onPress={() => router.back()}
                    >
                        <Text className="text-white font-medium">Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View className="flex-1 bg-gray-900">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <ImageGallery />
                <PropertyInfo />
            </ScrollView>

            {/* Fixed bottom CTA */}
            <View className="absolute bottom-0 left-0 right-0 bg-gray-900 px-6 py-4 border-t border-gray-800">
                <View className="flex-row space-x-3">
                    <TouchableOpacity
                        onPress={handleCall}
                        className="flex-1 bg-primary-500 rounded-xl py-4 items-center"
                    >
                        <Text className="text-white font-bold text-lg">Contact Agent</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                'Schedule Tour',
                                'This feature would allow you to schedule a property tour.',
                                [{ text: 'OK' }]
                            );
                        }}
                        className="flex-1 bg-secondary-500 rounded-xl py-4 items-center"
                    >
                        <Text className="text-white font-bold text-lg">Schedule Tour</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default PropertyDetailsScreen;