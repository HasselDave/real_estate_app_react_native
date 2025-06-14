// services/bayutApi.js

const API_BASE_URL = 'https://bayut.p.rapidapi.com';
const API_KEY = '3196d06cdbmshe62a717e7af53a5p19ea0cjsnf17c7869050f';

const headers = {
    'X-RapidAPI-Host': 'bayut.p.rapidapi.com',
    'X-RapidAPI-Key': API_KEY,
};

// Mock data for fallback when API fails
const mockProperties = [
    {
        id: 1,
        externalID: "mock-1",
        title: "Luxury 2BR Apartment in Dubai Marina",
        description: "Beautiful waterfront apartment with stunning views",
        price: 85000,
        rentFrequency: "yearly",
        rooms: 2,
        baths: 2,
        area: 1200,
        areaUnit: "sqft",
        purpose: "for-rent",
        propertyType: "apartment",
        location: [
            { id: 1, level: 1, externalID: "5002", name: "Dubai Marina", slug: "dubai-marina" },
            { id: 2, level: 2, externalID: "6020", name: "Dubai", slug: "dubai" }
        ],
        photos: [
            { id: 1, url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop" }
        ],
        coverPhoto: {
            id: 1,
            url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"
        },
        isVerified: true,
        updatedAt: new Date().toISOString()
    },
    {
        id: 2,
        externalID: "mock-2",
        title: "Modern 1BR Studio in Business Bay",
        description: "Contemporary studio apartment in prime location",
        price: 65000,
        rentFrequency: "yearly",
        rooms: 1,
        baths: 1,
        area: 800,
        areaUnit: "sqft",
        purpose: "for-rent",
        propertyType: "apartment",
        location: [
            { id: 3, level: 1, externalID: "5003", name: "Business Bay", slug: "business-bay" },
            { id: 2, level: 2, externalID: "6020", name: "Dubai", slug: "dubai" }
        ],
        photos: [
            { id: 2, url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop" }
        ],
        coverPhoto: {
            id: 2,
            url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
        },
        isVerified: true,
        updatedAt: new Date().toISOString()
    },
    {
        id: 3,
        externalID: "mock-3",
        title: "Spacious 3BR Villa in Jumeirah",
        description: "Family villa with private garden and pool",
        price: 180000,
        rentFrequency: "yearly",
        rooms: 3,
        baths: 3,
        area: 2500,
        areaUnit: "sqft",
        purpose: "for-rent",
        propertyType: "villa",
        location: [
            { id: 4, level: 1, externalID: "5004", name: "Jumeirah", slug: "jumeirah" },
            { id: 2, level: 2, externalID: "6020", name: "Dubai", slug: "dubai" }
        ],
        photos: [
            { id: 3, url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop" }
        ],
        coverPhoto: {
            id: 3,
            url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
        },
        isVerified: true,
        updatedAt: new Date().toISOString()
    },
    {
        id: 4,
        externalID: "mock-4",
        title: "Penthouse Apartment in Downtown",
        description: "Luxury penthouse with panoramic city views",
        price: 250000,
        rentFrequency: "yearly",
        rooms: 4,
        baths: 4,
        area: 3000,
        areaUnit: "sqft",
        purpose: "for-rent",
        propertyType: "penthouse",
        location: [
            { id: 5, level: 1, externalID: "5005", name: "Downtown Dubai", slug: "downtown-dubai" },
            { id: 2, level: 2, externalID: "6020", name: "Dubai", slug: "dubai" }
        ],
        photos: [
            { id: 4, url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop" }
        ],
        coverPhoto: {
            id: 4,
            url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop"
        },
        isVerified: true,
        updatedAt: new Date().toISOString()
    },
    {
        id: 5,
        externalID: "mock-5",
        title: "Cozy 1BR Apartment in JLT",
        description: "Affordable apartment in Jumeirah Lake Towers",
        price: 55000,
        rentFrequency: "yearly",
        rooms: 1,
        baths: 1,
        area: 700,
        areaUnit: "sqft",
        purpose: "for-rent",
        propertyType: "apartment",
        location: [
            { id: 6, level: 1, externalID: "5006", name: "Jumeirah Lake Towers", slug: "jlt" },
            { id: 2, level: 2, externalID: "6020", name: "Dubai", slug: "dubai" }
        ],
        photos: [
            { id: 5, url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop" }
        ],
        coverPhoto: {
            id: 5,
            url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"
        },
        isVerified: true,
        updatedAt: new Date().toISOString()
    },
    {
        id: 6,
        externalID: "mock-6",
        title: "Luxury 2BR in Palm Jumeirah",
        description: "Beachfront apartment with private beach access",
        price: 120000,
        rentFrequency: "yearly",
        rooms: 2,
        baths: 2,
        area: 1500,
        areaUnit: "sqft",
        purpose: "for-rent",
        propertyType: "apartment",
        location: [
            { id: 7, level: 1, externalID: "5007", name: "Palm Jumeirah", slug: "palm-jumeirah" },
            { id: 2, level: 2, externalID: "6020", name: "Dubai", slug: "dubai" }
        ],
        photos: [
            { id: 6, url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop" }
        ],
        coverPhoto: {
            id: 6,
            url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop"
        },
        isVerified: true,
        updatedAt: new Date().toISOString()
    }
];

class BayutApiService {
    // Helper method to create mock response
    static createMockResponse(properties, total = null) {
        return {
            hits: properties,
            nbHits: total || properties.length,
            page: 1,
            nbPages: 1,
            processingTimeMS: 1
        };
    }

    // Helper method to handle API calls with fallback
    static async makeApiCall(url, useMockFallback = true) {
        try {
            console.log(`Making API call to: ${url}`);

            const response = await fetch(url, { headers });

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error(`Rate limit exceeded. Using demo data instead.`);
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API call successful:', data);
            return data;

        } catch (error) {
            console.warn('API call failed:', error.message);

            if (useMockFallback) {
                console.log('Using mock data as fallback');
                return null; // Will trigger mock data usage
            }

            throw error;
        }
    }

    // Get properties for rent
    static async getPropertiesForRent(locationExternalIDs = '5002,6020', page = 1, limit = 20) {
        try {
            const url = `${API_BASE_URL}/properties/list?locationExternalIDs=${locationExternalIDs}&purpose=for-rent&page=${page}&hitsPerPage=${limit}&lang=en`;
            const data = await this.makeApiCall(url);

            if (!data) {
                // Return mock data
                const mockData = mockProperties.filter(p => p.purpose === 'for-rent').slice(0, limit);
                return this.createMockResponse(mockData);
            }

            return data;
        } catch (error) {
            console.error('Error fetching properties for rent:', error);
            throw error;
        }
    }

    // Get properties for sale
    static async getPropertiesForSale(locationExternalIDs = '5002,6020', page = 1, limit = 20) {
        try {
            const url = `${API_BASE_URL}/properties/list?locationExternalIDs=${locationExternalIDs}&purpose=for-sale&page=${page}&hitsPerPage=${limit}&lang=en`;
            const data = await this.makeApiCall(url);

            if (!data) {
                // Return mock data modified for sale
                const mockData = mockProperties.map(p => ({
                    ...p,
                    purpose: 'for-sale',
                    price: p.price * 15, // Convert rent to sale price (approximate)
                    rentFrequency: null
                })).slice(0, limit);
                return this.createMockResponse(mockData);
            }

            return data;
        } catch (error) {
            console.error('Error fetching properties for sale:', error);
            throw error;
        }
    }

    // Get featured properties (most recent)
    static async getFeaturedProperties(limit = 10) {
        try {
            const url = `${API_BASE_URL}/properties/list?locationExternalIDs=5002,6020&purpose=for-rent&hitsPerPage=${limit}&sort=date-desc&lang=en`;
            const data = await this.makeApiCall(url);

            if (!data) {
                // Return mock featured properties
                const featuredMock = mockProperties.slice(0, limit);
                return this.createMockResponse(featuredMock);
            }

            return data;
        } catch (error) {
            console.error('Error fetching featured properties:', error);
            // Always return mock data for featured properties to ensure UI works
            const featuredMock = mockProperties.slice(0, limit);
            return this.createMockResponse(featuredMock);
        }
    }

    // Get recommended properties (highest rated/most viewed)
    static async getRecommendedProperties(limit = 10) {
        try {
            const url = `${API_BASE_URL}/properties/list?locationExternalIDs=5002,6020&purpose=for-rent&hitsPerPage=${limit}&sort=popularity&lang=en`;
            const data = await this.makeApiCall(url);

            if (!data) {
                // Return mock recommended properties (different set)
                const recommendedMock = mockProperties.slice(2, 2 + limit);
                return this.createMockResponse(recommendedMock);
            }

            return data;
        } catch (error) {
            console.error('Error fetching recommended properties:', error);
            // Always return mock data for recommended properties to ensure UI works
            const recommendedMock = mockProperties.slice(2, 2 + limit);
            return this.createMockResponse(recommendedMock);
        }
    }

    // Get property details by ID
    static async getPropertyDetails(propertyId) {
        try {
            const url = `${API_BASE_URL}/properties/detail?externalID=${propertyId}&lang=en`;
            const data = await this.makeApiCall(url);

            if (!data) {
                // Return mock property details
                const mockProperty = mockProperties.find(p => p.externalID === propertyId) || mockProperties[0];
                return mockProperty;
            }

            return data;
        } catch (error) {
            console.error('Error fetching property details:', error);
            // Return mock property details
            const mockProperty = mockProperties.find(p => p.externalID === propertyId) || mockProperties[0];
            return mockProperty;
        }
    }

    // Search properties with filters
    static async searchProperties(filters = {}) {
        const {
            locationExternalIDs = '5002,6020',
            purpose = 'for-rent',
            minPrice,
            maxPrice,
            roomsMin,
            roomsMax,
            bathsMin,
            bathsMax,
            areaMin,
            areaMax,
            categoryExternalID,
            page = 1,
            limit = 20,
            sort = 'date-desc'
        } = filters;

        let queryParams = [
            `locationExternalIDs=${locationExternalIDs}`,
            `purpose=${purpose}`,
            `page=${page}`,
            `hitsPerPage=${limit}`,
            `sort=${sort}`,
            `lang=en`
        ];

        // Add optional filters
        if (minPrice) queryParams.push(`priceMin=${minPrice}`);
        if (maxPrice) queryParams.push(`priceMax=${maxPrice}`);
        if (roomsMin) queryParams.push(`roomsMin=${roomsMin}`);
        if (roomsMax) queryParams.push(`roomsMax=${roomsMax}`);
        if (bathsMin) queryParams.push(`bathsMin=${bathsMin}`);
        if (bathsMax) queryParams.push(`bathsMax=${bathsMax}`);
        if (areaMin) queryParams.push(`areaMin=${areaMin}`);
        if (areaMax) queryParams.push(`areaMax=${areaMax}`);
        if (categoryExternalID) queryParams.push(`categoryExternalID=${categoryExternalID}`);

        try {
            const url = `${API_BASE_URL}/properties/list?${queryParams.join('&')}`;
            const data = await this.makeApiCall(url);

            if (!data) {
                // Filter mock data based on search criteria
                let filteredMock = [...mockProperties];

                if (minPrice) filteredMock = filteredMock.filter(p => p.price >= minPrice);
                if (maxPrice) filteredMock = filteredMock.filter(p => p.price <= maxPrice);
                if (roomsMin) filteredMock = filteredMock.filter(p => p.rooms >= roomsMin);
                if (roomsMax) filteredMock = filteredMock.filter(p => p.rooms <= roomsMax);
                if (bathsMin) filteredMock = filteredMock.filter(p => p.baths >= bathsMin);
                if (bathsMax) filteredMock = filteredMock.filter(p => p.baths <= bathsMax);

                return this.createMockResponse(filteredMock.slice(0, limit));
            }

            return data;
        } catch (error) {
            console.error('Error searching properties:', error);
            throw error;
        }
    }

    // Get locations for search autocomplete
    static async getLocations(query) {
        try {
            const url = `${API_BASE_URL}/auto-complete?query=${encodeURIComponent(query)}&lang=en`;
            const data = await this.makeApiCall(url, false); // Don't use mock for autocomplete

            if (!data) {
                // Return mock locations
                const mockLocations = [
                    { id: 1, name: "Dubai Marina", externalID: "5002" },
                    { id: 2, name: "Business Bay", externalID: "5003" },
                    { id: 3, name: "Downtown Dubai", externalID: "5005" },
                    { id: 4, name: "Jumeirah", externalID: "5004" },
                    { id: 5, name: "Palm Jumeirah", externalID: "5007" }
                ];

                return {
                    hits: mockLocations.filter(loc =>
                        loc.name.toLowerCase().includes(query.toLowerCase())
                    )
                };
            }

            return data;
        } catch (error) {
            console.error('Error fetching locations:', error);
            throw error;
        }
    }
}

export default BayutApiService;