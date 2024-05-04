import { POWER } from '@/_redux/services/powerApi'
import { CPU } from '@/_redux/services/cpuApi'
import { Graphic } from '@/_redux/services/graphicApi'
import { Motherboard } from '@/_redux/services/motherboardApi'
import { Grid, Card, Stack, Badge, Text } from '@mantine/core'
import Image from 'next/image'
import React, { FC } from 'react'
import Link from 'next/link'
import CardPartPrice from '../shared/CardPartPrice'

type Iprops = {
    items: Graphic[] | Motherboard[] | CPU[] | POWER[] | undefined
    type: 'motherboards' | 'cpus' | 'powers' | 'graphics' | undefined
}
const ModalItems: FC<Iprops> = ({ items, type }) => {
    return (
        <Grid my={'xl'} >
            {items && items.map((item) => (
                <Link href={`/products/${type}/${item.id}`}>
                    <Grid.Col key={item.id} span={{ base: 12, md: 6, lg: 3 }}>
                        <Card miw={'250px'} key={item.id} shadow="sm" padding="lg" radius="md" withBorder>
                            <Card.Section mt={'1px'} ta={'center'}>
                                {item.image && <Image alt={item.name} width={180} height={170} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.image}`} />}
                            </Card.Section>

                            <Stack mih={'50px'} justify="center" align='center' mt="md" mb="xs">
                                <Text fw={500}>{item.name}</Text>
                            </Stack>
                            <CardPartPrice price={item.price} />

                        </Card>
                    </Grid.Col>
                </Link>
            ))}
        </Grid>
    )
}

export default ModalItems