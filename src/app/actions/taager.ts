'use server';

import { addProduct } from './products';

// The discovered endpoint for Taager External API (via easy-orders)
const TAAGER_API_BASE = 'https://api.easy-orders.net/api/v1/external-apps';

export async function fetchTaagerProducts(apiKey: string) {
    try {
        const response = await fetch(`${TAAGER_API_BASE}/products`, {
            headers: {
                'Api-Key': apiKey,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { success: false, error: `Taager API Error (${response.status}): ${errorText || response.statusText}` };
        }

        const data = await response.json();
        // The API might return { data: [...] } or just [...]
        const rawProducts = data.data || data;

        // Map Taager products to our internal schema
        const mappedProducts = rawProducts.map((p: any) => ({
            id: p.id,
            name: p.product_name || p.name,
            price: p.price,
            description: p.description || '',
            image: p.main_image || (p.images && p.images[0]) || '',
            rating: '5',
            taagerCode: p.taager_code || p.id
        }));

        return { success: true, products: mappedProducts };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function importTaagerProductAction(product: any) {
    try {
        // Prepare data for addProduct
        const res = await addProduct({
            name: product.name,
            price: Number(product.price),
            description: product.description,
            rating: product.rating
        }, [product.image]);
        return res;
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
