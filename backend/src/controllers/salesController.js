import * as salesService from '../services/salesService.js';

export const getSales = async (req, res) => {
    try {
        const result = await salesService.getSalesData(req.query);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};