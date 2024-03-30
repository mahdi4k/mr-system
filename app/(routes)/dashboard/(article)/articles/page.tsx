import React, { } from 'react';
import PageClient from './page.client';
import type { Metadata } from 'next'

export type SlugType = 'motherboard' | 'cpu' | 'graphic'

export interface PiecesProps {
    params: {
        slug: SlugType[]
    };
}

export const metadata: Metadata = {
    title: 'انتخاب قطعات',
    description: '',
}
const Page: React.FC<PiecesProps> = ({ params }) => {

    return (
        <PageClient params={params} />
    );
};

export default Page;
