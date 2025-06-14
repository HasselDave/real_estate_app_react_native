import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function ExploreScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 justify-center items-center px-4">
                <Text className="text-2xl font-display font-bold text-gray-800">
                    Profile Screen
                </Text>
                <Text className="text-base text-gray-500 mt-4 text-center">
                    This is your explore page. We'll build this out once the API integration is complete.
                </Text>
            </View>
        </SafeAreaView>
    );
}