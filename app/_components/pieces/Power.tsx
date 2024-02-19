"use client"

import React, { FC, useEffect, useState } from 'react';
import classes from "./pieces.module.css";
import { Badge, Card, Drawer, Flex, Grid, Group, Tabs, Text, Tooltip } from "@mantine/core";
import Image from "next/image";
import cardClasses from "../cardService/cardService.module.css";
import { useDisclosure } from "@mantine/hooks";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/_redux/store';
import { ObjectIsEmpty } from '@/_utils/utils';
import { IconBuildingStore, IconExclamationCircle, IconListDetails, IconX } from '@tabler/icons-react';
import useLoading from '@/_utils/customHook/useLoading';
import { Graphic } from '@/_redux/services/graphicApi';
import { POWER, useGetPowersQuery } from '@/_redux/services/powerApi';
import { addselectedPower, relatedGraphicList } from '@/_redux/features/power';

export type IPowerProps = {
    setActivePower:  React.Dispatch<React.SetStateAction<Partial<POWER> | undefined>>
    activePower: Partial<Graphic> | undefined
}
const Power : FC<IPowerProps> = ({setActivePower,activePower}) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [powerSelected, setSelectedPower] = useState<POWER[]>()
    const dispatch = useDispatch()
    const loadingEnd  = useLoading();

    
     
    const powerListFromSelectedGraphic = useSelector((state: RootState) => state.graphic.relatedPowers);
    const { isSuccess, data = [], error, } = useGetPowersQuery();
    const currentPower = useSelector((state: RootState) => state.power.selectedPower);
    const selectedGraphic = useSelector((state: RootState) => state.graphic.selectedGraphic);
    useEffect(()=>{
        if(loadingEnd){
            setActivePower(currentPower)
        }
    },[loadingEnd,currentPower])
    const selectedPower = (id: number) => {
        const power = data.find(el => el.id === id)
        if (power) {
            dispatch(addselectedPower(power))
            relatedGraphic(power)
        }
        close()
    }

    const relatedGraphic = (power: POWER) => {
        dispatch(relatedGraphicList(power.graphics))
    }

    const removeSelected = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(addselectedPower({}))
        dispatch(relatedGraphicList([]))
    }
    const titleDrawer = () => {
        return (
            ObjectIsEmpty(selectedPower) ? 'لیست کارت گرافیک' :
                <Flex align={'center'} justify={'center'}>
                    لیست پاور سازگار با کارت گرافیک
                    <Text mr={'sm'} fw={'bolder'}> {selectedPower.name}</Text>
                </Flex>
        )
    }
    useEffect(() => {
        setSelectedPower(powerListFromSelectedGraphic.length ? powerListFromSelectedGraphic : data);
    }, [powerListFromSelectedGraphic, isSuccess])


    return (
        <>
            <div onClick={open} className={`${classes.pieces} ${cardClasses.cardMain}`}>
                {ObjectIsEmpty(currentPower) ? (
                    <Flex className={classes.hoverCard} mb={'lg'} align={'center'} justify={'center'} direction={'column'}>
                        <Text ta={'center'} fz={"xl"}>انتخاب</Text>
                        <Text fw={"bold"}>پاور</Text>
                        <Image style={{bottom:'5px'}} className={classes.piecesImg} width={110} height={95} src={'/svg/power.svg'} alt={'power'} />
                    </Flex>
                ) : (
                    <Card style={{ padding: '0 35px', marginTop: '20px', width: '195px' }} radius="md" shadow='md'>
                        <IconX onClick={removeSelected} size={18} style={{ position: 'absolute', right: '4px', top: '3px' }} />
                        <Card.Section style={{ textAlign: 'center' }} mt={'md'}>
                            {currentPower.image && <Image alt={currentPower.name ? currentPower.name : ''} width={75} height={85} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${currentPower.image}`} />}
                        </Card.Section>
                        <Flex direction={'column'} justify="center" align={'center'} mt="sm" mb="xs">
                            <Badge color="pink" variant="light">
                                {currentPower.manufacturer}
                            </Badge>
                            <Text fz={"sm"} mt={'md'}>{currentPower.name}</Text>
                        </Flex>
                    </Card>
                )}

                {ObjectIsEmpty(currentPower) ? '' : (
                    <Tabs onClick={(e) => e.stopPropagation()} className={classes.tabSection} defaultValue="info">
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
                                <Grid.Col className={classes.borderBottomDashed} span={6}><Text fz={'sm'}>گرافیک مجتمع</Text></Grid.Col>
                                <Grid.Col className={classes.borderBottomDashed} span={6}><Text fw={'bold'} fz={'sm'}>{currentPower.brand}</Text></Grid.Col>

                                <Grid.Col className={classes.borderBottomDashed} span={6}><Text fz={'sm'}>نسل رم قابل پشتیبانی</Text></Grid.Col>
                                <Grid.Col className={classes.borderBottomDashed} span={6}>
                                    <Flex align={'center'}>
                                        <Text mt={'4px'} ml={'4px'} style={{ width: 'fit-content' }} fw={'bold'} fz={'sm'}> DDR4</Text>
                                        <Text mt={'4px'} ml={'4px'} style={{ width: 'fit-content' }} fw={'bold'} fz={'sm'}> DDR3</Text>
                                    </Flex>
                                </Grid.Col>
                                <Grid.Col className={classes.borderBottomDashed} span={6}><Text fz={'sm'}>فرکانس‌های رم قابل پشتیبانی</Text></Grid.Col>
                                <Grid.Col className={`${classes.borderBottomDashed} ${classes.dFlex}`} span={6}>{currentPower.attributes?.map(el => (
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
                                        label="در هنگام خرید رم به حداکثر فرکانس قابل پشتیبانی دقت کنید. درصورتی که رم با فرکانس بالاتر از مقدار گفته شده خریداری کنید فرکانس به حداکثر مقدار مادربورد بازگردانده میشود و عملا هزینه اضافی کرده‌اید "
                                    >
                                        <IconExclamationCircle color='green' />
                                    </Tooltip>
                                </Grid.Col>

                            </Grid>
                        </Tabs.Panel>
                        <Tabs.Panel value="shop">
                            Messages tab content
                        </Tabs.Panel>
                    </Tabs>
                )}
            </div>
            <Drawer position={"bottom"} opened={opened} onClose={close} title={titleDrawer()}>

                <Group>
                    {
                        powerSelected?.map(el => (
                            <Card onClick={() => selectedPower(el.id)} key={el.id} className={cardClasses.hoverCard}
                                style={{ padding: '0 45px' }} radius="md" withBorder>
                                <Card.Section style={{ textAlign: 'center' }} mt={'md'}>

                                    {el.image && <Image alt={el.name} width={80} height={80} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${el.image}`} />}

                                </Card.Section>

                                <Flex direction={'column'} justify="center" align={'center'} mt="sm" mb="xs">
                                    <Badge color="pink" variant="light">
                                        {el.brand}
                                    </Badge>
                                    <Text fz={"sm"} mt={'md'}>{el.name}</Text>
                                </Flex>
                            </Card>
                        ))
                    }
                </Group>
            </Drawer>
        </>

    );
};

export default Power;

