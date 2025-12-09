import axios from 'axios';

// Ensure this matches your backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/sales';

export const fetchSales = async (params) => {
    try {
        // Remove empty keys to keep URL clean
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v != null && v !== '')
        );
        
        const response = await axios.get(API_URL, { params: cleanParams });
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};
