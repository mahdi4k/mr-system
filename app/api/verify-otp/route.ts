import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

interface VerifyOtpRequest {
    phone: string;
    otp: string;
    name?: string;
}

export async function POST(req: NextRequest) {
    const { phone, otp, name }: VerifyOtpRequest = await req.json();

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, otp, name: name || null }),
        });

        if (!response.ok) {
            return NextResponse.json({ message: 'OTP verification failed' }, { status: 401 });
        }

        const data: { status: boolean; token: string } = await response.json();

        if (data.status) {
            const res = NextResponse.json({ message: 'OTP verified and token stored' });
            res.cookies.set('authToken', data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 24 * 60 * 60, // 30 days
                path: '/',
            });

            return res;
        } else {
            return NextResponse.json({ message: 'OTP verification failed' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
