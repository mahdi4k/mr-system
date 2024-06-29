import React from 'react'
import type { Metadata } from 'next'
import ClientCase from "./clientCase";

export const metadata: Metadata = {
    title: 'لیست case',
    description: '',
}

const Case = () => {


    return (
        <>
            <ClientCase />
        </>
    )
}

export default Case
