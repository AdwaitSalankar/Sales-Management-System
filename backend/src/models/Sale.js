import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema({
    transactionId: String,
    customer: {
        id: String,
        name: { type: String, index: true },
        gender: String,
        age: Number,
        region: String,
        phone: String,
        email: String
    },
    product: {
        id: String,
        name: String,
        brand: String,
        category: String,
        tags: [String]
    },
    sale: {
        quantity: Number,
        pricePerUnit: Number,
        discount: Number,
        totalAmount: Number,
        finalAmount: Number,
        date: Date
    },
    operational: {
        paymentMethod: String,
        storeId: String,
        storeLocation: String,
        deliveryType: String,
        salesPerson: {
            id: String,
            name: String
        }
    }
}, { timestamps: true });

export default mongoose.model('Sale', SaleSchema);