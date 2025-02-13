import PageClient from './page.client'
import { cookies } from 'next/headers';

export interface Category {
    id: number;
    name: string;
    value: string;
    icon: string;
    created_at: string | null;
    updated_at: string | null;
  }
  
  export interface User {
    id: number;
    name: string;
    username: string;
    phone: string;
    email: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface IAdsProps {
    id: number;
    user_id: number;
    category_id: number;
    title: string;
    image?: string; // Array of image paths
    city: string;
    ostan: string;
    price: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
    category: Category;
    user: User;
  }
  
  
  
async function getData(params: { id: string }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${params.id}`)
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    if (!res.ok) {
        const status = res.status;
        const statusText = res.statusText;
        let errorDetails = '';
        try {
            errorDetails = await res.json(); // If the response body is in JSON format
        } catch {
            errorDetails = await res.text(); // If the response body is in text format
        }

        throw new Error('Failed to fetch data')
    }
    return res.json()
}
export async function generateMetadata({ params }: { params: { id: string } }) {

    const product = await getData(params);
    return {
        title: ` ${product.title} - کیوی پارت`,
    }
}
export default async function Page({ params }: { params: { id: string } }) {
      const token = cookies().get('authToken')?.value;
    
    const data = await getData(params);
    return <main style={{ flex: '1' }}>
        <PageClient product={data} token={token} />
    </main>
}