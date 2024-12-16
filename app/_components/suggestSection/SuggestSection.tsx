"use client"

import { Box, Card, Container, Flex, Grid, rem, SimpleGrid, Skeleton, Text } from '@mantine/core'
import React from 'react'
import SVG from "react-inlinesvg"
import { IconMoodSmile } from '@tabler/icons-react';
import Link from 'next/link';
import classes from './ImageCard.module.css'

const PRIMARY_COL_HEIGHT = rem(300);

const SuggestSection = () => {
    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

    return (
        <Container size={'lg'}>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                <Flex w={'100%'} h={PRIMARY_COL_HEIGHT}>
                    <Link style={{ width: '100%' }} href={'/choose-part'}>

                        <Card className={classes.cardBig} w={'100%'} style={{ alignItems: 'center' }} shadow='md'>
                            <div className={classes.imageBig}
                                style={{
                                    backgroundImage:
                                        'url(/big.png)',
                                }}
                            />
                            <div className={classes.overlay} />
                            <div className={classes.contentBig}>
                                <SVG className={classes.svgBig}
                                    width={220}
                                    src='/svg/all-part.svg' />
                                <Flex justify={'center'} align={'center'} mt={'sm'}>
                                    <Text className={`${classes.title} vibes`} fz={'2rem'} ta={'center'}>
                                        خودت انتخاب کن
                                    </Text>
                                    <Box mt={'lg'} mr={'2px'}>
                                        <IconMoodSmile size={35} color='var(--mantine-color-kiwi-8)' />
                                    </Box>
                                </Flex>
                            </div>
                        </Card>
                    </Link>

                </Flex>
                <Grid gutter="md">
                    <Grid.Col span={12}>
                        <Card p="lg" shadow="lg" className={classes.card} radius="md" component="a"
                            href="https://kiwipart.ir/choose-part?cpu=3&graphic=21&motherboard=2&power=12&ram=1&fan=5&ssd=3&case=2"
                            target="_blank"
                        >
                            <div className={classes.image}
                                style={{
                                    backgroundImage:
                                        'url(/pc-suggest-mid.png)',
                                }}
                            />
                            <div className={classes.overlay} />
                            <div className={classes.content}>
                                <div>
                                    <Text size="lg" className={classes.title} fw={500}>
                                        کامپیوتر گیمینگ میان رده
                                    </Text>
                                </div>
                            </div>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Card p="lg" shadow="lg" className={classes.card} radius="md" component="a"
                            href="https://kiwipart.ir/choose-part?cpu=7&graphic=26&motherboard=7&power=13&ram=7&fan=6&ssd=3&case=5"
                            target="_blank"
                        >
                            <div className={classes.image}
                                style={{
                                    backgroundImage:
                                        'url(/high-end.png)',
                                }}
                            />
                            <div className={classes.overlay} />
                            <div className={classes.content}>
                                <div>
                                    <Text size="lg" className={classes.title} fw={500}>
                                        کامپیوتر گیمینگ بالا رده
                                    </Text>
                                </div>
                            </div>
                        </Card>
                    </Grid.Col>
                </Grid>
                <Grid gutter="md">

                    <Grid.Col span={12}>
                        <Card p="lg" shadow="lg" className={classes.card} radius="md" component="a"
                            href="https://kiwipart.ir/choose-part?cpu=3&graphic=22&motherboard=2&power=9&ram=1&fan=5&ssd=3&case=2"
                            target="_blank"
                        >
                            <div className={classes.image}
                                style={{
                                    backgroundImage:
                                        'url(/low-end.png)',
                                }}
                            />
                            <div className={classes.overlay} />
                            <div className={classes.content}>
                                <div>
                                    <Text size="lg" className={classes.title} fw={500}>
                                        کامپیوتر گیمینگ اقتصادی
                                    </Text>
                                </div>
                            </div>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Card p="lg" shadow="lg" className={classes.card} radius="md" component="a"
                            href="https://kiwipart.ir/choose-part?cpu=8&graphic=22&motherboard=9&power=9&ram=8&fan=7&ssd=1&case=4"
                            target="_blank"
                        >
                            <div className={classes.image}
                                style={{
                                    backgroundImage:
                                        'url(/extra-low-end.png)',
                                }}
                            />
                            <div className={classes.overlay} />
                            <div className={classes.content}>
                                <div>
                                    <Text size="lg" className={classes.title} fw={500}>
                                        کامپیوتر گیمینگ فوق اقتصادی
                                    </Text>
                                </div>
                            </div>
                        </Card>
                    </Grid.Col>
                </Grid>
            </SimpleGrid>


        </Container >
    )
}

export default SuggestSection