"use client"

import { Card, Container, Flex, Grid, Text } from '@mantine/core'
import React from 'react'
import Image from "next/image";
import classes from './cardParts.module.css'
const CardParts = () => {
    return (
        <Container mb={'xl'} size="lg">
            <Grid justify='center' py={'xl'}>
                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                    <Card className={classes.card} bg={'var(--mantine-color-indigo-outline-hover)'} mih={'160px'} radius={'md'}>
                        <Flex justify={'center'} direction={'column'} align={'center'}>
                            <Image width={110} height={90} src={'/svg/cpu.svg'} alt={'cpu'} />
                            <Text mt={'xs'}>cpu</Text>
                        </Flex>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                    <Card className={classes.card} bg={'var(--mantine-color-cyan-outline-hover)'} mih={'160px'} radius={'md'}>
                        <Flex justify={'center'} direction={'column'} align={'center'}>
                            <Image width={110} height={90} src={'/svg/motherboard.svg'} alt={'motherboard'} />
                            <Text mt={'xs'}>motherboard</Text>
                        </Flex>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                    <Card className={classes.card} bg={'var(--mantine-color-green-outline-hover)'} mih={'160px'} radius={'md'}>
                        <Flex justify={'center'} direction={'column'} align={'center'}>
                            <Image width={110} height={90} src={'/svg/power.svg'} alt={'power'} />
                            <Text mt={'xs'}>power</Text>
                        </Flex>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                    <Card className={classes.card} bg={'var(--mantine-color-violet-outline-hover)'} mih={'160px'} radius={'md'}>
                        <Flex justify={'center'} direction={'column'} align={'center'}>
                            <Image width={110} height={90} src={'/svg/graphic.svg'} alt={'graphic'} />
                            <Text mt={'xs'}>graphic</Text>
                        </Flex>
                    </Card>
                </Grid.Col>
            </Grid>
        </Container>
    )
}

export default CardParts