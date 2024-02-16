import { Grid, Skeleton } from '@mantine/core'
import React from 'react'

const LoadingCategorySkeleton = () => {
    return (
        <Grid >
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                <Skeleton radius={'md'} height={300} mb="xl" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                <Skeleton radius={'md'} height={300} mb="xl" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                <Skeleton radius={'md'} height={300} mb="xl" />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
                <Skeleton radius={'md'} height={300} mb="xl" />
            </Grid.Col>
        </Grid>
    )
}

export default LoadingCategorySkeleton