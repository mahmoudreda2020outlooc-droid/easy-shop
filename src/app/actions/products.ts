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
