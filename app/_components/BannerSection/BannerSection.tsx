import { Container, Title, Box, Flex, Text } from '@mantine/core'
import { IconBrandTelegram } from '@tabler/icons-react'
import React from 'react'
import bannerClasses from "./banner.module.css"
import SVG from "react-inlinesvg"

const BannerSection = () => {
    return (
        <Container styles={{ root: { flex: '1 0 auto' } }} size={'lg'}>

            <div className={bannerClasses.wrapper}>
                <div className={bannerClasses.body}>
                    <Title className={bannerClasses.title}>به راهنمایی بیشتری نیاز دارید؟
                    </Title>

                    <Text fz="md" c="dimmed">
                        در کانال و گروه کیوی پارت میتونید هرگونه سوال و یا مشکلی در انتخاب قطعات داشتید از ما سوال کنید✌️
                    </Text>

                    <div className={bannerClasses.controls}>

                        <button className={bannerClasses.bannerBtn}>
                            <Flex align={'center'} justify={'center'}>
                                <Text ml={'5px'}>
                                    ورود به کانال تلگرام
                                </Text>
                                <IconBrandTelegram color='#24A1DE' size={'20px'} />
                            </Flex>
                        </button>

                    </div>
                </div>

                <SVG
                    className={bannerClasses.image}
                    loader={<Box component='div' w={507} h={300}></Box>}

                    src='/svg/bannerRow.svg' />
            </div>
        </Container>
    )
}

export default BannerSection