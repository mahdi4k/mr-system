import { Grid, Flex, Group, Button, Text } from '@mantine/core'
import Link from 'next/link'
import Image from 'next/image';
import classes from '@/_cssModules/PcSection.module.css'
import React from 'react'
import TabsSection from './components/TabsSection';
import { CASE } from '@/_redux/services/caseApi';
import { useGetGraphicsQuery } from '@/_redux/services/graphicApi';
import SingleProductImage from './components/SingleProductImage';

const CaseSingle = ({ product }: { product: CASE }) => {
    const torobLink = JSON.parse(product.links)[0];
    const EmallsLink = JSON.parse(product.links)[1];

    const { data : graphics } = useGetGraphicsQuery({})
    return (
        <>
            <Grid mt={'xl'}>
            <SingleProductImage product={product} />

                <Grid.Col pr={{ base: 'xs', lg: 'xl' }} span={{ base: 12, lg: 8 }}>
                    <Text fz={{ base: '18pt', lg: '28pt' }} fw={'bold'}> {product.name}</Text>
                    <Flex mt={'xl'}>
                        <Text fz={'16px'} c="dimmed">حداکثر تعداد فن :‌</Text>
                        <Text mr={'3px'}>{product.max_total_fan} وات</Text>
                    </Flex>
                    <Flex mt={'xl'}>
                        <Text fz={'16px'} c="dimmed">فرم کیس : ‌</Text>
                        <Text mr={'1px'}>{product.form} </Text>

                    </Flex>

                    {product.price ? <>
                        <Group gap={3} justify="end" align='center' mt="lg" mb="xs">
                            <Text ml={'2px'}>از</Text>
                            <Text fz={'1.3rem'} fw={'bold'}>{Intl.NumberFormat('fa', {}).format(Number(product.price))}</Text>
                            <Image className={classes.tomanIcon} src={'/svg/toman.svg'} alt='kiwi part price' width={16} height={16} />
                        </Group>
                    </> : ''}
                    <Flex justify={'end'} mt={'xl'}>
                        {torobLink && (
                            <Link href={torobLink} target='_blank'>
                                <Button px={'xs'} color='red'
                                    leftSection={<Image style={{ borderRadius: '100%' }}
                                        alt='torob-kiwi-part' width={20} height={20}
                                        src={'/torob.png'} />}
                                    variant='light' >مشاهده در ترب</Button>
                            </Link>
                        )}

                        {EmallsLink && (
                            <Link href={EmallsLink} target='_blank'>
                                <Button mr={'lg'} color="indigo" px={'xs'}
                                    variant='light'
                                    leftSection={<Image style={{ borderRadius: '100%' }}
                                        alt='emalls-kiwi-part' width={20} height={20} src={'/emalls.png'} />} >مشاهده در ایمالز</Button>
                            </Link>
                        )}
                    </Flex>
                </Grid.Col>
            </Grid>


            {/* tab section */}
            {graphics && <TabsSection defaultValue='graphics'
                tabLists={[{ title: "کارت گرافیک مطابق", img: '/svg/graphic.svg', value: 'graphics' }]}
                tabPanels={[{ value: 'graphics', item: graphics }]} />}
        </>
    )
}

export default CaseSingle