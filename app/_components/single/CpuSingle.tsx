import { Grid, Flex, Group, Button, Tabs, Card, Stack, Badge, Text } from '@mantine/core'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image';
import { CPU } from '@/_redux/services/cpuApi';
import classes from '@/_cssModules/PcSection.module.css'
import TabsSection from './components/TabsSection';

const CpuSingle = ({ product }: { product: CPU }) => {
  return (
    <>
      <Grid mt={'xl'}>
        <Grid.Col className={classes.imgSingleProduct} span={{ base: 12, sm: 4 }}>
          {product.image && <Image alt={product.name} width={400} height={250} sizes="100vw"
            style={{
              width: 'auto',
              height: 'revert-layer',
              objectFit: 'cover'
            }}
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${product.image}`} />}
        </Grid.Col>
        <Grid.Col pr={{ base: 'xs', lg: 'xl' }} span={{ base: 12, sm: 8 }}>
          <Text fz={{ base: '18pt', lg: '28pt' }} fw={'bold'}> {product.name}</Text>
          <Flex mt={'xl'}>
            <Text fz={'16px'} c="dimmed">گرافیک مجتمع :‌</Text>
            <Text mr={'3px'}>{product.integrated_graphic}</Text>
          </Flex>
          <Flex mt={'xl'}>
            <Text fz={'16px'} c="dimmed">سوکت :‌</Text>
            <Text mr={'3px'}>{product.cpu_socket}</Text>
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
      {product && <TabsSection defaultValue='motherboards'
        tabLists={[{ title: 'مادربوردهای مطابق', img: '/svg/motherboard.svg', value: 'motherboards' }, { title: "کارت گرافیک‌های مطابق", img: '/svg/graphic.svg', value: 'graphics' }]}
        tabPanels={[{ value: 'motherboards', item: product.motherboards }, { value: 'graphics', item: product.graphics }]} />}
    </>
  )
}

export default CpuSingle