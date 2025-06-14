import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function TabLayout() {
    return (
        <>
            <StatusBar style="dark" />
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: '#0ea5e9', // primary-500
                    tabBarInactiveTintColor: '#9ca3af', // gray-400
                    tabBarStyle: {
                        backgroundColor: '#ffffff',
                        borderTopWidth: 0, // Remove top border
                        paddingBottom: 8,
                        paddingTop: 8,
                        paddingHorizontal: 16,
                        height: 70,
                        borderRadius: 25, // Add rounded corners
                        marginHorizontal: 16, // Add margin from screen edges
                        marginBottom: 10, // Add bottom margin
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: -2,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 5, // For Android shadow
                        position: 'absolute', // Make it float above content
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '500',
                        marginTop: 4,
                    },
                    tabBarIconStyle: {
                        marginBottom: 2,
                    },
                    headerShown: false,
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <Feather name="home" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="explore"
                    options={{
                        title: 'Explore',
                        tabBarIcon: ({ color, size }) => (
                            <Feather name="search" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({ color, size }) => (
                            <Feather name="user" size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </>
    );
}