import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { conversationId: string } }) {
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { conversationId } = params;

        if (!conversationId) {
            return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
        }

        const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/conversations/${conversationId}/messages`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await backendResponse.json();

        if (!backendResponse.ok) {
            return NextResponse.json({ error: data.error || 'Failed to fetch messages' }, { status: backendResponse.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: { conversationId: string } }) {
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { conversationId } = params;

        if (!conversationId) {
            return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
        }

        // Extract the message from the request body
        const body = await request.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Send the POST request to the Laravel backend
        const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ message }),
        });

        const data = await backendResponse.json();

        if (!backendResponse.ok) {
            return NextResponse.json({ error: data.error || 'Failed to send message' }, { status: backendResponse.status });
        }

        return NextResponse.json(data, { status: 201 }); // Return the saved message
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
