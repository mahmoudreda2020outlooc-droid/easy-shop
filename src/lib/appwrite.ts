import { Client, Databases, Storage, ID } from 'appwrite';

export const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Default endpoint
    .setProject('697121c70024e4e94ac3'); // Project ID from user

export const databases = new Databases(client);
export const storage = new Storage(client);
export const DATABASE_ID = '6971223f003e5f162359';
export const COLLECTION_ID = 'easy_shop_products';
export const BUCKET_ID = 'product_images'; // Using existing bucket
export { ID };
