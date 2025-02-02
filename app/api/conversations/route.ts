import { NextResponse } from 'next/server';

import { cookies } from 'next/headers';


export interface Apiconversation {
    data: Transaction[];
    meta: {
        count: number;
    };
}

export interface Transaction {
    id: number;
    product_id: number;
    user_id: number;
    seller_id: number;
    created_at: string;
    updated_at: string;
    product: Product;
    buyer: User;
    seller: User;
}

interface Product {
    id: number;
    user_id: number;
    category_id: number;
    title: string;
    image: string[]; // The string contains JSON, so it's parsed as an array
    city: string;
    ostan: string;
    price: number | null;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface User {
    id: number;
    name: string;
    username: string;
    phone: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}


export async function POST(request: Request) {
    const token = cookies().get('authToken')?.value;
    console.log("🚀 ~ POST ~ token:", token);

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { adId } = await request.json();

        if (!adId) {
            return NextResponse.json(
                { error: 'Missing adId in request body' },
                { status: 400 }
            );
        }

        // Ensure the backend URL is configured
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backendUrl) {
            console.error('Backend URL is not defined in environment variables.');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const response = await fetch(`${backendUrl}/api/conversations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ ad_id: adId }),
        });

        // Log response details
        console.log('Response Status:', response.status);
        console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

        const responseData = await response.json();
        console.log('Response Body:', responseData);

        if (!response.ok) {
            return NextResponse.json(
                {
                    error: 'Backend request failed',
                    status: response.status,
                    details: responseData,
                },
                { status: response.status }
            );
        }

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('Error in POST /api/conversations:', error);

        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}



export async function GET() {
    const token = cookies().get('authToken')?.value;

    // Replace with your Laravel API call
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/conversations`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },

    });
    return NextResponse.json(await response.json());
}
