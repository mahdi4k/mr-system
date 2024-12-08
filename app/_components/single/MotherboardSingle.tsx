import { Motherboard } from '@/_redux/services/motherboardApi'
import { Container, Grid, Flex, Group, Button, Tabs, Card, Stack, Badge, Text } from '@mantine/core'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image';
import classes from '@/_cssModules/PcSection.module.css'
import CardPartPrice from '../shared/CardPartPrice';
import TabsSection from './components/TabsSection';
import SingleProductImage from './components/SingleProductImage';

const MotherboardSingle = ({ product }: { product: Motherboard }) => {
 
  return (
    <>
      <Grid mt={'xl'}>
      <SingleProductImage product={product} />

        <Grid.Col pr={{ base: 'xs', lg: 'xl' }} span={{ base: 12, lg: 8 }}>
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
                <Button px={'xs'} color='red'
                  leftSection={<Image style={{ borderRadius: '100%' }}
                    alt='torob-kiwi-part' width={20} height={20}
                    src={'/torob.png'} />}
                  variant='light' >مشاهده در ترب</Button>
              </Link>
            )}

            {product.links && JSON.parse(product.links)[1] && (
              <Link href={JSON.parse(product.links)[1]} target='_blank'>
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
      {product && <TabsSection defaultValue='cpus'
        tabLists={[{ title: "cpu مطابق", img: '/svg/cpu.svg', value: 'cpus' }]}
        tabPanels={[{ value: 'cpus', item: product.cpus }]} />}

    </>
  )
}

export default MotherboardSingle