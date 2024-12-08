"use client"

import { formatJalaliTimeAgo, provinceTitleHandler, cityTitleHandler } from '@/_utils/utils';
import { Carousel, Embla } from '@mantine/carousel'
import { Box, Card, Flex, Group, Skeleton, Text } from '@mantine/core'
import { IconFlag3 } from '@tabler/icons-react';
import Link from 'next/link';
import React, { FC, useState } from 'react'
import CardPartPrice from '../shared/CardPartPrice';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/_redux/store';
import { Product } from '@/_redux/services/adsApi';
import ImgNoProduct from '../../../public/no-product.png'

type props = {
    filteredAds: Product[],
    isFetchingAds: boolean
}

const AdsRelated: FC<props> = ({ filteredAds, isFetchingAds }) => {
    const [embla, setEmbla] = useState<Embla | null>(null);
    const { ostan, city, status } = useSelector((state: RootState) => state.ads);

    const handleImageCarouselAds = (image: string | undefined, title: string) => {

        const images: string[] = JSON.parse(image as string);

        if (images.length > 0) {
            return (
                <Image alt={title} style={{ borderRadius: '7px' }} width={190} height={180}
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/storage/${images[0]}`}
                />
            );

        } else {
            return (
                <Image style={{ objectFit: 'contain' }} width={190} height={180} alt='no img' src={ImgNoProduct} />
            )
        }
    }

    return (
        <Box mb={'xl'} mt={'60px'} style={{ direction: 'rtl' }}>
            <Text>آگهی‌ های مشابه</Text>
            <Carousel
                slideSize={{ base: '52%', lg: '21%' }}
                slideGap={{ base: 'sm', sm: 'md' }}
                getEmblaApi={setEmbla}
                align="start"
                dragFree
                withControls={false}>
                {filteredAds.map(item => (
                    <Carousel.Slide key={item.id} mt={'sm'} >
                        <Link href={`/ads/${item.id}`}>
                            <Card withBorder shadow="sm">
                                <Card.Section mt={'0'} ta={'center'}>
                                    {handleImageCarouselAds(item.image, item.title)}
                                </Card.Section>
                                <Text ta={'right'} mt={'5px'} lineClamp={1} fz={'md'}>{item.title}</Text>
                                <Flex align={'baseline'} justify={'space-between'}>
                                    
                                    {item.price ?
                                     <CardPartPrice tomanHeight={17} tomanWidth={17} textSize={16} isAds price={item.price} /> : 
                                     <Text c={'#25ac9e'} mb="xs" fz={'sm'} mt={'md'}>توافقی</Text>}

                                    <Flex>
                                        <Text ml={'2px'} fz={'xs'}>{formatJalaliTimeAgo(item.created_at)}</Text>
                                    </Flex>
                                </Flex>
                                <Flex justify={'flex-end'} mt='xs' align={'baseline'}>
                                    <IconFlag3 size={15} />
                                    <Text style={{ position: 'relative', bottom: '3px' }} mr={'3px'} ta={'left'} fz={'11.5px'}>{provinceTitleHandler(status, item.ostan, ostan)}</Text>
                                    <Text mr={'2px'}>,</Text>
                                    <Text style={{ position: 'relative', bottom: '3px' }} mr={'3px'} ta={'left'} fz={'11.5px'}>{cityTitleHandler(status, item.city, city)}</Text>
                                </Flex>
                            </Card>
                        </Link>
                    </Carousel.Slide>
                ))}
                {isFetchingAds && (
                    <Group mt={'md'} gap={'lg'}>
                        <Skeleton height={'270px'} width={'220px'} />
                        <Skeleton height={'270px'} width={'220px'} />
                        <Skeleton height={'270px'} width={'220px'} />
                    </Group>
                )}

            </Carousel>
        </Box>
    )
}

export default AdsRelated