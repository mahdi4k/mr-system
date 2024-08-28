"use client"

import { Button, Card, Container, Flex, Modal, SimpleGrid, Tabs, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import usePcparts from '@/_utils/customHook/usePcParts'
import { Carousel, Embla } from '@mantine/carousel'
import CardPartPrice from '../shared/CardPartPrice'
import { IconFlag3, IconSquarePlus2 } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import LoginModal from '../loginModal/LoginModal'
import { useRouter } from 'next/navigation'

const AdsSection = ({ token }: { token?: string }) => {
    const [embla, setEmbla] = useState<Embla | null>(null);
    const [opened, { open, close }] = useDisclosure(false);
    const router = useRouter()
    const parts = usePcparts()
    const [successLogin, setSuccessLogin] = useState(false)
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

 
    return (
        <Container mt={'100px'} my={'xl'} size="lg">
            <Flex justify={'space-between'}>
                <Text>آگهی قطعات</Text>
                <Button variant='outline'>مشاهده همه</Button>
            </Flex>
            <Tabs variant='default' color='teal' styles={{ tab: { minWidth: '90px' } }} defaultValue="cpu">
                <Tabs.List>
                    {parts.map(part => (
                        <Tabs.Tab key={part.name} value={part.name} leftSection={<Image width={20} height={20} src={part.svg} alt={part.title} />}>
                            {part.title}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>

                <Tabs.Panel style={{ direction: 'rtl' }} value="cpu">
                    <Carousel
                        slideSize={{ base: '22%' }}
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
                        <Carousel.Slide mt={'sm'} >
                            <Card withBorder shadow="sm">
                                <Card.Section mt={'0'} ta={'center'}>
                                    <Image width={130}
                                        src="/svg/case.svg"
                                        height={130}
                                        alt="Norway"
                                    />
                                </Card.Section>
                                <Text ta={'right'} lineClamp={1} fz={'sm'}>مادربرد asus h610mk d5 wifi</Text>
                                <Flex align={'baseline'} justify={'space-between'}>
                                    <CardPartPrice isAds price={'200000000'} />
                                    <Flex>
                                        <Text ml={'2px'} fz={'xs'}>همین الان</Text>
                                    </Flex>
                                </Flex>
                                <Flex justify={'flex-end'} align={'baseline'}>
                                    <IconFlag3 size={15} />
                                    <Text style={{ position: 'relative', bottom: '3px' }} ta={'left'} fz={'sm'}>یزد</Text>
                                </Flex>
                            </Card>
                        </Carousel.Slide>
                        <Carousel.Slide mt={'sm'} >
                            <Card withBorder shadow="sm">
                                <Card.Section mt={'0'} ta={'center'}>
                                    <Image width={130}
                                        src="/svg/case.svg"
                                        height={130}
                                        alt="Norway"
                                    />
                                </Card.Section>
                                <Text ta={'right'} lineClamp={1} fz={'sm'}>مادربرد asus h610mk d5 wifi</Text>
                                <Flex align={'baseline'} justify={'space-between'}>
                                    <CardPartPrice isAds price={'200000000'} />
                                    <Flex>
                                        <Text ml={'2px'} fz={'xs'}>همین الان</Text>
                                    </Flex>
                                </Flex>
                                <Flex justify={'flex-end'} align={'baseline'}>
                                    <IconFlag3 size={15} />
                                    <Text style={{ position: 'relative', bottom: '3px' }} ta={'left'} fz={'sm'}>یزد</Text>
                                </Flex>
                            </Card>
                        </Carousel.Slide>
                        <Carousel.Slide mt={'sm'}  >
                            <Card withBorder shadow="sm">
                                <Card.Section mt={'0'} ta={'center'}>
                                    <Image width={130}
                                        src="/svg/case.svg"
                                        height={130}
                                        alt="Norway"
                                    />
                                </Card.Section>
                                <Text ta={'right'} lineClamp={1} fz={'sm'}>مادربرد asus h610mk d5 wifi</Text>
                                <Flex align={'baseline'} justify={'space-between'}>
                                    <CardPartPrice isAds price={'200000000'} />
                                    <Flex>
                                        <Text ml={'2px'} fz={'xs'}>همین الان</Text>
                                    </Flex>
                                </Flex>
                                <Flex justify={'flex-end'} align={'baseline'}>
                                    <IconFlag3 color='green' size={15} />
                                    <Text style={{ position: 'relative', bottom: '3px' }} ta={'left'} fz={'sm'}>یزد</Text>
                                </Flex>
                            </Card>
                        </Carousel.Slide>
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