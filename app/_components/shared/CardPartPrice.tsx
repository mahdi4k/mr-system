import { Group, Text } from '@mantine/core'
import React from 'react'
import Image from 'next/image'
import classes from '../category/category.module.css'
const CardPartPrice = ({ price, justify }: { price: string | undefined, justify?: string }) => {
    return (
        <>
            {price ? <>
                <Group justify={justify} gap={4} className={classes.Price} align='center' mt="md" mb="xs">
                    <Text className={classes.PriceProductTitle} fw={'bold'} c='#25ac9e'>از</Text>
                    <Text className={classes.PriceProductTitle} fw={'bold'} c='#25ac9e'>{Intl.NumberFormat('fa', {}).format(Number(price))}</Text>
                    <Image src={'/svg/toman.svg'} alt='kiwi part price' width={22} height={22} />
                </Group>
            </> : ''}
        </>
    )
}

export default CardPartPrice