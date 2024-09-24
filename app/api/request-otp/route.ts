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
            return NextResponse.json({ message: 'Failed to send OTP' }, { status: 500 });
        }

        const data = await response.json();

        return NextResponse.json({ message: 'OTP sent successfully', data });
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
