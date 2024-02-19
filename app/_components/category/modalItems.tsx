import { POWER } from '@/_redux/services/powerApi'
import { CPU } from '@/_redux/services/cpuApi'
import { Graphic } from '@/_redux/services/graphicApi'
import { Motherboard } from '@/_redux/services/motherboardApi'
import { Grid, Card, Stack, Badge, Text } from '@mantine/core'
import Image from 'next/image'
import React, { FC } from 'react'

type Iprops = {
    items: Graphic[] | Motherboard[] | CPU[] | POWER[] | undefined
}
const ModalItems: FC<Iprops> = ({ items }) => {
    return (
        <Grid >
            {items && items.map((item) => (
                <Grid.Col key={item.id} span={{ base: 12, md: 6, lg: 3 }}>
                    <Card miw={'250px'} key={item.id} shadow="sm" padding="lg" radius="md" withBorder>
                        <Card.Section ta={'center'}>
                            {item.image && <Image alt={item.name} width={180} height={170} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${item.image}`} />}
                        </Card.Section>

                        <Stack justify="center" align='center' mt="md" mb="xs">
                            <Badge color="pink">{item.brand}</Badge>
                            <Text fw={500}>{item.name}</Text>
                        </Stack>
                    </Card>
                </Grid.Col>
            ))}
        </Grid>
    )
}

export default ModalItems