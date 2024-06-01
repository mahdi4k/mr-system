import ClientPage from "./clientPage"


async function getData(params: { part: string, id: string }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${params.part}/${params.id}`)
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
export async function generateMetadata({ params }: { params: { part: 'graphics' | 'powers' | 'motherboards' | 'cpus', id: string } }) {

    const product = await getData(params);


    return {
        title: ` ${product.data.name} - کیوی پارت`,
    }
}
export default async function Page({ params }: { params: { part: 'graphics' | 'powers' | 'motherboards' | 'cpus', id: string } }) {
    const { data } = await getData(params);
    return <main style={{flex:'1'}}>
        <ClientPage product={data} type={params.part} />
    </main>
}