import { Grid, Card, Flex, Stack, Box, Divider, Group, Tooltip, Avatar, Text } from '@mantine/core'
import Link from 'next/link'
import React, { FC } from 'react'
import CardPartPrice from '../shared/CardPartPrice'
import CategoryImage from './components/CategoryImage'
import classes from './category.module.css'
import { CPU } from '@/_redux/services/cpuApi'
import { Graphic } from '@/_redux/services/graphicApi'
import { POWER } from '@/_redux/services/powerApi'
import { Motherboard } from '@/_redux/services/motherboardApi'
import { SSD } from '@/_redux/services/ssdApi'
import { FAN } from '@/_redux/services/fanApi'
import { CASE } from '@/_redux/services/caseApi'
import { RAM } from '@/_redux/services/ramApi'

type Props = {
    data: CPU | Motherboard | Graphic | POWER | SSD | FAN | CASE | RAM;
    type: 'powers' | 'cpus' | 'motherboards' | 'graphics' | 'ssds' | 'fans' | 'cases' | 'rams'
    children: React.ReactNode;
}
const CategoryLayout: FC<Props> = ({ data, children, type }) => {
    return (

        <Grid.Col key={data.id} span={{ base: 12, sm: 6, lg: 3 }}>
            <Card className={classes.categoryCard} mih={{ base: '230px', md: '375px' }} miw={'250px'} key={data.id} shadow="sm" padding="lg" radius="md" withBorder>
                <Link className={classes.categorySection} href={`/products/${type}/${data.id}`}>
                    <Card.Section className={classes.categoryImage} mt={'0'} ta={'center'}>
                        {data.image && <CategoryImage img={data.image} alt={data.name} />}
                    </Card.Section>

                    <Flex direction={'column'}>
                        <Stack h={{ md: 50 }} justify="start" align='center' mt="md" mb="xs">
                            <Text pt={{ base: 'md', md: 'xs' }} className={classes.ProductTitle} fw={500}>{data.name}</Text>
                        </Stack>
                        <CardPartPrice price={data.price} />
                    </Flex>
                </Link>
                {children}


            </Card>
        </Grid.Col>

    )
}

export default CategoryLayout