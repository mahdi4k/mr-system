import ClientPage from "./clientPage"


async function getData(params: { part: string, id: string }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${params.part}/${params.id}`)
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }
    return res.json()
}

export default async function Page({ params }: { params: { part: 'graphics' | 'powers' | 'motherboards' | 'cpus', id: string } }) {
    const { data } = await getData(params);

    return <main>
        <ClientPage product={data} type={params.part} />
    </main>
}