 "use client"

import { Carousel, Embla } from '@mantine/carousel'
import { Box, Button, Container, Flex, Grid } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import SVG from "react-inlinesvg"
import { ArticleCard } from './ArticleCard'
import classess from './Article.module.css'

const ArticleSection = () => {
    const [embla, setEmbla] = useState<Embla | null>(null);

    useEffect(() => {
        if (embla) {
            embla?.reInit({ direction: 'rtl' })
        }
    }, [embla]);


    return (
        <Container mt={'50px'} mb={'80px'} size="lg">
            
            <Grid classNames={{ inner: classess.articleGrid }} w={'100%'}>
                <Grid.Col span={{ base: 12, md: 5 }}>
                    <SVG
                        className={classess.articleSvg}
                        loader={<Box component='div'></Box>}
                        src='/svg/article.svg' />
                    <Flex align={'center'} justify={'center'} mt={'sm'}>
                        <Button variant='gradient' gradient={{ from: ' rgb(14,163,93)', to: ' rgb(12,119,115)', deg: 90 }}>مشاهده تمام مقالات</Button>
                    </Flex>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 7 }}>
                    <div style={{ direction: 'rtl' }}>
                        <Carousel
                            align="start"
                            slideSize={{ base: '100%', sm: '47%' }}
                            slideGap={{ base: 0, sm: 'xl' }}
                            getEmblaApi={setEmbla}
                            height={345}
                            withControls={false}>
                            <Carousel.Slide>
                                <ArticleCard />
                            </Carousel.Slide>
                            <Carousel.Slide>
                                <ArticleCard />
                            </Carousel.Slide>
                            <Carousel.Slide>
                                <ArticleCard />
                            </Carousel.Slide>
                            <Carousel.Slide>
                                <ArticleCard />
                            </Carousel.Slide>
                        </Carousel>
                    </div>

                </Grid.Col>
            </Grid>
        </Container>
    )
}

export default ArticleSection