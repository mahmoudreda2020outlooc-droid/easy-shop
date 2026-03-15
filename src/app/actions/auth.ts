'use server';

import { cookies } from 'next/headers';

export async function login(password: string) {
    const adminPassword = process.env.ADMIN_PASSWORD || '112233';

    if (password === adminPassword) {
        // Set a secure, HTTP-only cookie
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 // 24 hours
        });
        return { success: true };
    }

    return { success: false, message: 'Invalid password' };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
}

export async function checkAuth() {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    return session?.value === 'authenticated';
}
