import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps {
    label?: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    error?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    disabled?: boolean;
}

export default function Input({
                                  label,
                                  placeholder,
                                  value,
                                  onChangeText,
                                  secureTextEntry = false,
                                  keyboardType = 'default',
                                  error,
                                  icon,
                                  disabled = false,
                              }: InputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const inputStyles = `
    flex-1 text-base text-gray-900 py-4 px-4
    ${icon ? 'pl-12' : 'pl-4'}
    ${secureTextEntry ? 'pr-12' : 'pr-4'}
  `;

    const containerStyles = `
    border rounded-xl bg-gray-50
    ${isFocused ? 'border-primary-500 bg-white' : 'border-gray-200'}
    ${error ? 'border-red-500' : ''}
    ${disabled ? 'opacity-50' : ''}
  `;

    return (
        <View className="mb-4">
            {label && (
                <Text className="text-sm font-medium text-white mb-2">{label}</Text>
            )}

            <View className={containerStyles}>
                <View className="flex-row items-center">
                    {icon && (
                        <View className="absolute left-4 z-10">
                            <Ionicons
                                name={icon}
                                size={20}
                                color={isFocused ? '#0ea5e9' : '#9ca3af'}
                            />
                        </View>
                    )}

                    <TextInput
                        className={inputStyles}
                        placeholder={placeholder}
                        placeholderTextColor="#9ca3af"
                        value={value}
                        onChangeText={onChangeText}
                        secureTextEntry={secureTextEntry && !showPassword}
                        keyboardType={keyboardType}
                        autoCapitalize="none"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        editable={!disabled}
                    />

                    {secureTextEntry && (
                        <TouchableOpacity
                            className="absolute right-4"
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color="#9ca3af"
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {error && (
                <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text>
            )}
        </View>
    );
}