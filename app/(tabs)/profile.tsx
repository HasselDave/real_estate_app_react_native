// app/(tabs)/profile.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    TextInput,
    FlatList,
    RefreshControl,
    Modal,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import PropertyAPI from '../../services/api';

const { width } = Dimensions.get('window');

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

const ProfileScreen: React.FC = () => {
    const { user, userProfile, logout, updateUserProfile, loading: authLoading } = useAuth();
    const [favorites, setFavorites] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [newDisplayName, setNewDisplayName] = useState<string>('');
    const [updating, setUpdating] = useState<boolean>(false);
    const [loggingOut, setLoggingOut] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);

    // Mark component as mounted
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Handle authentication redirect with better timing
    useFocusEffect(
        React.useCallback(() => {
            // Only redirect if component is mounted, auth is not loading, and user is not authenticated
            if (mounted && !authLoading && !user) {
                console.log('User not authenticated, redirecting to welcome');
                // Small delay to ensure navigation is ready
                setTimeout(() => {
                    router.replace('/auth/welcome');
                }, 100);
            }
        }, [user, authLoading, mounted])
    );

    // Reload favorites when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            if (user && mounted && !authLoading) {
                console.log('Profile screen focused, reloading favorites');
                loadFavorites();
            }
        }, [user, mounted, authLoading])
    );

    useEffect(() => {
        if (user && mounted) {
            loadFavorites();
        }
    }, [user, mounted]);

    // Only set display name once when user/userProfile is first loaded
    useEffect(() => {
        if (user && !newDisplayName) {
            setNewDisplayName(userProfile?.displayName || user.displayName || '');
        }
    }, [user, userProfile]);

    // Handle modal opening - set display name when modal opens
    const handleModalOpen = useCallback(() => {
        setNewDisplayName(userProfile?.displayName || user?.displayName || '');
        setShowEditModal(true);
    }, [userProfile, user]);

    // Debug auth state changes
    useEffect(() => {
        console.log('Auth state debug:', {
            user: !!user,
            authLoading,
            mounted,
            userEmail: user?.email
        });
    }, [user, authLoading, mounted]);

    const loadFavorites = async (): Promise<void> => {
        if (!user || !mounted) return;

        try {
            setLoading(true);
            const response = await PropertyAPI.getFavorites(user.uid);
            if (response.success && mounted) {
                setFavorites(response.data);
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
            if (mounted) {
                Alert.alert('Error', 'Failed to load favorites');
            }
        } finally {
            if (mounted) {
                setLoading(false);
            }
        }
    };

    const onRefresh = async (): Promise<void> => {
        if (!mounted) return;
        setRefreshing(true);
        await loadFavorites();
        if (mounted) {
            setRefreshing(false);
        }
    };

    const handleLogout = async (): Promise<void> => {
        console.log('Starting logout process...');

        try {
            setLoggingOut(true);
            console.log('Calling logout function...');

            await logout();
            console.log('Logout completed successfully');

            // Navigation will be handled by the auth state change
            // No need to manually navigate here

        } catch (error) {
            console.error('Logout error:', error);
            if (mounted) {
                Alert.alert(
                    'Logout Error',
                    'There was an issue logging out. Please try again.',
                    [{ text: 'OK' }]
                );
            }
        } finally {
            if (mounted) {
                setLoggingOut(false);
            }
        }
    };

    const handleUpdateProfile = async (): Promise<void> => {
        if (!newDisplayName.trim()) {
            Alert.alert('Error', 'Display name cannot be empty');
            return;
        }

        try {
            setUpdating(true);
            await updateUserProfile(newDisplayName.trim());
            if (mounted) {
                setShowEditModal(false);
                Alert.alert('Success', 'Profile updated successfully');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            if (mounted) {
                Alert.alert('Error', 'Failed to update profile');
            }
        } finally {
            if (mounted) {
                setUpdating(false);
            }
        }
    };

    const removeFavorite = async (propertyId: string): Promise<void> => {
        if (!user || !mounted) return;

        Alert.alert(
            'Remove Favorite',
            'Are you sure you want to remove this property from favorites?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await PropertyAPI.toggleFavorite(user.uid, propertyId);
                            if (mounted) {
                                setFavorites(prev => prev.filter(p => p.id !== propertyId));
                            }
                        } catch (error) {
                            if (mounted) {
                                Alert.alert('Error', 'Failed to remove favorite');
                            }
                        }
                    },
                },
            ]
        );
    };

    // Memoize the text input change handler to prevent unnecessary re-renders
    const handleDisplayNameChange = useCallback((text: string) => {
        setNewDisplayName(text);
    }, []);

    // Memoize the modal close handler
    const handleModalClose = useCallback(() => {
        setShowEditModal(false);
    }, []);

    // Memoize the modal open handler


    const renderFavoriteItem = ({ item }: { item: Property }) => (
        <TouchableOpacity
            className="bg-gray-800 rounded-xl mb-4 overflow-hidden"
            onPress={() => router.push(`/properties/${item.id}`)}
        >
            {/* Property Image */}
            <View className="relative">
                <Image
                    source={{ uri: item.images[0] }}
                    className="w-full h-48 bg-gray-700"
                    resizeMode="cover"
                />

                {/* Remove favorite button */}
                <TouchableOpacity
                    className="absolute top-3 right-3 bg-red-500 rounded-full p-2"
                    onPress={() => removeFavorite(item.id)}
                >
                    <Text className="text-white text-sm">✕</Text>
                </TouchableOpacity>

                {/* Property type badge */}
                <View className="absolute top-3 left-3">
                    <View className="bg-primary-500 px-3 py-1 rounded-lg">
                        <Text className="text-white text-xs font-medium capitalize">
                            {item.type}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Property Info */}
            <View className="p-4">
                <Text className="text-primary-400 text-xl font-bold mb-1">
                    {PropertyAPI.formatPrice(item.price)}
                </Text>

                <Text className="text-white text-lg font-semibold mb-2" numberOfLines={1}>
                    {item.title}
                </Text>

                <Text className="text-gray-400 text-sm mb-3" numberOfLines={1}>
                    📍 {item.address}, {item.city}, {item.state}
                </Text>

                {/* Property stats */}
                <View className="flex-row items-center space-x-4">
                    <Text className="text-gray-300 text-sm">
                        🛏️ {item.bedrooms} bed
                    </Text>
                    <Text className="text-gray-300 text-sm">
                        🚿 {item.bathrooms} bath
                    </Text>
                    <Text className="text-gray-300 text-sm">
                        📐 {item.sqft.toLocaleString()} sqft
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const ProfileHeader = useCallback(() => (
        <View className="bg-gray-800 rounded-xl p-6 mb-6">
            <View className="items-center mb-6">
                {/* Avatar */}
                <View className="bg-primary-500 rounded-full w-24 h-24 items-center justify-center mb-4">
                    <Text className="text-white font-bold text-3xl">
                        {(userProfile?.displayName || user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                    </Text>
                </View>

                {/* User Info */}
                <Text className="text-white text-2xl font-bold mb-2">
                    {userProfile?.displayName || user?.displayName || 'User'}
                </Text>
                <Text className="text-gray-400 text-base">
                    {user?.email}
                </Text>
            </View>

            {/* Action Buttons */}
            <View className="space-y-3">
                <TouchableOpacity
                    className="bg-primary-500 rounded-xl py-3 items-center"
                    onPress={handleModalOpen}
                >
                    <Text className="text-white font-semibold text-base">✏️ Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`rounded-xl py-3 items-center ${
                        loggingOut ? 'bg-gray-600' : 'bg-red-500'
                    }`}
                    onPress={handleLogout}
                    disabled={loggingOut}
                    style={{ opacity: loggingOut ? 0.6 : 1 }}
                >
                    <Text className="text-white font-semibold text-base">
                        {loggingOut ? '🔄 Logging out...' : '🚪 Logout'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    ), [userProfile, user, handleModalOpen, handleLogout, loggingOut]);

    const FavoritesSection = useCallback(() => (
        <View className="flex-1">
            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-white text-xl font-bold">My Favorites</Text>
                <View className="bg-primary-500 px-3 py-1 rounded-lg">
                    <Text className="text-white text-sm font-medium">
                        {favorites.length}
                    </Text>
                </View>
            </View>

            {loading && favorites.length === 0 ? (
                <View className="bg-gray-800 rounded-xl p-8 items-center">
                    <Text className="text-gray-400 text-base">Loading favorites...</Text>
                </View>
            ) : favorites.length > 0 ? (
                <FlatList
                    data={favorites}
                    renderItem={renderFavoriteItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#0ea5e9"
                            colors={['#0ea5e9']}
                        />
                    }
                />
            ) : (
                <View className="bg-gray-800 rounded-xl p-8 items-center">
                    <Text className="text-6xl mb-4">❤️</Text>
                    <Text className="text-white text-xl font-semibold mb-2">No Favorites Yet</Text>
                    <Text className="text-gray-400 text-center text-base mb-6">
                        Start exploring properties and add them to your favorites to see them here.
                    </Text>
                    <TouchableOpacity
                        className="bg-primary-500 px-6 py-3 rounded-xl"
                        onPress={() => router.push('/explore')}
                    >
                        <Text className="text-white font-medium">Explore Properties</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    ), [favorites, loading, refreshing, onRefresh, renderFavoriteItem]);

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <ScrollView
                className="flex-1 px-6 pt-6"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#0ea5e9"
                        colors={['#0ea5e9']}
                    />
                }
            >
                <ProfileHeader />
                <FavoritesSection />
            </ScrollView>

            {/* Render modal conditionally to prevent unnecessary re-renders */}
            {showEditModal && (
                <Modal
                    visible={true}
                    transparent
                    animationType="slide"
                    onRequestClose={handleModalClose}
                >
                    <View className="flex-1 bg-black/50 justify-end">
                        <View className="bg-gray-900 rounded-t-3xl p-6">
                            <View className="flex-row items-center justify-between mb-6">
                                <Text className="text-white text-xl font-bold">Edit Profile</Text>
                                <TouchableOpacity
                                    onPress={handleModalClose}
                                    className="bg-gray-800 rounded-full p-2"
                                >
                                    <Text className="text-white text-lg">✕</Text>
                                </TouchableOpacity>
                            </View>

                            <View className="mb-6">
                                <Text className="text-white text-base font-medium mb-2">Display Name</Text>
                                <TextInput
                                    value={newDisplayName}
                                    onChangeText={setNewDisplayName}
                                    placeholder="Enter your display name"
                                    placeholderTextColor="#9ca3af"
                                    className="bg-gray-800 text-white px-4 py-3 rounded-xl text-base"
                                    maxLength={50}
                                />
                            </View>

                            <View className="flex-row space-x-3">
                                <TouchableOpacity
                                    className="flex-1 bg-gray-700 rounded-xl py-3 items-center"
                                    onPress={handleModalClose}
                                >
                                    <Text className="text-white font-medium">Cancel</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className={`flex-1 rounded-xl py-3 items-center ${
                                        updating ? 'bg-gray-600' : 'bg-primary-500'
                                    }`}
                                    onPress={handleUpdateProfile}
                                    disabled={updating}
                                >
                                    <Text className="text-white font-medium">
                                        {updating ? 'Updating...' : 'Save Changes'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );

    // Show loading state while auth is initializing OR component is not mounted
    if (authLoading || !mounted) {
        return (
            <SafeAreaView className="flex-1 bg-gray-900">
                <View className="flex-1 justify-center items-center">
                    <Text className="text-white text-lg">Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Show sign-in prompt if user is not authenticated
    if (!user) {
        return (
            <SafeAreaView className="flex-1 bg-gray-900">
                <View className="flex-1 justify-center items-center px-6">
                    <Text className="text-6xl mb-4">👤</Text>
                    <Text className="text-xl font-semibold text-white mb-2">Not Signed In</Text>
                    <Text className="text-gray-400 text-center mb-6">
                        Please sign in to view your profile and favorites.
                    </Text>
                    <TouchableOpacity
                        className="bg-primary-500 px-6 py-3 rounded-xl"
                        onPress={() => router.replace('/auth/welcome')}
                    >
                        <Text className="text-white font-medium">Sign In</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }


};

export default ProfileScreen;