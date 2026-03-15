'use server';

import { databases, storage, DATABASE_ID, COLLECTION_ID, BUCKET_ID, ID, client } from '@/lib/appwrite';
import { checkAuth } from './auth';

export async function uploadImageAction(formData: FormData) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) throw new Error('Unauthorized');

    try {
        const file = formData.get('file') as File;
        const uploadedFile = await storage.createFile(
            BUCKET_ID,
            ID.unique(),
            file
        );
        const url = `${client.config.endpoint}/storage/buckets/${BUCKET_ID}/files/${uploadedFile.$id}/view?project=${client.config.project}`;
        return { success: true, url };
    } catch (error) {
        console.error('Single image upload error:', error);
        return { success: false, error: 'Failed to upload image' };
    }
}

export async function addProduct(product: any, uploadedImageUrls: string[]) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        throw new Error('Unauthorized');
    }

    try {
        // Create document with the URLs
        await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            {
                name: product.name,
                price: product.price,
                description: product.description,
                rating: product.rating,
                image: uploadedImageUrls[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
                images: uploadedImageUrls.length > 0 ? uploadedImageUrls : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop']
            }
        );

        return { success: true };
    } catch (error: any) {
        console.error('Error adding product:', error);
        throw error;
    }
}

export async function deleteAllProducts() {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        throw new Error('Unauthorized');
    }

    try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        for (const doc of response.documents) {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, doc.$id);
        }
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting products:', error);
        throw error;
    }
}

export async function getProducts() {
    try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        return {
            success: true,
            products: response.documents.map(doc => ({
                id: doc.$id,
                name: doc.name,
                price: doc.price,
                description: doc.description,
                rating: doc.rating,
                image: doc.image,
                images: doc.images || [doc.image]
            }))
        };
    } catch (error: any) {
        console.error('Error getting products:', error);
        return { success: false, products: [] };
    }
}

export async function testConnectionAction() {
    const report = {
        endpoint: !!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || !!process.env.APPWRITE_ENDPOINT,
        projectId: !!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || !!process.env.APPWRITE_PROJECT_ID,
        databaseId: !!process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || !!process.env.APPWRITE_DATABASE_ID,
        collectionId: !!process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || !!process.env.APPWRITE_COLLECTION_ID,
        bucketId: !!process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || !!process.env.APPWRITE_BUCKET_ID,
        adminPassword: !!process.env.ADMIN_PASSWORD,
    };

    try {
        // Try to list buckets as a sanity check for connection
        await storage.listBuckets();
        return { success: true, report, message: 'All systems operational on server!' };
    } catch (error: any) {
        return {
            success: false,
            report,
            error: error.message,
            tip: 'If variables are "false", they are missing in Vercel Dash. If true and still failing, check Appwrite Permissions (API keys or Any->Create)'
        };
    }
}
