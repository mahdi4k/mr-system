"use client"

import { Button, Card, Container, Flex, Group, Modal, SimpleGrid, Skeleton, Tabs, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import usePcparts from '@/_utils/customHook/usePcParts'
import { Carousel, Embla } from '@mantine/carousel'
import CardPartPrice from '../shared/CardPartPrice'
import { IconFlag3, IconSquarePlus2 } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import LoginModal from '../loginModal/LoginModal'
import { useRouter } from 'next/navigation'
import { useLazyGetAdsListCategoryQuery } from '@/_redux/services/adsApi'
import { cityTitleHandler, formatJalaliTimeAgo, provinceTitleHandler } from '@/_utils/utils'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from "@/_redux/store";
import { fetchCity, fetchOstan } from '@/_redux/features/ads'
import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit'

type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;


const AdsSection = ({ token }: { token?: string }) => {
    const [embla, setEmbla] = useState<Embla | null>(null);
    const [opened, { open, close }] = useDisclosure(false);
    const router = useRouter();
    const parts = usePcparts();
    const [successLogin, setSuccessLogin] = useState(false);
    const [activeTab, setActiveTab] = useState<string | null>('cpu');

    const [adsQuery, { data: adsData, isSuccess: isSuccessAds, isLoading, isFetching: isFetchingAds }] = useLazyGetAdsListCategoryQuery()

    const dispatch: AppDispatch = useDispatch();
    const { ostan, city, status } = useSelector((state: RootState) => state.ads);


    useEffect(() => {
        if (!ostan.length) {
            dispatch(fetchOstan());
        }
        if (!city.length) {
            dispatch(fetchCity());
        }
    }, [ostan, city, dispatch]);

    useEffect(() => {
        if (embla) {
            embla?.reInit({ direction: 'rtl' })
        }
    }, [embla]);

    const handleAddAdsPage = () => {
        if (token || successLogin) {
            router.push('/ads/create', { scroll: true })
        } else {
            open()
        }
    }
    useEffect(() => {
        if (activeTab)
            adsQuery({ category: activeTab })
    }, [activeTab])



    const handleImageAds = (image: string | undefined, title: string) => {
        if (image) {
            const images: string[] = JSON.parse(image);
            return (
                <Image
                    alt={title}
                    style={{ borderRadius: '7px' }}
                    width={190}
                    height={180}
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${images[0]}`}
                />
            );

        } else {
            return (
                <></>
            )
        }
    }
    return (
        <Container mt={'100px'} my={'xl'} size="lg">
            <Flex justify={'space-between'}>
                <Text>آگهی قطعات</Text>
                <Link href={'/ads'}>
                    <Button color='green' variant='outline'>مشاهده همه</Button>
                </Link>
            </Flex>
            <Tabs variant='default' color='teal' styles={{ tab: { minWidth: '90px' } }} defaultValue={activeTab} onChange={setActiveTab}>
                <Tabs.List>
                    {parts.map(part => (
                        <Tabs.Tab key={part.name} value={part.name} leftSection={<Image width={20} height={20} src={part.svg} alt={part.title} />}>
                            {part.title}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>

                <Tabs.Panel style={{ direction: 'rtl' }} value={activeTab as string}>
                    <Carousel
                        slideSize={{ base: '52%', lg: '21%' }}
                        slideGap={{ base: 'sm', sm: 'md' }}
                        getEmblaApi={setEmbla}
                        align="start"
                        dragFree
                        withControls={false}>
                        <Carousel.Slide mt={'sm'} >
                            <Card onClick={handleAddAdsPage} styles={{ root: { borderStyle: "dashed", cursor: 'pointer' } }} h={'340px'} withBorder>
                                <Card.Section h={'100%'} mt={'0'} ta={'center'}>
                                    <Flex h={'100%'} align={'center'} justify={'center'} direction={'column'}>
                                        <IconSquarePlus2 style={{ marginTop: '20px' }} color='var(--mantine-color-kiwi-7)' size={77} />
                                        <Text my={'lg'} ta={'center'} lineClamp={1} c={'gr'} fz={'sm'}>افزودن آگهی</Text>
                                    </Flex>
                                </Card.Section>
                            </Card>
                        </Carousel.Slide>
                        {adsData && !isFetchingAds && isSuccessAds && adsData.data.map(item => (
                            <Carousel.Slide key={item.id} mt={'sm'} >
                                <Link href={`/ads/${item.id}`}>
                                    <Card withBorder shadow="sm">
                                        <Card.Section mt={'0'} ta={'center'}>
                                            {handleImageAds(item.image, item.title)}
                                        </Card.Section>
                                        <Text ta={'right'} mt={'5px'} lineClamp={1} fz={'md'}>{item.title}</Text>
                                        <Flex align={'baseline'} justify={'space-between'}>
                                            <CardPartPrice isAds price={item.price} />
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
                                <Skeleton height={'340px'} width={'220px'} />
                                <Skeleton height={'340px'} width={'220px'} />
                                <Skeleton height={'340px'} width={'220px'} />
                            </Group>

                        )}

                    </Carousel>
                </Tabs.Panel>

                <Tabs.Panel value="messages">
                    Messages tab content
                </Tabs.Panel>

                <Tabs.Panel value="settings">
                    Settings tab content
                </Tabs.Panel>
            </Tabs>

            <Modal opened={opened} onClose={close} title="ورود / ثبت نام" >
                <LoginModal setSuccessLogin={setSuccessLogin} close={close} />
            </Modal>
        </Container>
    )
}

export default AdsSection