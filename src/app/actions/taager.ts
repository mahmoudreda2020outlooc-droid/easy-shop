'use server';

import { addProduct } from './products';

const TAAGER_API_BASE = 'https://taager.com/api/external/v1'; // Probable base URL

export async function fetchTaagerProducts(apiKey: string) {
    try {
        const response = await fetch(`${TAAGER_API_BASE}/products`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return { success: false, error: `Taager Error: ${response.statusText}` };
        }

        const data = await response.json();
        return { success: true, products: data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
