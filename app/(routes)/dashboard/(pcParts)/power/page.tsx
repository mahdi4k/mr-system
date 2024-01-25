import React from 'react'
import type { Metadata } from 'next'
import ClientPower from "./clientPower";

export const metadata: Metadata = {
    title: 'لیست power',
    description: '',
}

const CPU = () => {


    return (
        <>
            <ClientPower/>
        </>
    )
}

export default CPU
