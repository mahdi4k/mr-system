import { Grid } from '@mantine/core'
import React from 'react'
import Image from 'next/image';

const SingleProductImage = ({ product }: { product: { image: string, name: string } }) => {
    return (
        <>
            <Grid.Col span={{ base: 12, lg: 4 }}>
                {product.image && <Image alt={product.name} width={450} height={450} sizes="100vw"
                    style={{
                        width: '100%',
                        height: 'revert-layer',
                        objectFit: 'contain'
                    }}
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/${product.image}`} />}
            </Grid.Col>
        </>
    )
}

export default SingleProductImage