import React from 'react'
import type { Metadata } from 'next'
import ClientSsd from "./clientSsd";

export const metadata: Metadata = {
    title: 'لیست ssd',
    description: '',
}

const CPU = () => {


    return (
        <>
            <ClientSsd/>
        </>
    )
}

export default CPU
