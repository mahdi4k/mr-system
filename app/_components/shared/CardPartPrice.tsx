import { Group, Text } from '@mantine/core'
import React from 'react'
import Image from 'next/image'

const CardPartPrice = ({ price }: { price: string | undefined }) => {
    return (
        <>
            {price ? <>
                <Group gap={4} justify="center" align='center' mt="md" mb="xs">
                    <Text fw={'bold'} c='#25ac9e'>از</Text>
                    <Text fw={'bold'} c='#25ac9e'>{Intl.NumberFormat('fa', {}).format(Number(price))}</Text>
                    <Image src={'/svg/toman.svg'} alt='kiwi part price' width={22} height={22} />
                </Group>
            </> : ''}
        </>
    )
}

export default CardPartPrice