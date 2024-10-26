import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';



export async function GET(req: NextRequest) {
    const token = cookies().get('authToken')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!userResponse.ok) {
        return NextResponse.json({ message: 'Failed to fetch user info' }, { status: 401 });
    }

    const userData = await userResponse.json();
    return NextResponse.json({ message: 'Product created successfully', userData });

}
