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
import { Province } from '(routes)/ads/create/page'
import { formatJalaliTimeAgo } from '@/_utils/utils'



const AdsSection = ({ token }: { token?: string }) => {
    const [embla, setEmbla] = useState<Embla | null>(null);
    const [opened, { open, close }] = useDisclosure(false);
    const router = useRouter();
    const parts = usePcparts();
    const [successLogin, setSuccessLogin] = useState(false);
    const [activeTab, setActiveTab] = useState<string | null>('cpu');
    const [provinces, setProvinces] = useState<Province[]>([]);


    const [adsQuery, { data: adsData, isSuccess: isSuccessAds, isLoading, isFetching: isFetchingAds }] = useLazyGetAdsListCategoryQuery()


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
    useEffect(() => {
        // Fetch provinces and cities data from public folder
        const fetchProvincesAndCities = async () => {
            const provincesResponse = await fetch('/provinces.json');
            const provincesData: Province[] = await provincesResponse.json();
            setProvinces(provincesData);
        };
        fetchProvincesAndCities();
    }, []);


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
    const provinceTitleHandler = (item: string) => {
        const province = provinces.find(province => province.id == Number(item))
        return province?.name
    }
    return (
        <Container mt={'100px'} my={'xl'} size="lg">
            <Flex justify={'space-between'}>
                <Text>آگهی قطعات</Text>
                <Button variant='outline'>مشاهده همه</Button>
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
                            <Card onClick={handleAddAdsPage} styles={{ root: { borderStyle: "dashed", cursor: 'pointer' } }} h={270} withBorder shadow="sm">
                                <Card.Section h={'100%'} mt={'0'} ta={'center'}>
                                    <Flex h={'100%'} align={'center'} justify={'center'} direction={'column'}>
                                        <IconSquarePlus2 style={{ marginTop: '20px' }} color='var(--mantine-color-kiwi-7)' size={77} />
                                        <Text my={'lg'} ta={'center'} lineClamp={1} c={'gr'} fz={'sm'}>افزودن آگهی</Text>
                                    </Flex>
                                </Card.Section>
                            </Card>
                        </Carousel.Slide>
                        {adsData && !isFetchingAds && adsData.map(item => (
                            <Carousel.Slide key={item.id} mt={'sm'} >
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
                                        <Text style={{ position: 'relative', bottom: '3px' }} mr={'3px'} ta={'left'} fz={'13px'}>{provinceTitleHandler(item.ostan)}</Text>
                                    </Flex>
                                </Card>
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