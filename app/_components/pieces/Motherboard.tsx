"use client"

import React, { FC, useEffect, useState } from 'react';
import classes from './pieces.module.css'
import { Badge, Button, Card, Drawer, Flex, Grid, Group, Skeleton, Tabs, Text, Tooltip } from "@mantine/core";
import Image from "next/image";
import cardClasses from '../cardService/cardService.module.css'
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/_redux/store';
import { useDisclosure } from '@mantine/hooks';
import { Motherboard, useGetMotherboardsQuery } from '@/_redux/services/motherboardApi';
import { addselectedMotherboard, relatedCpuList } from '@/_redux/features/motherboard';
import { ObjectIsEmpty } from '@/_utils/utils';
import { Motherboard as MotherboardType } from '@/_redux/services/motherboardApi';
import { IconBuildingStore, IconExclamationCircle, IconListDetails, IconX } from '@tabler/icons-react';
import useLoading from '@/_utils/customHook/useLoading';
import Link from 'next/link';
import ShopsLink from './shared/ShopsLink';

export type ImotherboardProps = {
    setActiveMotherboard: React.Dispatch<React.SetStateAction<Partial<MotherboardType> | undefined>>
    activeMotherboard: Partial<MotherboardType> | undefined
}

const Motherboard: FC<ImotherboardProps> = ({ activeMotherboard, setActiveMotherboard }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const dispatch = useDispatch()
    const [motherboardSelected, setSelectedMotherboard] = useState<MotherboardType[]>()
    const loadingEnd = useLoading();


    const MotherboardListFromSelectedCpu = useSelector((state: RootState) => state.cpu.relatedMotherboards)
    const currentMotherboard = useSelector((state: RootState) => state.motherboard.selectedMotherboard, shallowEqual)
    const { isSuccess, data = [], error, isLoading } = useGetMotherboardsQuery({})
    useEffect(() => {
        if (loadingEnd) {
            setActiveMotherboard(currentMotherboard)
        }
    }, [loadingEnd, currentMotherboard])

    const selectedMotherboard = (id: number) => {
        const motherboard = data.find(el => el.id === id)
        if (motherboard) {
            dispatch(addselectedMotherboard(motherboard));
            relatedCpu(motherboard)
        }

        close()
    }

    const relatedCpu = (motherboard: Motherboard) => {
        dispatch(relatedCpuList(motherboard.cpus))
    }

    const removeSelected = (e: React.MouseEvent) => {
        e.stopPropagation()
        dispatch(addselectedMotherboard({}))
        dispatch(relatedCpuList([]))
    }
    useEffect(() => {

        setSelectedMotherboard(MotherboardListFromSelectedCpu.length ? MotherboardListFromSelectedCpu : data);
    }, [MotherboardListFromSelectedCpu, isSuccess])

    return (
        <>

            <div onClick={open} className={`${classes.pieces} ${cardClasses.cardMain}`}>
                {ObjectIsEmpty(currentMotherboard) ? (
                    <Flex className={classes.hoverCard} mb={'lg'} align={'center'} justify={'center'} direction={'column'}>
                        <Text ta={'center'} fz={"xl"}>انتخاب</Text>
                        <Text fw={"bold"}>motherboard</Text>
                        <Image className={classes.piecesImg} width={60} height={60} src={'/svg/motherboard.svg'} alt={'motherboard'} />
                    </Flex>
                ) : (
                    <Card style={{ padding: '0 35px', marginTop: '20px', width: '195px' }} radius="md" shadow='xs' >
                        <IconX onClick={removeSelected} size={18} style={{ position: 'absolute', right: '4px', top: '3px' }} />
                        <Card.Section style={{ textAlign: 'center' }} mt={'md'}>
                            {currentMotherboard.image && <Image alt={currentMotherboard.name ? currentMotherboard.name : ''} width={80} height={80} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${currentMotherboard.image}`} />}
                        </Card.Section>
                        <Flex direction={'column'} justify="center" align={'center'} mt="sm" mb="xs">
                            <Badge color="pink" variant="light">
                                {currentMotherboard.brand}
                            </Badge>
                            <Text fz={"sm"} mt={'md'}>{currentMotherboard.name}</Text>
                        </Flex>
                        {currentMotherboard.price ? <>
                            <Group gap={3} justify="center" align='center' mb="xs">
                                <Text fz={'xs'} ml={'2px'}>از</Text>
                                <Text fz={'xs'} fw={'bold'}>{Intl.NumberFormat('fa', {}).format(Number(currentMotherboard.price))}</Text>
                                <Image className={classes.tomanIcon} src={'/svg/toman.svg'} alt='kiwi part price' width={16} height={16} />
                            </Group>
                        </> : ''}

                    </Card>
                )}

                {ObjectIsEmpty(currentMotherboard) ? '' : (
                    <Tabs w={'100%'} onClick={(e) => e.stopPropagation()} className={classes.tabSection} defaultValue="info">
                        <Tabs.List>
                            <Tabs.Tab value="info" rightSection={<IconListDetails size={18} />}>
                                مشخصات
                            </Tabs.Tab>
                            <Tabs.Tab value="shop" rightSection={<IconBuildingStore size={18} />}>
                                فروشگاه
                            </Tabs.Tab>

                        </Tabs.List>

                        <Tabs.Panel value="info">
                            <Grid my={'md'}>
                                <Grid.Col className={classes.borderBottomDashed} span={6}><Text fz={'sm'}>سوکت پردازنده</Text></Grid.Col>
                                <Grid.Col className={classes.borderBottomDashed} span={6}><Text fw={'bold'} fz={'sm'}>{currentMotherboard.cpu_socket}</Text></Grid.Col>

                                <Grid.Col className={classes.borderBottomDashed} span={6}><Text fz={'sm'}>نوع RAM</Text></Grid.Col>
                                <Grid.Col className={classes.borderBottomDashed} span={6}><Text fw={'bold'} fz={'sm'}>{currentMotherboard.ddr3 ? 'DDR3' : currentMotherboard.ddr4 ? 'DDR4' : currentMotherboard.ddr5 ? 'DDR5' : 'نامشخص'} </Text></Grid.Col>

                                <Grid.Col className={classes.borderBottomDashed} span={6}><Text fz={'sm'}>تعداد اسلات RAM</Text></Grid.Col>
                                <Grid.Col className={classes.borderBottomDashed} span={6}><Text fw={'bold'} fz={'sm'}>{currentMotherboard.total_slot_ram}</Text></Grid.Col>

                                <Grid.Col className={classes.borderBottomDashed} span={6}><Text fz={'sm'}> ارتباط بیسیم</Text></Grid.Col>
                                <Grid.Col className={classes.borderBottomDashed} span={6}><Text fw={'bold'} fz={'sm'}> {currentMotherboard.wifi_support ? 'دارد' : 'ندارد'}</Text></Grid.Col>

                                {/* <Grid.Col className={classes.borderBottomDashed} span={6}><Text fz={'sm'}>فرکانس‌های رم قابل پشتیبانی</Text></Grid.Col>
                                    <Grid.Col className={`${classes.borderBottomDashed} ${classes.dFlex}`} span={6}>{currentMotherboard.attributes?.map(el => (
                                        <Tooltip
                                            key={el}
                                            withArrow
                                            transitionProps={{ duration: 400 }}
                                            label="خرید"
                                        >
                                            <Text className={classes.Badge} fw={'bold'} fz={'xs'}>{el}</Text>
                                        </Tooltip>
                                    ))}
                                        <Tooltip
                                            multiline
                                            w={420}
                                            withArrow
                                            transitionProps={{ duration: 400 }}
                                            label="در هنگام خرید رم به حداکثر فرکانس قابل پشتیبانی دقت کنید. درصورتی که رم با فرکانس بالاتر از مقدار گفته شده خریداری کنید فرکانس به حداکثر مقدار مادربرد بازگردانده میشود و عملا هزینه اضافی کرده‌اید "
                                        >
                                            <IconExclamationCircle color='green' />
                                        </Tooltip>
                                    </Grid.Col> */}
                                <Grid.Col className={classes.borderBottomDashed} span={6}><Text fz={'sm'}>سایز مادربرد</Text></Grid.Col>
                                <Grid.Col className={classes.borderBottomDashed} span={6}>
                                    <Flex align={'center'}>
                                        <Tooltip
                                            withArrow
                                            transitionProps={{ duration: 400 }}
                                            label="خرید قاب کیس"
                                        >
                                            <Text mt={'4px'} ml={'4px'} style={{ width: 'fit-content' }} fw={'bold'} fz={'sm'}>{currentMotherboard.size}</Text>
                                        </Tooltip>
                                        <Tooltip
                                            withArrow
                                            transitionProps={{ duration: 400 }}
                                            label="در هنگام خرید قاب کیس به سایز مادربرد دقت کنید"
                                        >
                                            <IconExclamationCircle color='green' />
                                        </Tooltip>
                                    </Flex>
                                </Grid.Col>
                            </Grid>
                        </Tabs.Panel>
                        <Tabs.Panel value="shop">
                            <ShopsLink currentPiece={currentMotherboard} />
                        </Tabs.Panel>
                    </Tabs>
                )}
            </div>

            <Drawer position={"bottom"} opened={opened} onClose={close} title="انتخاب motherboard">
                <Grid pb={'xl'}>
                    {isLoading ? Array(7).map((_, index) => (<Skeleton mx={'md'} height={'190px'} mt={6} width="190px" radius="md" key={index} />)) :
                        motherboardSelected?.map(el => (
                            <Grid.Col key={el.id} span={{ base: 6, sm: 4, md: 2 }}>
                                <Card onClick={() => selectedMotherboard(el.id)} className={cardClasses.hoverCard}
                                    style={{ padding: '0  10px' }} radius="md" withBorder>
                                    <Card.Section style={{ textAlign: 'center' }} mt={'md'}>
                                        {el.image && <Image alt={el.name} width={80} height={80} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${el.image}`} />}
                                    </Card.Section>
                                    <Flex direction={'column'} justify="center" align={'center'} mt="sm" mb="xs">
                                        <Text h={40} ta={'center'} fz={"sm"}>{el.name}</Text>
                                    </Flex>
                                    {el.price ? <>
                                        <Group gap={3} justify="center" align='center' mb="xs">
                                            <Text fz={'xs'} ml={'2px'}>از</Text>
                                            <Text fz={'xs'} fw={'bold'}>{Intl.NumberFormat('fa', {}).format(Number(el.price))}</Text>
                                            <Image className={classes.tomanIcon} src={'/svg/toman.svg'} alt='kiwi part price' width={16} height={16} />
                                        </Group>
                                    </> : ''}
                                </Card>
                            </Grid.Col>
                        ))
                    }
                </Grid>
            </Drawer>
        </>
    );
};

export default Motherboard;
