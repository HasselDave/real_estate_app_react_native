// types/property.js

// Property data structure from Bayut API
export const PropertyTypes = {
    // Main property object structure
    Property: {
        id: 'number',
        externalID: 'string',
        title: 'string',
        description: 'string',
        price: 'number',
        rentFrequency: 'string', // yearly, monthly, weekly, daily
        rooms: 'number',
        baths: 'number',
        area: 'number',
        areaUnit: 'string', // sqft, sqm
        purpose: 'string', // for-rent, for-sale
        furnishingStatus: 'string',
        propertyType: 'string',
        category: 'array', // Array of category objects
        location: 'array', // Array of location objects
        contactName: 'string',
        phoneNumber: 'object',
        photos: 'array', // Array of photo objects
        coverPhoto: 'object',
        panoramas: 'array',
        videos: 'array',
        virtualTours: 'array',
        amenities: 'array',
        facilities: 'array',
        isVerified: 'boolean',
        geography: 'object',
        completionStatus: 'string',
        permitNumber: 'string',
        createdAt: 'string',
        updatedAt: 'string'
    },

    // Photo object structure
    Photo: {
        id: 'number',
        externalID: 'string',
        title: 'string',
        orderIndex: 'number',
        nimaScore: 'number',
        url: 'string'
    },

    // Location object structure
    Location: {
        id: 'number',
        level: 'number',
        externalID: 'string',
        name: 'string',
        slug: 'string',
        namePrimary: 'string',
        nameSecondary: 'string'
    },

    // Agency object structure
    Agency: {
        id: 'number',
        objectID: 'number',
        name: 'string',
        name_l1: 'string',
        name_l2: 'string',
        externalID: 'string',
        product: 'string',
        productScore: 'number',
        licenses: 'array',
        logo: 'object',
        slug: 'string',
        slug_l1: 'string',
        slug_l2: 'string',
        tr: 'number',
        tier: 'number',
        roles: 'array',
        active: 'boolean',
        createdAt: 'string',
        commercialNumber: 'string',
        shortNumber: 'string'
    }
};

// Helper functions for data processing
export const PropertyHelpers = {
    // Format price with currency
    formatPrice: (price, currency = 'AED') => {
        if (!price) return 'Price on request';
        return `${currency} ${price.toLocaleString()}`;
    },

    // Get main photo URL
    getMainPhotoUrl: (property) => {
        if (property.coverPhoto && property.coverPhoto.url) {
            return property.coverPhoto.url;
        }
        if (property.photos && property.photos.length > 0) {
            return property.photos[0].url;
        }
        return null;
    },

    // Get property location string
    getLocationString: (property) => {
        if (!property.location || property.location.length === 0) {
            return 'Location not specified';
        }

        // Get the most specific location (highest level)
        const sortedLocations = property.location.sort((a, b) => b.level - a.level);
        return sortedLocations.slice(0, 2).map(loc => loc.name).join(', ');
    },

    // Format area with unit
    formatArea: (area, unit = 'sqft') => {
        if (!area) return '';
        return `${area.toLocaleString()} ${unit}`;
    },

    // Get property type display name
    getPropertyTypeDisplay: (property) => {
        if (property.category && property.category.length > 0) {
            return property.category[0].name;
        }
        return property.propertyType || 'Property';
    },

    // Check if property has virtual tour
    hasVirtualTour: (property) => {
        return property.virtualTours && property.virtualTours.length > 0;
    },

    // Get contact phone number
    getContactPhone: (property) => {
        if (property.phoneNumber && property.phoneNumber.phone) {
            return property.phoneNumber.phone;
        }
        return null;
    },

    // Filter properties by criteria
    filterProperties: (properties, filters) => {
        return properties.filter(property => {
            // Price filter
            if (filters.minPrice && property.price < filters.minPrice) return false;
            if (filters.maxPrice && property.price > filters.maxPrice) return false;

            // Rooms filter
            if (filters.rooms && property.rooms < filters.rooms) return false;

            // Baths filter
            if (filters.baths && property.baths < filters.baths) return false;

            // Property type filter
            if (filters.propertyType && property.propertyType !== filters.propertyType) return false;

            // Purpose filter (rent/sale)
            if (filters.purpose && property.purpose !== filters.purpose) return false;

            return true;
        });
    },

    // Sort properties by criteria
    sortProperties: (properties, sortBy = 'date-desc') => {
        const sorted = [...properties];

        switch (sortBy) {
            case 'price-asc':
                return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
            case 'price-desc':
                return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
            case 'date-desc':
                return sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            case 'date-asc':
                return sorted.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
            case 'area-desc':
                return sorted.sort((a, b) => (b.area || 0) - (a.area || 0));
            case 'area-asc':
                return sorted.sort((a, b) => (a.area || 0) - (b.area || 0));
            default:
                return sorted;
        }
    }
};