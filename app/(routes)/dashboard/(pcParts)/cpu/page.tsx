import React from 'react'
import type { Metadata } from 'next'
import ClientCpu from "./clientCPU";

export const metadata: Metadata = {
    title: 'لیست CPU',
    description: '',
}

const CPU = () => {


    return (
        <>
            <ClientCpu/>
        </>
    )
}

export default CPU
