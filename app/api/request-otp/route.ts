import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

interface RequestOtpRequest {
    phone: string;
}

export async function POST(req: NextRequest) {
    const { phone }: RequestOtpRequest = await req.json();

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/phone`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone }),
        });

        if (!response.ok) {
            console.error('Error from Laravel:', response.status, response.statusText);
            return NextResponse.json(
                { message: 'Failed to send OTP', error: response.statusText },
                { status: response.status }
            );
        }


        return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
