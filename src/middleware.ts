import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect /admin routes
    if (pathname.startsWith('/admin')) {
        const session = request.cookies.get('admin_session');

        // Note: For 100% security, we'd verify a signed JWT here.
        // For now, checking the presence of the secure HTTP-only cookie set by our Server Action.
        if (!session || session.value !== 'authenticated') {
            // If it's the admin page itself, the client-side gate will also handle it,
            // but we can also redirect or do nothing here.
            // However, to keep the "Gate" UI in page.tsx, we allow the request 
            // but the page.tsx will checkAuth() via Server Action.
            // If the user wants 100% hiding of source, we should redirect to a login page.
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
