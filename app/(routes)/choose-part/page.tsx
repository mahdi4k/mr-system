import React, { } from 'react';
import type { Metadata } from 'next'
import PageClient from './page.client';

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
        <PageClient />
    );
};

export default Page;
