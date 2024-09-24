import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

interface CreateProductRequest {
    name: string;
    description: string;
    price: number;
}

export async function POST(req: NextRequest) {
    const token = req.cookies.get('authToken')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userResponse = await fetch('https://your-laravel-backend.com/api/user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!userResponse.ok) {
        return NextResponse.json({ message: 'Failed to fetch user info' }, { status: 401 });
    }

    const userData = await userResponse.json();
    const userId = userData.id;

 

    const { name, description, price }: CreateProductRequest = await req.json();

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ name, description, price }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({
                message: errorData.message || 'Failed to create product',
                errors: errorData.errors || null,
            }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ message: 'Product created successfully', data });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
