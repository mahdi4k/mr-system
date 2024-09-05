

import React from 'react'
import type { Metadata } from 'next'
import ClientAds from "./clientAds";
 
export const metadata: Metadata = {
    title: 'لیست آگهی',
    description: '',
}

const Page = () => {


    return (
        <>
            <ClientAds />
        </>
    )
}

export default Page
 