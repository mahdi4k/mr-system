import CardPartPrice from '@/_components/shared/CardPartPrice'
import { CPU } from '@/_redux/services/cpuApi'
import { Graphic } from '@/_redux/services/graphicApi'
import { Motherboard } from '@/_redux/services/motherboardApi'
import { POWER } from '@/_redux/services/powerApi'
import { Carousel, Embla } from '@mantine/carousel';
import { Tabs, Grid, Card, Stack, Box, Flex, Text } from '@mantine/core'
import Link from 'next/link'
import React, { FC, useEffect, useState } from 'react'
import Image from 'next/image';
import classes from './tabs.module.css'

type Props = {
    tabLists: { title: string, img: string, value: string }[]
    tabPanels: { value: string, item: CPU[] | POWER[] | Graphic[] | Motherboard[] }[]
    defaultValue: string
}
const TabsSection: FC<Props> = ({ tabLists, tabPanels, defaultValue }) => {
    const [key, setKey] = useState(1)
    const [embla, setEmbla] = useState<Embla | null>(null);

    useEffect(() => {
        if (embla) {
            embla?.reInit({ direction: 'rtl' })
        }
    }, [embla, key]);


    return (
        <Tabs color="green" defaultValue={defaultValue}>
            <Tabs.List>
                {tabLists.map(item => (
                    <Tabs.Tab onClick={() => setKey(prev => prev + 1)} key={item.value} value={item.value} leftSection={<Image width={20} height={27} alt='' src={item.img} />}>
                        {item.title}
                    </Tabs.Tab>
                ))}
            </Tabs.List>

            {tabPanels.map((tab) => (
                <Tabs.Panel key={tab.value} value={tab.value}>
                    <Box component='div' mt={'lg'} style={{ direction: 'rtl' }}>
                        <Carousel
                            dragFree
                            align="start"
                            slideSize={{ base: '65%', sm: '50%', md: '27.333333%' }}
                            slideGap={{ base: 'lg', sm: 'xl' }}
                            getEmblaApi={setEmbla}
                            height={375}
                            withControls={false} withIndicators>

                            {tab.item?.length > 0 ? tab.item.map((data) => (
                                <Carousel.Slide key={data.id}>
                                    <Link  href={`/products/${tab.value}/${data.id}`}>
                                        <Card className={classes.CardItem} miw={20} mih={312} key={data.id} shadow="sm" padding="lg" radius="md" withBorder>
                                            <Card.Section mt={'0'} ta={'center'}>
                                                {data.image && <Image alt={data.name} width={170} height={160} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/${data.image}`} />}
                                            </Card.Section>

                                            <Flex align={'center'} justify={'center'} direction={'column'}>
                                                <Stack h={50} justify="start" align='center' mt="md" mb="xs">
                                                    <Text ta={'center'} fw={500}>{data.name}</Text>
                                                </Stack>
                                                <CardPartPrice price={data.price} />
                                            </Flex>
                                        </Card>
                                    </Link>
                                </Carousel.Slide>

                            )) : <Card mih={312}><Text>محصولی یافت نشد</Text></Card>}
                        </Carousel>
                    </Box>
                </Tabs.Panel>
            ))}
        </Tabs>
    )
}

export default TabsSection