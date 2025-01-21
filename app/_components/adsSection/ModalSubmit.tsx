"use client"

import { Alert, Box, Button, Flex, Modal, Text, ThemeIcon } from '@mantine/core'
import { IconCircleCheckFilled } from '@tabler/icons-react'
import React, { FC, useEffect } from 'react'
import SVG from "react-inlinesvg"
import classess from './ads.module.css'
import anime from 'animejs';
import Link from 'next/link'

type Props = {
    opened: boolean
    close: () => void
}

const ModalSubmit: FC<Props> = ({ opened, close }) => {
    useEffect(() => {
        const icons_x_offset = -50;
        const icons_fadeout_delay = 400;
        const checkmark_delay = 2200;

        setTimeout(() => {
            const tl = anime.timeline({
                autoplay: true,
                loop: false,
            });

            tl.add({ targets: '#phone', opacity: [0, 1], easing: 'easeInQuad', duration: 200 }, 50)

                .add({ targets: '#apps', opacity: [0, 1], easing: 'easeInQuad', duration: 200 }, '-=100')
                .add({
                    targets: '#apps',
                    transformOrigin: ['50% 50% 0px', '50% 50% 0px'],
                    opacity: { value: [1, 0], delay: icons_fadeout_delay, duration: 300 },
                    easing: 'easeInQuad',
                    translateY: [-20, 220],
                    translateX: { value: [icons_x_offset, 0], delay: 50 },
                    duration: 500

                }, '-=500')


                .add({
                    targets: '#phone',
                    transformOrigin: ['50% 50% 0px', '50% 50% 0px'],
                    easing: 'easeInOutQuad',
                    rotate: [-8, 0],
                    duration: 1000
                }, '-=1400')

                .add({
                    targets: '#Line',
                    // transformOrigin: ['50% 50% 0px', '50% 50% 0px'],
                    // scale:[0.001, 1],
                    strokeDashoffset: [anime.setDashoffset, 0],
                    duration: 600,
                    easing: 'easeInOutSine',
                }, '-=500')

                //-------------------------------checkmark animation --------------------------------


                .add({
                    targets: '#checkmark_group',
                    transformOrigin: ['50% 50% 0px', '50% 50% 0px'],
                    scale: [0, 1],
                    rotate: [190, 0],
                    opacity: [0, 1],
                    easing: 'easeOutExpo',
                    translateY: 50,
                    duration: 3000

                }, checkmark_delay)


                .add({
                    targets: '#Line_2',
                    // transformOrigin: ['50% 50% 0px', '50% 50% 0px'],
                    // scale:[0.001, 1],
                    strokeDashoffset: [anime.setDashoffset, 0],
                    duration: 500,
                    easing: 'easeInOutSine',
                }, checkmark_delay)

                //-------------------------------bells & stars animation --------------------------------
                .add({
                    targets: '#bell_1',
                    transformOrigin: ['50% 50% 0px', '50% 50% 0px'],
                    translateY: [5, 0],
                    translateX: [70, 0],
                    opacity: {
                        value: [0, 1],
                        delay: 50,
                    },
                    duration: 800,

                }, 1450)

                .add({
                    targets: '#bell_2',
                    transformOrigin: ['50% 50% 0px', '50% 50% 0px'],
                    translateY: [5, 0],
                    translateX: [70, 0],
                    opacity: {
                        value: [0, 1],
                        delay: 50,
                    },
                    duration: 800,

                }, 1400)

                .add({
                    targets: ['#bell_stroke_1', '#bell_stroke_2', '#bell_stroke_3',],
                    strokeDashoffset: [anime.setDashoffset, 0],
                    duration: 300,
                    easing: 'easeOutQuad',

                }, 1600)


                .add({
                    targets: ['#bell_stroke_4', '#bell_stroke_5', '#bell_stroke_6',],
                    strokeDashoffset: [anime.setDashoffset, 0],
                    duration: 300,
                    easing: 'easeOutQuad',

                }, 1700)



                .add({
                    targets: '#bell_circ_1',
                    transformOrigin: ['60% 100% 0px', '20% 50% 0px'],
                    //rotate:[ 90,0],
                    translateY: [20, 0],
                    translateX: [-5, 0],
                    opacity: {
                        value: [0, 1],
                        //delay:10,
                    },
                    duration: 400,
                    easing: 'easeOutQuad',

                }, 1700)

                .add({
                    targets: '#bell_circ_2',
                    transformOrigin: ['60% 100% 0px', '20% 50% 0px'],
                    //rotate:[ 90,0],
                    translateY: [20, 0],
                    translateX: [15, 0],
                    opacity: {
                        value: [0, 1],
                        //delay:10,
                    },
                    duration: 400,
                    easing: 'easeOutQuad',

                }, 1700)


                .add({
                    targets: '#bell_circ_3',
                    transformOrigin: ['60% 100% 0px', '20% 50% 0px'],
                    //rotate:[ 90,0],
                    translateY: [5, 0],
                    translateX: [15, 0],
                    opacity: {
                        value: [0, 1],
                        //delay:10,
                    },
                    duration: 400,
                    easing: 'easeOutQuad',

                }, 1700)


                .add({
                    targets: '#bell_circ_4',
                    transformOrigin: ['60% 100% 0px', '20% 50% 0px'],
                    //rotate:[ 90,0],
                    translateY: [5, 0],
                    translateX: [15, 0],
                    opacity: {
                        value: [0, 1],
                        //delay:10,
                    },
                    duration: 400,
                    easing: 'easeOutQuad',

                }, 1800)

                .add({
                    targets: '#bell_circ_5',
                    transformOrigin: ['60% 100% 0px', '20% 50% 0px'],
                    //rotate:[ 90,0],
                    translateY: [5, 0],
                    translateX: [15, 0],
                    opacity: {
                        value: [0, 1],
                        //delay:10,
                    },
                    duration: 400,
                    easing: 'easeOutQuad',

                }, 1800)


                .add({
                    targets: '#bell_circ_6',
                    transformOrigin: ['60% 100% 0px', '20% 50% 0px'],
                    //rotate:[ 90,0],
                    translateY: [5, 0],
                    translateX: [15, 0],
                    opacity: {
                        value: [0, 1],
                        //delay:10,
                    },
                    duration: 500,
                    easing: 'easeOutQuad',

                }, 1800)






                .add({
                    targets: '#bell_circ_7',
                    transformOrigin: ['60% 100% 0px', '20% 50% 0px'],
                    //rotate:[ 90,0],
                    translateY: [30, 0],
                    translateX: [40, 0],
                    opacity: {
                        value: [0, 1],
                        //delay:10,
                    },
                    duration: 400,
                    easing: 'easeOutQuad',

                }, 1700)

                .add({
                    targets: '#bell_circ_8',
                    transformOrigin: ['60% 100% 0px', '20% 50% 0px'],
                    //rotate:[ 90,0],
                    translateY: [30, 0],
                    translateX: [-5, 0],
                    opacity: {
                        value: [0, 1],
                        //delay:10,
                    },
                    duration: 700,
                    easing: 'easeOutQuad',

                }, 1700)

                .add({
                    targets: '#bell_circ_9',
                    transformOrigin: ['60% 100% 0px', '20% 50% 0px'],
                    //rotate:[ 90,0],
                    translateY: [30, 0],
                    translateX: [30, 0],
                    opacity: {
                        value: [0, 1],
                        //delay:10,
                    },
                    duration: 400,
                    easing: 'easeOutQuad',

                }, 1700)


                .add({
                    targets: '#bell_circ_10',
                    transformOrigin: ['60% 100% 0px', '20% 50% 0px'],
                    //rotate:[ 90,0],
                    translateY: [10, 0],
                    translateX: [-30, 0],
                    opacity: {
                        value: [0, 1],
                        //delay:10,
                    },
                    duration: 400,
                    easing: 'easeOutQuad',

                }, 1800)


                .add({
                    targets: '#bell_circ_11',
                    transformOrigin: ['60% 100% 0px', '20% 50% 0px'],
                    //rotate:[ 90,0],
                    translateY: [10, 0],
                    translateX: [-30, 0],
                    opacity: {
                        value: [0, 1],
                        //delay:10,
                    },
                    duration: 500,
                    easing: 'easeOutQuad',

                }, 1850)

                .add({
                    targets: '#bell_circ_12',
                    transformOrigin: ['60% 100% 0px', '20% 50% 0px'],
                    //rotate:[ 90,0],
                    translateY: [10, 0],
                    translateX: [-30, 0],
                    opacity: {
                        value: [0, 1],
                        //delay:10,
                    },
                    duration: 600,
                    easing: 'easeOutQuad',

                }, 1900)


                .add({
                    targets: '#star_1',
                    transformOrigin: ['90% 100% 0px', '50% 50% 0px'],
                    rotate: [180, 0],
                    //translateY: [20,0], 
                    //translateX: [20,0], 
                    opacity: {
                        value: [0, 1],
                        delay: 20,
                        duration: 500
                    },
                    duration: 1000,
                    easing: 'easeOutQuad',

                }, 1700)


                .add({
                    targets: '#star_2',
                    transformOrigin: ['50% 60% 0px', '50% 50% 0px'],
                    rotate: [-250, 0],
                    //translateY: [20,0], 
                    //translateX: [20,0], 
                    opacity: {
                        value: [0, 1],
                        delay: 20,
                        duration: 500
                    },
                    duration: 800,
                    easing: 'easeOutQuad',

                }, 1750)



                .add({
                    targets: '#star_3',
                    transformOrigin: ['10% 10% 0px', '50% 50% 0px'],
                    rotate: [-250, 0],
                    //translateY: [20,0], 
                    //translateX: [20,0], 
                    opacity: {
                        value: [0, 1],
                        delay: 20,
                        duration: 500
                    },
                    duration: 1000,
                    easing: 'easeOutQuad',

                }, 1800)



                .add({
                    targets: '#line_1',
                    transformOrigin: ['10% 10% 0px', '50% 50% 0px'],

                    translateY: [50, 0],
                    translateX: [5, 0],
                    opacity: {
                        value: [0, 1],
                        delay: 20,
                        duration: 200
                    },
                    duration: 500,


                }, 1800)

                .add({
                    targets: '#line_3',
                    transformOrigin: ['10% 10% 0px', '50% 50% 0px'],

                    translateY: [40, 0],
                    //translateX: [15,0], 
                    opacity: {
                        value: [0, 1],
                        delay: 20,
                        duration: 200
                    },
                    duration: 500,


                }, 1850)


                .add({
                    targets: '#line_2',
                    transformOrigin: ['10% 10% 0px', '50% 50% 0px'],

                    translateY: [20, 0],
                    translateX: [-50, 0],
                    opacity: {
                        value: [0, 1],
                        delay: 20,
                        duration: 200
                    },
                    duration: 500,


                }, 1900)
                //-------------------------------bg lines animation --------------------------------


                .add({
                    targets: ['#bgline_1', '#bgline_2', '#bgline_3', '#bgline_4', '#bgline_5'],
                    // transformOrigin: ['50% 50% 0px', '50% 50% 0px'],
                    // scale:[0.001, 1],
                    strokeDashoffset: [anime.setDashoffset, 0],
                    opacity: [0, 1],
                    duration: 1500,
                    easing: 'easeOutSine',
                    //endDelay:2500,
                }, 1000)
        }, 80);
    }, [opened])

    return (
        <div>
            <Modal
                styles={{ body: { padding: '0' } }} transitionProps={{ transition: 'pop' }} size={'lg'} opened={opened} onClose={close} title={<Text fz={'xl'}>آگهی در صف تایید</Text>}>
                <Flex pt={'30px'} align={'center'} direction={'column'} justify={'center'}>

                    <SVG
                        className={classess.successSvg}
                        loader={<Box component='div'></Box>}
                        src='/svg/success.svg' />
                    <Flex wrap={'wrap'} pb={'lg'} mt={'xl'} align={'center'} justify={'center'}>
                        <Text px={'lg'} ta={'center'}>آگهی شما با موفقیت ثبت شد و به زودی در سایت منتشر خواهد شد.</Text>
                        <ThemeIcon size={'30px'} variant='transparent' color="teal">
                            <IconCircleCheckFilled size={30} />
                        </ThemeIcon>
                    </Flex>
                    <Flex mt={'sm'} mb={'xl'}>
                        <Link href={'/profile/ads'}>
                            <Button gradient={{ from: 'teal', to: 'green', deg: 90 }} mb={'lg'} radius={'xl'} size='md' variant='gradient'>مشاهده لیست آگهی‌های من</Button>
                        </Link>
                    </Flex>
                </Flex>

            </Modal>


        </div>
    )
}

export default ModalSubmit