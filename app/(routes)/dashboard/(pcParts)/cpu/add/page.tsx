import React from 'react'
import { Metadata } from 'next';
import ClientAddCpu from './clientAddCpu';

export const metadata: Metadata = {
    title: 'افزودن CPU',
    description: '',
}

export type ActiveStepDTO = 'step-1' | 'step-2'
const Motherboard = () => {

    return (
        <>
            <ClientAddCpu />
        </>
    )
}

export default Motherboard
