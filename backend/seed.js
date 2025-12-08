import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import StreamArray from 'stream-json/streamers/StreamArray.js';
import Sale from './src/models/Sale.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/truestate_db')
    .then(() => console.log('✅ MongoDB Connected for Seeding'))
    .catch(err => console.error('❌ DB Connection Error:', err));

const importData = async () => {
    // 1. Clear old data first
    try {
        await Sale.deleteMany();
        console.log('Old data cleared.');
    } catch (err) {
        console.error("Error clearing data:", err);
    }

    const rawDataPath = path.join(__dirname, 'raw_data.json');
    const stream = fs.createReadStream(rawDataPath);
    
    const jsonStream = stream.pipe(StreamArray.withParser());

    let batch = [];
    const BATCH_SIZE = 1000; 
    let count = 0;

    console.log('⏳ Starting Stream Import...');

    jsonStream.on('data', async ({ value: item }) => {
        // Transform the item to match Schema
        const doc = {
            transactionId: item['Transaction ID'] || new mongoose.Types.ObjectId(),
            customer: {
                id: item['Customer ID'],
                name: item['Customer Name'],
                gender: item['Gender'],
                age: Number(item['Age']),
                region: item['Customer Region'],
                phone: String(item['Phone Number']),
                email: item['Email']
            },
            product: {
                id: item['Product ID'],
                name: item['Product Name'],
                brand: item['Brand'],
                category: item['Product Category'],
                tags: typeof item['Tags'] === 'string' ? item['Tags'].split(',').map(t => t.trim()) : item['Tags']
            },
            sale: {
                quantity: Number(item['Quantity']),
                pricePerUnit: Number(item['Price per Unit']),
                discount: Number(item['Discount Percentage']),
                totalAmount: Number(item['Total Amount']),
                finalAmount: Number(item['Final Amount']),
                date: new Date(item['Date'])
            },
            operational: {
                paymentMethod: item['Payment Method'],
                storeId: item['Store ID'],
                storeLocation: item['Store Location'],
                deliveryType: item['Delivery Type'],
                salesPerson: {
                    id: item['Salesperson ID'],
                    name: item['Employee Name']
                }
            }
        };

        batch.push(doc);

        // When batch is full
        if (batch.length >= BATCH_SIZE) {
            jsonStream.pause();
            try {
                await Sale.insertMany(batch);
                count += batch.length;
                process.stdout.write(`\rInserted ${count} records...`);
                batch = [];
                jsonStream.resume();
            } catch (err) {
                console.error('\nBatch Insert Error:', err);
                process.exit(1);
            }
        }
    });

    jsonStream.on('end', async () => {
        // Insert remaining records
        if (batch.length > 0) {
            try {
                await Sale.insertMany(batch);
                count += batch.length;
                console.log(`\r Inserted ${count} records...`);
            } catch (err) {
                console.error('\n Final Batch Error:', err);
            }
        }
        console.log('\n Data Import Complete!');
        process.exit();
    });

    jsonStream.on('error', (err) => {
        console.error('\n Stream Error:', err);
        process.exit(1);
    });
};

importData();