import { Graphic } from '@/_redux/services/graphicApi'
import { Badge, Button, Card, Container, Flex, Grid, Group, Stack, Tabs, Text } from '@mantine/core';
import React from 'react'
import Image from 'next/image';
import classes from '@/_cssModules/PcSection.module.css'
import Link from 'next/link';
import CardPartPrice from '../shared/CardPartPrice';

const GraphicCardSingle = ({ product }: { product: Graphic }) => {

    return (
        <Container styles={{ root: { flex: '1 0 auto', width: '100%' } }} size={'lg'}>
            <Grid mt={'xl'}>
                <Grid.Col span={{ base: 12, lg: 5 }}>
                    {product.image && <Image alt={product.name} width={450} height={450} sizes="100vw"
                        style={{
                            width: '100%',
                            height: 'auto',
                        }}
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.image}`} />}
                </Grid.Col>
                <Grid.Col pr={{ base: 'xs', lg: 'xl' }} span={{ base: 12, lg: 7 }}>
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
            <Tabs mt={'xl'} defaultValue="power">
                <Tabs.List>
                    <Tabs.Tab value="power" leftSection={<Image width={20} height={27} alt='' src={'/svg/power.svg'} />}>
                        پاورهای مطابق
                    </Tabs.Tab>
                    <Tabs.Tab value="cpu" leftSection={<Image width={20} height={20} alt='' src={'/svg/cpu.svg'} />}>
                        cpu مطابق
                    </Tabs.Tab>

                </Tabs.List>

                <Tabs.Panel value="power">
                    <Grid my={'xl'} >
                        {product && product.powers?.length > 0 ? product.powers.map((data) => (
                            <Grid.Col key={data.id} span={{ base: 12, md: 6, lg: 3 }}>
                                <Link href={`/products/powers/${data.id}`}>
                                    <Card miw={20} mih={300} key={data.id} shadow="sm" padding="lg" radius="md" withBorder>
                                        <Card.Section ta={'center'}>
                                            {data.image && <Image alt={data.name} width={170} height={160} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${data.image}`} />}
                                        </Card.Section>
                                        <Stack justify="center" align='center' mt="md" mb="xs">
                                            <Text ta={'center'} fw={500}>{data.name}</Text>
                                        </Stack>
                                        <CardPartPrice price={product.price} />
                                    </Card>
                                </Link>
                            </Grid.Col>
                        )) : <Card mih={312}><Text>محصولی یافت نشد</Text></Card>}
                    </Grid>
                </Tabs.Panel>

                <Tabs.Panel value="cpu">
                    <Grid my={'xl'} >
                        {product && product.cpus?.length > 0 ? product.cpus.map((data) => (
                            <Grid.Col key={data.id} span={{ base: 12, md: 6, lg: 3 }}>
                                <Link href={`/products/cpus/${data.id}`}>
                                    <Card miw={20} mih={312} key={data.id} shadow="sm" padding="lg" radius="md" withBorder>
                                        <Card.Section ta={'center'}>
                                            {data.image && <Image alt={data.name} width={170} height={160} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${data.image}`} />}
                                        </Card.Section>

                                        <Stack justify="center" align='center' mt="md" mb="xs">
                                            <Text ta={'center'} fw={500}>{data.name}</Text>
                                        </Stack>
                                        <CardPartPrice price={product.price} />
                                    </Card>
                                </Link>
                            </Grid.Col>
                        )) : <Card mih={312}><Text>محصولی یافت نشد</Text></Card>}
                    </Grid>
                </Tabs.Panel>
            </Tabs>
        </Container>
    )
}

export default GraphicCardSingle