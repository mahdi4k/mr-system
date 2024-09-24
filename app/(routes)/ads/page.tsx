import React, { } from 'react';
import type { Metadata } from 'next'
import PageClient from './page.client'


export const metadata: Metadata = {
    title: 'آگهی قطعات',
    description: '',
}
const Page: React.FC = () => {

    return (
        <PageClient />
    );
};

export default Page;
