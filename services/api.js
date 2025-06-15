// services/api.js

const API_BASE_URL = 'http://localhost:3000/api'; // Change this when you deploy

class PropertyAPI {
    async getAllProperties(filters = {}) {
        try {
            const queryString = new URLSearchParams(
                Object.entries(filters).reduce((acc, [key, value]) => {
                    if (value !== undefined && value !== null) {
                        acc[key] = value.toString();
                    }
                    return acc;
                }, {})
            ).toString();

            const url = `${API_BASE_URL}/properties${queryString ? `?${queryString}` : ''}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching properties:', error);
            throw error;
        }
    }

    async getPropertyById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/properties/${id}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching property:', error);
            throw error;
        }
    }

    async searchProperties(query) {
        try {
            const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error searching properties:', error);
            throw error;
        }
    }

    async getFavorites(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/favorites/${userId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching favorites:', error);
            throw error;
        }
    }

    async toggleFavorite(userId, propertyId) {
        try {
            const response = await fetch(`${API_BASE_URL}/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, propertyId }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error toggling favorite:', error);
            throw error;
        }
    }

    // Helper method to format price
    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    }

    // Helper method to get property type badge color
    getTypeColor(type) {
        const colors = {
            apartment: 'bg-blue-100 text-blue-800',
            house: 'bg-green-100 text-green-800',
            condo: 'bg-purple-100 text-purple-800',
            villa: 'bg-orange-100 text-orange-800',
        };
        return colors[type.toLowerCase()] || 'bg-gray-100 text-gray-800';
    }
}

export default new PropertyAPI();