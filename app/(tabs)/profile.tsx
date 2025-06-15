// app/(tabs)/profile.tsx
import React, { useState, useEffect } from 'react';
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
import { router } from 'expo-router';
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
    const { user, userProfile, logout, updateUserProfile } = useAuth();
    const [favorites, setFavorites] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [newDisplayName, setNewDisplayName] = useState<string>('');
    const [updating, setUpdating] = useState<boolean>(false);
    const [loggingOut, setLoggingOut] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            loadFavorites();
            setNewDisplayName(userProfile?.displayName || user.displayName || '');
        }
    }, [user, userProfile]);

    const loadFavorites = async (): Promise<void> => {
        if (!user) return;

        try {
            setLoading(true);
            const response = await PropertyAPI.getFavorites(user.uid);
            if (response.success) {
                setFavorites(response.data);
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
            Alert.alert('Error', 'Failed to load favorites');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async (): Promise<void> => {
        setRefreshing(true);
        await loadFavorites();
        setRefreshing(false);
    };

    const handleLogout = (): void => {
        Alert.alert(
            'Confirm Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoggingOut(true);
                            console.log('Logout button pressed, calling logout...');

                            await logout();

                            console.log('Logout completed, navigating to welcome...');

                            // Use router.push instead of router.replace for better navigation
                            router.push('/auth/welcome');

                        } catch (error) {
                            console.error('Logout error:', error);
                            Alert.alert('Error', 'Failed to logout. Please try again.');
                        } finally {
                            setLoggingOut(false);
                        }
                    },
                },
            ]
        );
    };

    const handleUpdateProfile = async (): Promise<void> => {
        if (!newDisplayName.trim()) {
            Alert.alert('Error', 'Display name cannot be empty');
            return;
        }

        try {
            setUpdating(true);
            await updateUserProfile(newDisplayName.trim());
            setShowEditModal(false);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    const removeFavorite = async (propertyId: string): Promise<void> => {
        if (!user) return;

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
                            setFavorites(prev => prev.filter(p => p.id !== propertyId));
                        } catch (error) {
                            Alert.alert('Error', 'Failed to remove favorite');
                        }
                    },
                },
            ]
        );
    };

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

    const ProfileHeader: React.FC = () => (
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
                    onPress={() => setShowEditModal(true)}
                >
                    <Text className="text-white font-semibold text-base">✏️ Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`rounded-xl py-3 items-center ${
                        loggingOut ? 'bg-gray-600' : 'bg-red-500'
                    }`}
                    onPress={handleLogout}
                    disabled={loggingOut}
                >
                    <Text className="text-white font-semibold text-base">
                        {loggingOut ? '🔄 Logging out...' : '🚪 Logout'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const FavoritesSection: React.FC = () => (
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
    );

    const EditProfileModal: React.FC = () => (
        <Modal
            visible={showEditModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowEditModal(false)}
        >
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-gray-900 rounded-t-3xl p-6">
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-white text-xl font-bold">Edit Profile</Text>
                        <TouchableOpacity
                            onPress={() => setShowEditModal(false)}
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
                            onPress={() => setShowEditModal(false)}
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
    );

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

            <EditProfileModal />
        </SafeAreaView>
    );
};

export default ProfileScreen;