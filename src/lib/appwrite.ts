import { Client, Databases, Storage, ID } from 'appwrite';

export const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

export const databases = new Databases(client);
export const storage = new Storage(client);
export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || '';
export const COLLECTION_ID = process.env.APPWRITE_COLLECTION_ID || '';
export const BUCKET_ID = process.env.APPWRITE_BUCKET_ID || '';
export { ID };
