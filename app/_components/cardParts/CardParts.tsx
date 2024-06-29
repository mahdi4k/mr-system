"use client"

import { Card, Container, Flex, Grid, Text } from '@mantine/core'
import React from 'react'
import Image from "next/image";
import classes from './cardParts.module.css'
import Link from 'next/link';
const CardParts = () => {
    return (
        <Container mb={'xl'} size="lg">
            <Grid justify='center' py={'xl'}>
                <Grid.Col style={{ display: 'flex', justifyContent: 'center' }} span={{ base: 12, sm: 6, lg: 3 }}>
                    <Link style={{ textDecoration: 'none' }} href={'/category/cpu'} >
                        <Card className={classes.card} bg={'var(--mantine-color-indigo-outline-hover)'} mih={'160px'} radius={'md'}>
                            <Flex justify={'center'} direction={'column'} align={'center'}>
                                <Image width={110} height={90} src={'/svg/cpu.svg'} alt={'cpu'} />
                            </Flex>
                        </Card>
                        <Text className={classes.cardTitle} mt={'xs'}>cpu</Text>
                    </Link>
                </Grid.Col>

                <Grid.Col style={{ display: 'flex', justifyContent: 'center' }} span={{ base: 12, sm: 6, lg: 3 }}>
                    <Link style={{ textDecoration: 'none' }} href={'/category/motherboard'} >
                        <Card className={classes.card} bg={'var(--mantine-color-cyan-outline-hover)'} mih={'160px'} radius={'md'}>
                            <Flex justify={'center'} direction={'column'} align={'center'}>
                                <Image width={110} height={90} src={'/svg/motherboard.svg'} alt={'motherboard'} />
                            </Flex>
                        </Card>
                        <Text className={classes.cardTitle} mt={'xs'}>مادربرد</Text>
                    </Link>
                </Grid.Col>

                <Grid.Col style={{ display: 'flex', justifyContent: 'center' }} span={{ base: 12, sm: 6, lg: 3 }}>
                    <Link style={{ textDecoration: 'none' }} href={'/category/power'}>
                        <Card className={classes.card} bg={'var(--mantine-color-green-outline-hover)'} mih={'160px'} radius={'md'}>
                            <Flex justify={'center'} direction={'column'} align={'center'}>
                                <Image width={110} height={120} src={'/svg/power.svg'} alt={'power'} />
                            </Flex>
                        </Card>
                        <Text className={classes.cardTitle} mt={'xs'}>پاور</Text>
                    </Link>
                </Grid.Col>

                <Grid.Col style={{ display: 'flex', justifyContent: 'center' }} span={{ base: 12, sm: 6, lg: 3 }}>
                    <Link style={{ textDecoration: 'none' }} href={'/category/graphic'} >
                        <Card className={classes.card} bg={'var(--mantine-color-violet-outline-hover)'} mih={'160px'} radius={'md'}>
                            <Flex justify={'center'} direction={'column'} align={'center'}>
                                <Image width={110} height={90} src={'/svg/graphic.svg'} alt={'graphic'} />
                            </Flex>
                        </Card>
                        <Text className={classes.cardTitle} mt={'xs'}>کارت گرافیک</Text>
                    </Link>
                </Grid.Col>

                <Grid.Col style={{ display: 'flex', justifyContent: 'center' }} span={{ base: 12, sm: 6, lg: 3 }}>
                    <Link style={{ textDecoration: 'none' }} href={'/category/ssd'} >
                        <Card className={classes.card} bg={'var(--mantine-color-violet-outline-hover)'} mih={'160px'} radius={'md'}>
                            <Flex justify={'center'} direction={'column'} align={'center'}>
                                <Image width={110} height={90} src={'/svg/ssd.svg'} alt={'graphic'} />
                            </Flex>
                        </Card>
                        <Text className={classes.cardTitle} mt={'xs'}>ssd</Text>
                    </Link>
                </Grid.Col>

                <Grid.Col style={{ display: 'flex', justifyContent: 'center' }} span={{ base: 12, sm: 6, lg: 3 }}>
                    <Link style={{ textDecoration: 'none' }} href={'/category/ram'} >
                        <Card className={classes.card} bg={'var(--mantine-color-violet-outline-hover)'} mih={'160px'} radius={'md'}>
                            <Flex justify={'center'} direction={'column'} align={'center'}>
                                <Image width={110} height={90} src={'/svg/ram.svg'} alt={'graphic'} />
                            </Flex>
                        </Card>
                        <Text className={classes.cardTitle} mt={'xs'}>رم</Text>
                    </Link>
                </Grid.Col>
                <Grid.Col style={{ display: 'flex', justifyContent: 'center' }} span={{ base: 12, sm: 6, lg: 3 }}>
                    <Link style={{ textDecoration: 'none' }} href={'/category/case'} >
                        <Card className={classes.card} bg={'var(--mantine-color-violet-outline-hover)'} mih={'160px'} radius={'md'}>
                            <Flex justify={'center'} direction={'column'} align={'center'}>
                                <Image width={110} height={90} src={'/svg/case.svg'} alt={'graphic'} />
                            </Flex>
                        </Card>
                        <Text className={classes.cardTitle} mt={'xs'}>کیس</Text>
                    </Link>
                </Grid.Col>
                <Grid.Col style={{ display: 'flex', justifyContent: 'center' }} span={{ base: 12, sm: 6, lg: 3 }}>
                    <Link style={{ textDecoration: 'none' }} href={'/category/fan'} >
                        <Card className={classes.card} bg={'var(--mantine-color-violet-outline-hover)'} mih={'160px'} radius={'md'}>
                            <Flex justify={'center'} direction={'column'} align={'center'}>
                                <Image width={150} height={120} src={'/svg/fan.svg'} alt={'graphic'} />
                            </Flex>
                        </Card>
                        <Text className={classes.cardTitle} mt={'xs'}>فن</Text>
                    </Link>
                </Grid.Col>
            </Grid>
        </Container>
    )
}

export default CardParts