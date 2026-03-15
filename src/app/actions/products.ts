'use server';

import { databases, storage, DATABASE_ID, COLLECTION_ID, BUCKET_ID, ID, client } from '@/lib/appwrite';
import { checkAuth } from './auth';

export async function addProduct(product: any, images: (string | File)[]) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        throw new Error('Unauthorized');
    }

    try {
        const uploadedImageUrls: string[] = [];

        // 1. Upload files to Appwrite Storage first
        for (const img of images) {
            if (img instanceof File) {
                const file = await storage.createFile(
                    BUCKET_ID,
                    ID.unique(),
                    img
                );
                // Generate public URL
                const url = `${client.config.endpoint}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${client.config.project}`;
                uploadedImageUrls.push(url);
            } else {
                // It's already a URL
                uploadedImageUrls.push(img);
            }
        }

        // 2. Create document with the URLs
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
