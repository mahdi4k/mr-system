import React from 'react'
import type { Metadata } from 'next'
import ClientCpu from "./clientGraphic";

export const metadata: Metadata = {
    title: 'لیست کارت گرافیک',
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
