import React from 'react'
import ClientPage from './clientPage';

type Iprop = 'motherboard' | 'cpu' | 'graphic' | 'power'

export async function generateMetadata({ params }: { params: { partName: Iprop } }) {
    return {
        title: `لیست ${params.partName} - کیوی پارت`,
    }
}

const Page = ({ params }: { params: { partName: Iprop } }) => {
    return (
        <ClientPage partName={params.partName} />
    )
}

export default Page

