import { Motherboard } from '@/_redux/services/motherboardApi'
import { Container, Grid, Flex, Group, Button, Tabs, Card, Stack, Badge, Text } from '@mantine/core'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image';
import classes from '@/_cssModules/PcSection.module.css'
import CardPartPrice from '../shared/CardPartPrice';

const MotherboardSingle = ({ product }: { product: Motherboard }) => {
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
            <Text fz={'16px'} c="dimmed">سوکت پردازنده :‌</Text>
            <Text mr={'3px'}>{product.cpu_socket}</Text>
          </Flex>
          <Flex mt={'xl'}>
            <Text fz={'16px'} c="dimmed">نوع RAM:‌</Text>
            <Text mr={'3px'}>{product.ddr3 ? 'DDR3' : product.ddr4 ? 'DDR4' : product.ddr5 ? 'DDR5' : 'نامشخص'}  </Text>
          </Flex>
          <Flex mt={'xl'}>
            <Text fz={'16px'} c="dimmed">تعداد اسلات RAM :‌</Text>
            <Text mr={'3px'}>{product.total_slot_ram}</Text>
          </Flex>
          <Flex mt={'xl'}>
            <Text fz={'16px'} c="dimmed">ارتباط بیسیم :‌</Text>
            <Text mr={'3px'}>{product.wifi_support ? 'دارد' : 'ندارد'}</Text>
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
      <Tabs mt={'xl'} defaultValue="cpu">
        <Tabs.List>
          <Tabs.Tab value="cpu" leftSection={<Image width={20} height={20} alt='' src={'/svg/cpu.svg'} />}>
            cpu مطابق
          </Tabs.Tab>
        </Tabs.List>

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
                      <Badge color="pink">{data.manufacturer}</Badge>
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

export default MotherboardSingle