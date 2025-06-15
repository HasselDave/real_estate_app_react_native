// screens/ExploreScreen.js
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Image,
    TextInput,
    Alert,
    RefreshControl,
    Modal,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropertyAPI from '../../services/api';
import {router} from "expo-router";

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

interface ExploreScreenProps {
    navigation: any;
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedCity, setSelectedCity] = useState<string>('all');
    const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
    const [screenWidth, setScreenWidth] = useState(width);

    // Filter states
    const [minBedrooms, setMinBedrooms] = useState<number>(0);
    const [minBathrooms, setMinBathrooms] = useState<number>(0);
    const [sizeFilter, setSizeFilter] = useState<string>('all'); // 'all', 'under1500', 'above1500'

    // Property types
    const propertyTypes = [
        { id: 'all', name: 'All', icon: '🏠' },
        { id: 'house', name: 'House', icon: '🏘️' },
        { id: 'apartment', name: 'Apartment', icon: '🏢' },
        { id: 'condo', name: 'Condo', icon: '🏬' },
        { id: 'villa', name: 'Villa', icon: '🏛️' },
    ];

    // Cities (extracted from your API data)
    const cities = [
        { id: 'all', name: 'All Cities' },
        { id: 'New York', name: 'New York' },
        { id: 'Austin', name: 'Austin' },
        { id: 'Miami', name: 'Miami' },
        { id: 'Portland', name: 'Portland' },
        { id: 'San Francisco', name: 'San Francisco' },
        { id: 'Denver', name: 'Denver' },
        { id: 'Chicago', name: 'Chicago' },
        { id: 'Nashville', name: 'Nashville' },
        { id: 'Seattle', name: 'Seattle' },
        { id: 'San Diego', name: 'San Diego' },
    ];

    // Calculate responsive columns and card width
    const getNumColumns = (screenWidth: number) => {
        if (screenWidth < 400) return 1; // Small phones
        if (screenWidth < 600) return 2; // Regular phones
        if (screenWidth < 900) return 3; // Large phones/small tablets
        return 4; // Tablets and larger
    };

    const getCardWidth = (screenWidth: number, numColumns: number) => {
        const padding = 32; // Total horizontal padding (16px on each side)
        const spacing = (numColumns - 1) * 12; // Spacing between cards
        return (screenWidth - padding - spacing) / numColumns;
    };

    // Calculate responsive property type button width
    const getPropertyTypeButtonWidth = (screenWidth: number) => {
        if (screenWidth < 400) return 70; // Very small phones
        if (screenWidth < 600) return 80; // Regular phones
        if (screenWidth < 900) return 90; // Large phones/small tablets
        return 100; // Tablets and larger
    };

    const getPropertyTypeSpacing = (screenWidth: number) => {
        if (screenWidth < 400) return 2; // Very small phones
        if (screenWidth < 600) return 3; // Regular phones
        return 3; // Default spacing
    };

    const numColumns = getNumColumns(screenWidth);
    const cardWidth = getCardWidth(screenWidth, numColumns);
    const propertyTypeButtonWidth = getPropertyTypeButtonWidth(screenWidth);
    const propertyTypeSpacing = getPropertyTypeSpacing(screenWidth);

    useEffect(() => {
        loadProperties();

        // Listen for orientation changes
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenWidth(window.width);
        });

        return () => subscription?.remove();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [properties, searchQuery, selectedType, selectedCity, minBedrooms, minBathrooms, sizeFilter]);

    const loadProperties = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await PropertyAPI.getAllProperties();

            if (response.success) {
                setProperties(response.data);
                setFilteredProperties(response.data);
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

    const applyFilters = (): void => {
        let filtered = [...properties];

        // Search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(property =>
                property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.state.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Type filter
        if (selectedType !== 'all') {
            filtered = filtered.filter(property => property.type === selectedType);
        }

        // City filter
        if (selectedCity !== 'all') {
            filtered = filtered.filter(property => property.city === selectedCity);
        }

        // Bedroom filter
        if (minBedrooms > 0) {
            filtered = filtered.filter(property => property.bedrooms >= minBedrooms);
        }

        // Bathroom filter
        if (minBathrooms > 0) {
            filtered = filtered.filter(property => property.bathrooms >= minBathrooms);
        }

        // Size filter
        if (sizeFilter === 'under1500') {
            filtered = filtered.filter(property => property.sqft < 1500);
        } else if (sizeFilter === 'above1500') {
            filtered = filtered.filter(property => property.sqft >= 1500);
        }

        setFilteredProperties(filtered);
    };

    const resetFilters = (): void => {
        setSelectedType('all');
        setSelectedCity('all');
        setMinBedrooms(0);
        setMinBathrooms(0);
        setSizeFilter('all');
        setSearchQuery('');
        setShowFilterModal(false);
    };

    const PropertyCard: React.FC<{ item: Property }> = ({ item }) => (
        <TouchableOpacity
            className="bg-gray-800 rounded-xl overflow-hidden mb-3"
            style={{ width: cardWidth }}
            onPress={() => { router.push(`/properties/${item.id}`);}}
        >
            <View className="relative">
                <Image
                    source={{ uri: item.images[0] }}
                    className="w-full h-32 bg-gray-700"
                    resizeMode="cover"
                />
                <View className="absolute top-2 left-2">
                    <View className="bg-primary-500 px-2 py-1 rounded-md">
                        <Text className="text-white text-xs font-medium capitalize">{item.type}</Text>
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
                <Text className="text-gray-400 text-xs mt-1 mb-2">
                    📍 {item.city}, {item.state}
                </Text>

                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center space-x-3">
                        <Text className="text-gray-300 text-xs">🛏️ {item.bedrooms}</Text>
                        <Text className="text-gray-300 text-xs">🚿 {item.bathrooms}</Text>
                    </View>
                    <Text className="text-gray-400 text-xs">{item.sqft} sqft</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const FilterModal = () => (
        <Modal
            visible={showFilterModal}
            animationType="slide"
            transparent={true}
        >
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-gray-800 rounded-t-3xl p-6">
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-white text-xl font-bold">Filters</Text>
                        <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                            <Text className="text-gray-400 text-lg">✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Bedrooms */}
                        <View className="mb-6">
                            <Text className="text-white text-lg font-semibold mb-3">Minimum Bedrooms</Text>
                            <View className="flex-row flex-wrap">
                                {[0, 1, 2, 3, 4, 5].map((num) => (
                                    <TouchableOpacity
                                        key={num}
                                        className={`px-4 py-2 rounded-xl mr-2 mb-2 ${
                                            minBedrooms === num ? 'bg-primary-500' : 'bg-gray-700'
                                        }`}
                                        onPress={() => setMinBedrooms(num)}
                                    >
                                        <Text className="text-white font-medium">
                                            {num === 0 ? 'Any' : `${num}+`}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Bathrooms */}
                        <View className="mb-6">
                            <Text className="text-white text-lg font-semibold mb-3">Minimum Bathrooms</Text>
                            <View className="flex-row flex-wrap">
                                {[0, 1, 2, 3, 4].map((num) => (
                                    <TouchableOpacity
                                        key={num}
                                        className={`px-4 py-2 rounded-xl mr-2 mb-2 ${
                                            minBathrooms === num ? 'bg-primary-500' : 'bg-gray-700'
                                        }`}
                                        onPress={() => setMinBathrooms(num)}
                                    >
                                        <Text className="text-white font-medium">
                                            {num === 0 ? 'Any' : `${num}+`}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Size Filter */}
                        <View className="mb-6">
                            <Text className="text-white text-lg font-semibold mb-3">Property Size</Text>
                            <View className="flex-row flex-wrap">
                                {[
                                    { id: 'all', label: 'Any Size' },
                                    { id: 'under1500', label: 'Under 1,500 sqft' },
                                    { id: 'above1500', label: '1,500+ sqft' },
                                ].map((size) => (
                                    <TouchableOpacity
                                        key={size.id}
                                        className={`px-4 py-2 rounded-xl mr-2 mb-2 ${
                                            sizeFilter === size.id ? 'bg-primary-500' : 'bg-gray-700'
                                        }`}
                                        onPress={() => setSizeFilter(size.id)}
                                    >
                                        <Text className="text-white font-medium">{size.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row space-x-3 mt-4">
                            <TouchableOpacity
                                className="flex-1 bg-gray-700 py-3 rounded-xl"
                                onPress={resetFilters}
                            >
                                <Text className="text-white text-center font-medium">Reset</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 bg-primary-500 py-3 rounded-xl"
                                onPress={() => setShowFilterModal(false)}
                            >
                                <Text className="text-white text-center font-medium">Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
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
            <View className="flex-1">
                {/* Header with Search */}
                <View className="px-6 pt-4 pb-2">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-white text-2xl font-bold">Explore</Text>
                        <TouchableOpacity
                            className="bg-gray-800 rounded-full p-3"
                            onPress={() => setShowFilterModal(true)}
                        >
                            <Text className="text-white text-lg">⚙️</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Search Bar */}
                    <View className="bg-gray-800 rounded-2xl px-4 py-3 mb-4">
                        <TextInput
                            className="text-white text-base"
                            placeholder="Search properties..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Property Types */}
                <View className="px-6 mb-4">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {propertyTypes.map((type, index) => (
                            <TouchableOpacity
                                key={type.id}
                                className={`px-3 py-2 rounded-2xl ${
                                    selectedType === type.id ? 'bg-primary-500' : 'bg-gray-800'
                                }`}
                                style={{
                                    width: propertyTypeButtonWidth,
                                    marginRight: index < propertyTypes.length - 1 ? propertyTypeSpacing * 4 : 0
                                }}
                                onPress={() => setSelectedType(type.id)}
                            >
                                <View className="items-center">
                                    <Text
                                        className="mb-1"
                                        style={{
                                            fontSize: screenWidth < 400 ? 18 : screenWidth < 600 ? 20 : 24
                                        }}
                                    >
                                        {type.icon}
                                    </Text>
                                    <Text
                                        className="text-white font-medium text-center"
                                        style={{
                                            fontSize: screenWidth < 400 ? 10 : screenWidth < 600 ? 12 : 14
                                        }}
                                        numberOfLines={1}
                                    >
                                        {type.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Cities */}
                <View className="px-6 mb-4">
                    <Text className="text-white text-lg font-semibold mb-3">Cities</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {cities.map((city) => (
                            <TouchableOpacity
                                key={city.id}
                                className={`mr-3 px-4 py-2 rounded-xl ${
                                    selectedCity === city.id ? 'bg-primary-500' : 'bg-gray-800'
                                }`}
                                onPress={() => setSelectedCity(city.id)}
                            >
                                <Text className="text-white text-sm font-medium">{city.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Results Count */}
                <View className="px-6 mb-4">
                    <Text className="text-gray-400 text-sm">
                        {filteredProperties.length} properties found
                    </Text>
                </View>

                {/* Properties Grid */}
                <FlatList
                    data={filteredProperties}
                    renderItem={({ item }) => <PropertyCard item={item} />}
                    keyExtractor={(item) => item.id}
                    key={numColumns} // Force re-render when columns change
                    numColumns={numColumns}
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingBottom: 20,
                        justifyContent: 'space-between'
                    }}
                    columnWrapperStyle={numColumns > 1 ? { justifyContent: 'space-between' } : null}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor="#ffffff"
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center py-20">
                            <Text className="text-6xl mb-4">🔍</Text>
                            <Text className="text-xl font-semibold text-white mb-2">No Properties Found</Text>
                            <Text className="text-gray-400 text-center px-8 mb-6">
                                Try adjusting your search criteria or filters
                            </Text>
                            <TouchableOpacity
                                className="bg-primary-500 px-6 py-3 rounded-xl"
                                onPress={resetFilters}
                            >
                                <Text className="text-white font-medium">Reset Filters</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />

                <FilterModal />
            </View>
        </SafeAreaView>
    );
};

export default ExploreScreen;