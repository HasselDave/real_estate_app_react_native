import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'google';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: keyof typeof Ionicons.glyphMap;
    fullWidth?: boolean;
}

export default function Button({
                                   title,
                                   onPress,
                                   variant = 'primary',
                                   size = 'medium',
                                   disabled = false,
                                   loading = false,
                                   icon,
                                   fullWidth = true,
                               }: ButtonProps) {
    const getButtonStyles = () => {
        const baseStyles = 'rounded-xl flex-row items-center justify-center';
        const sizeStyles = {
            small: 'px-4 py-2',
            medium: 'px-6 py-3',
            large: 'px-8 py-4',
        };

        const variantStyles = {
            primary: 'bg-primary-500',
            secondary: 'bg-secondary-500',
            outline: 'border-2 border-primary-500 bg-transparent',
            google: 'bg-white border border-gray-200',
        };

        const widthStyle = fullWidth ? 'w-full' : '';
        const disabledStyle = disabled ? 'opacity-50' : '';

        return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${disabledStyle}`;
    };

    const getTextStyles = () => {
        const baseStyles = 'font-semibold';
        const sizeStyles = {
            small: 'text-sm',
            medium: 'text-base',
            large: 'text-lg',
        };

        const variantStyles = {
            primary: 'text-white',
            secondary: 'text-white',
            outline: 'text-primary-500',
            google: 'text-gray-700',
        };

        return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`;
    };

    return (
        <TouchableOpacity
            className={getButtonStyles()}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'primary' || variant === 'secondary' ? 'white' : '#0ea5e9'}
                    size="small"
                />
            ) : (
                <View className="flex-row items-center justify-center">
                    {icon && (
                        <Ionicons
                            name={icon}
                            size={size === 'large' ? 24 : size === 'small' ? 16 : 20}
                            color={
                                variant === 'primary' || variant === 'secondary'
                                    ? 'white'
                                    : variant === 'google'
                                        ? '#4285f4'
                                        : '#0ea5e9'
                            }
                            style={{ marginRight: title ? 8 : 0 }}
                        />
                    )}
                    <Text className={getTextStyles()}>{title}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}