import { Box, Card, Container, Flex, SimpleGrid, Text } from '@mantine/core'
import React from 'react'
import SVG from "react-inlinesvg"
import { IconMoodSmile } from '@tabler/icons-react';
import Link from 'next/link';

const SuggestSection = () => {
    return (
        <Container size={'lg'}>
            <SimpleGrid cols={3} spacing={'xl'}>
                <Card style={{ alignItems: 'center' }} h={400} shadow='sm'>
                    <SVG
                        style={{ flexGrow: '1' }}
                        width={120}
                        loader={<Box component='div' w={{ base: 300, sm: 507 }} h={{ base: 360, md: 478 }}></Box>}
                        src='/svg/case.svg' />
                    <Flex justify={'center'} align={'center'} mt={'lg'}>
                        <Text pb={'xl'} mt={'lg'} ta={'center'}>
                            سیستم آماده شماره ۱
                        </Text>

                    </Flex>
                </Card>
                <Card style={{ alignItems: 'center' }} shadow='md'>
                    <Link href={'/choose-part'}>
                        <SVG
                            width={300}
                            src='/svg/all-part.svg' />
                        <Flex justify={'center'} align={'center'} mt={'lg'}>
                            <Text fz={'2rem'} className={'vibes'} mt={'lg'} ta={'center'}>
                                خودت انتخاب کن
                            </Text>
                            <Box mt={'lg'} mr={'2px'}>
                                <IconMoodSmile size={35} color='var(--mantine-color-kiwi-8)' />
                            </Box>
                        </Flex>

                    </Link>

                </Card>
                <Card style={{ alignItems: 'center' }} h={400} shadow='sm'>
                    <SVG
                        style={{ flexGrow: '1' }}
                        width={120}
                        loader={<Box component='div' w={{ base: 300, sm: 507 }} h={{ base: 360, md: 478 }}></Box>}
                        src='/svg/case.svg' />
                    <Flex justify={'center'} align={'center'} mt={'lg'}>
                        <Text pb={'xl'} mt={'lg'} ta={'center'}>
                            سیستم آماده شماره ۲
                        </Text>
                    </Flex>
                </Card>

            </SimpleGrid>
        </Container>
    )
}

export default SuggestSection