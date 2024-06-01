import { Breadcrumbs, Anchor, Text } from '@mantine/core'
import React, { FC } from 'react'

type Props = {
    title: string
    type: 'cpu' | 'motherboard' | 'power' | 'graphic'
}

const BreadCrumbKiwi: FC<Props> = ({ title, type }) => {
    return (
        <Breadcrumbs mb={'lg'} mt={'lg'}>
            <Anchor c={'var(--mantine-color-kiwi-2)'} size='sm' href={'/'}  >
                خانه
            </Anchor>
            <Anchor c={'var(--mantine-color-kiwi-2)'} size='sm' href={`/category/${type}`}>
                {type === 'cpu' ? 'cpu' : type === 'graphic' ? 'گرافیک ' : type === 'power' ? 'پاور' : type === 'motherboard' ? 'مادربرد' : " "}
            </Anchor>
            <Text c="dimmed" size='xs'>
                {title}
            </Text>
        </Breadcrumbs>
    )
}

export default BreadCrumbKiwi