"use client"

import { Box, Card, Container, Flex, Grid, rem, SimpleGrid, Skeleton, Text } from '@mantine/core'
import React from 'react'
import SVG from "react-inlinesvg"
import { IconMoodSmile } from '@tabler/icons-react';
import Link from 'next/link';

const PRIMARY_COL_HEIGHT = rem(300);

const SuggestSection = () => {
    const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

    return (
        <Container size={'lg'}>

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                <Flex h={PRIMARY_COL_HEIGHT}>
                    <Card w={'100%'} style={{ alignItems: 'center' }} shadow='md'>
                        <Link href={'/choose-part'}>
                            <SVG
                                width={220}
                                src='/svg/all-part.svg' />
                            <Flex justify={'center'} align={'center'} mt={'sm'}>
                                <Text fz={'2rem'} className={'vibes'} ta={'center'}>
                                    خودت انتخاب کن
                                </Text>
                                <Box mt={'lg'} mr={'2px'}>
                                    <IconMoodSmile size={35} color='var(--mantine-color-kiwi-8)' />
                                </Box>
                            </Flex>

                        </Link>

                    </Card>
                </Flex>
                <Grid gutter="md">

                    <Grid.Col span={12}>
                        <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
                    </Grid.Col>
                </Grid>
                <Grid gutter="md">

                    <Grid.Col span={12}>
                        <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" animate={false} />
                    </Grid.Col>
                </Grid>
            </SimpleGrid>


        </Container>
    )
}

export default SuggestSection