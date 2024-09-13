import { POWER } from '@/_redux/services/powerApi'
import { CPU } from '@/_redux/services/cpuApi'
import { Graphic } from '@/_redux/services/graphicApi'
import { Motherboard } from '@/_redux/services/motherboardApi'
import { Grid, Card, Stack, Badge, Text, Flex } from '@mantine/core'
import React, { FC } from 'react'
import Link from 'next/link'
import CardPartPrice from '../../shared/CardPartPrice'
import classes from '../category.module.css'
import KiwiImage from '@/_components/shared/KiwiImage'

type Iprops = {
    items: Graphic[] | Motherboard[] | CPU[] | POWER[] | undefined
    type: 'motherboards' | 'cpus' | 'powers' | 'graphics' | 'ssds' | undefined
    title: string
}
const ModalItems: FC<Iprops> = ({ title, items, type }) => {
    return (
        <>
            <Text fw={'bold'} fz={'sm'}>{title}</Text>
            <Grid gutter="md" my={'xl'} >
                {items && items.map((item) => (
                    <Grid.Col key={item.id} span={{ base: 12, md: 6, lg: 3 }}>
                        <Card className={classes.categoryCard} mih={{ base: '200px', md: '375px' }} key={item.id} shadow="sm" padding="lg" radius="md" withBorder>
                            <Link className={classes.categorySection} href={`/products/${type}/${item.id}`}>
                                <Card.Section className={classes.categoryImage} mt={'0'} ta={'center'}>
                                    {item.image && <KiwiImage width={300} height={300} img={item.image} alt={item.name} />}
                                </Card.Section>

                                <Flex direction={'column'}>
                                    <Stack h={{ md: 50 }} justify="start" align='center' mt="md" mb="xs">
                                        <Text pt={{ base: 'md', md: 'xs' }} className={classes.ProductTitle} fw={500}>{item.name}</Text>
                                    </Stack>
                                    <CardPartPrice price={item.price} />
                                </Flex>
                            </Link>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>
        </>
    )
}

export default ModalItems