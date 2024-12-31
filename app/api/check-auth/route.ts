import { NextRequest, NextResponse } from 'next/server';

export function GET(req: NextRequest) {
    const token = req.cookies.get('authToken');

    if (token) {
        return NextResponse.json({ token: token });
    }

    return NextResponse.json({ token: false });
}
