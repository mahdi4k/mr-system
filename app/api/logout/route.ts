import { NextResponse } from 'next/server';

export async function GET() {
    // Clear the authToken cookie
    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.cookies.set('authToken', '', { expires: new Date(0) }); // Expire the cookie
    return response;
}
