import { Graphic } from '@/_redux/services/graphicApi'
import { Button, Flex, Grid, Group, Text } from '@mantine/core';
import React, {  } from 'react'
import Image from 'next/image';
import classes from '@/_cssModules/PcSection.module.css'
import Link from 'next/link';
import TabsSection from './components/TabsSection';
import SingleProductImage from './components/SingleProductImage';

const GraphicCardSingle = ({ product }: { product: Graphic }) => {
 
    return (
        <>
            <Grid mt={'xl'}>
            <SingleProductImage product={product} />

                <Grid.Col pr={{ base: 'xs', lg: 'xl' }} span={{ base: 12, lg: 8 }}>
                    <Text fz={{ base: '18pt', lg: '28pt' }} fw={'bold'}> {product.name}</Text>
                    <Flex mt={'xl'}>
                        <Text fz={'16px'} c="dimmed">سازنده پردازنده گرافیکی :‌</Text>
                        <Text mr={'3px'}>{product.manufacturer}</Text>
                    </Flex>
                    <Flex mt={'xl'}>
                        <Text fz={'16px'} c="dimmed">حداقل پاور پیشنهادی :‌</Text>
                        <Text mr={'3px'}>{product.psu} وات</Text>
                    </Flex>
                    <Flex mt={'xl'}>
                        <Text fz={'16px'} c="dimmed">نوع حافظه :‌</Text>
                        <Text mr={'3px'}>{product.type}</Text>
                    </Flex>
                    <Flex mt={'xl'}>
                        <Text fz={'16px'} c="dimmed">میزان حافظه :‌</Text>
                        <Text mr={'3px'}>{product.ram} گیگابایت</Text>
                    </Flex>
                    {product.price ? <>
                        <Group gap={3} justify="end" align='center' mt="lg" mb="xs">
                            <Text ml={'2px'}>از</Text>
                            <Text fz={'1.3rem'} fw={'bold'}>{Intl.NumberFormat('fa', {}).format(Number(product.price))}</Text>
                            <Image className={classes.tomanIcon} src={'/svg/toman.svg'} alt='kiwi part price' width={16} height={16} />
                        </Group>
                    </> : ''}
                    <Flex justify={'end'} mt={'xl'}>
                        {product.links && (
                            <Link href={JSON.parse(product.links)[0]} target='_blank'>
                                <Button ml={'lg'} px={'xs'} color='red'
                                    leftSection={<Image style={{ borderRadius: '100%' }}
                                        alt='torob-kiwi-part' width={20} height={20}
                                        src={'/torob.png'} />}
                                    variant='light' >مشاهده در ترب</Button>
                            </Link>
                        )}

                        {product.links && (
                            <Link href={JSON.parse(product.links)[1]} target='_blank'>
                                <Button color="indigo" px={'xs'}
                                    variant='light'
                                    leftSection={<Image style={{ borderRadius: '100%' }}
                                        alt='emalls-kiwi-part' width={20} height={20} src={'/emalls.png'} />} >مشاهده در ایمالز</Button>
                            </Link>
                        )}
                    </Flex>
                </Grid.Col>
            </Grid>

            {/* tab section */}
            {product && <TabsSection defaultValue='powers'
                tabLists={[{ title: 'پاورهای مطابق', img: '/svg/power.svg', value: 'powers' }, { title: "cpu مطابق", img: '/svg/cpu.svg', value: 'cpus' }]}
                tabPanels={[{ value: 'powers', item: product.powers }, { value: 'cpus', item: product.cpus }]} />}


        </>
    )
}

export default GraphicCardSingle