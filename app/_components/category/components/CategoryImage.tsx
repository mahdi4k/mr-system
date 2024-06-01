import React, { FC } from 'react'
import Image from 'next/image'

type Props = {
    img: string,
    alt: string
}

const CategoryImage: FC<Props> = ({ img, alt }) => {


    return (
        <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'contain' }} alt={alt} fill src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${img}`} />

    )
}

export default CategoryImage