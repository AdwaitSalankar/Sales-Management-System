import Sale from '../models/Sale.js';

export const getSalesData = async (query) => {
    try {
        const { 
            search, page = 1, limit = 10, sortBy = 'sale.date', order = 'desc', 
            gender, region, category, paymentMethod, tags, minAge, maxAge, startDate, endDate
        } = query;

        const dbQuery = {};

        // 1. Build Query (Same as before)
        if (search) {
            dbQuery.$or = [
                { 'customer.name': { $regex: search, $options: 'i' } },
                { 'customer.phone': { $regex: search, $options: 'i' } }
            ];
        }

        if (gender) dbQuery['customer.gender'] = { $in: gender.split(',') };
        if (region) dbQuery['customer.region'] = { $in: region.split(',') };
        if (category) dbQuery['product.category'] = { $in: category.split(',') };
        if (paymentMethod) dbQuery['operational.paymentMethod'] = { $in: paymentMethod.split(',') };
        if (tags) dbQuery['product.tags'] = { $in: tags.split(',') };

        if (minAge || maxAge) {
            dbQuery['customer.age'] = {};
            if (minAge) dbQuery['customer.age'].$gte = Number(minAge);
            if (maxAge) dbQuery['customer.age'].$lte = Number(maxAge);
        }

        if (startDate || endDate) {
            dbQuery['sale.date'] = {};
            if (startDate) dbQuery['sale.date'].$gte = new Date(startDate);
            if (endDate) dbQuery['sale.date'].$lte = new Date(endDate);
        }

        // 2. Execution: Run Query + Count + Stats Aggregation in Parallel
        const pageNum = Math.max(1, Number(page));
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;
        const sortOptions = { [sortBy]: order === 'asc' ? 1 : -1 };

        const [sales, total, statsResult] = await Promise.all([
            // A. Get Page Data
            Sale.find(dbQuery).sort(sortOptions).skip(skip).limit(limitNum),
            
            // B. Get Total Count (for pagination)
            Sale.countDocuments(dbQuery),

            // C. Get Dynamic Stats (Aggregation)
            Sale.aggregate([
                { $match: dbQuery }, // Apply same filters
                { $group: {
                    _id: null,
                    totalUnits: { $sum: "$sale.quantity" },
                    totalAmount: { $sum: "$sale.totalAmount" },
                    totalFinal: { $sum: "$sale.finalAmount" } // Used to calc discount
                }}
            ])
        ]);

        // Process Stats
        const stats = statsResult[0] || { totalUnits: 0, totalAmount: 0, totalFinal: 0 };
        const totalDiscount = stats.totalAmount - stats.totalFinal;

        return {
            data: sales,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            },
            stats: {
                totalUnits: stats.totalUnits,
                totalAmount: stats.totalAmount,
                totalDiscount: totalDiscount
            }
        };

    } catch (error) {
        throw new Error('Error fetching sales data: ' + error.message);
    }
};