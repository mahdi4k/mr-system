'use client'

import React, { useEffect, useRef, useState } from 'react'
import { PiecesProps } from './page'
import dynamic from 'next/dynamic'
// const MapComponent = dynamic(() => import('@/_components/textEditor/Tiptap'), { ssr: false })

const PageClient: React.FC<PiecesProps> = ({ params }) => {

    return (
        <div>

            {/* <MapComponent /> */}

        </div>
    )
}

export default PageClient