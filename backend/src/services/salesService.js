import Sale from '../models/Sale.js';

export const getSalesData = async (query) => {
    try {
        const { 
            search, 
            page = 1, 
            limit = 10, 
            sortBy = 'sale.date', 
            order = 'desc', 
            
            gender,
            region,
            category,
            paymentMethod,
            tags, 
            minAge,  
            maxAge,
            startDate,
            endDate
        } = query;

        const dbQuery = {};

        // SEARCH
        if (search) {
            dbQuery.$or = [
                { 'customer.name': { $regex: search, $options: 'i' } },
                { 'customer.phone': { $regex: search, $options: 'i' } }
            ];
        }

        // FILTERS
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

        // SORTING
        const sortOptions = {};
        sortOptions[sortBy] = order === 'asc' ? 1 : -1;

        // PAGINATION
        const pageNum = Math.max(1, Number(page));
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const sales = await Sale.find(dbQuery)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum);

        const total = await Sale.countDocuments(dbQuery);

        return {
            data: sales,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        };

    } catch (error) {
        throw new Error('Error fetching sales data: ' + error.message);
    }
};