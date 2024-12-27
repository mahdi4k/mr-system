"use client"

import KiwiImage from '@/_components/shared/KiwiImage';
import { Anchor, Breadcrumbs, Container, Text, Group, Flex, Grid, Box, Card, ThemeIcon, Button, Divider, Badge, rem } from '@mantine/core';
import React, { FC, useEffect, useState } from 'react'
import { IAdsProps } from './page';
import classes from './adsSingle.module.css'
import Image from 'next/image';
import { IconDiscountCheckFilled, IconPhone, IconUser } from '@tabler/icons-react';
import { cityTitleHandler, formatJalaliTimeAgo, provinceTitleHandler } from '@/_utils/utils';
import { fetchCity, fetchOstan } from '@/_redux/features/ads';
import { AppDispatch, RootState } from '@/_redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useLazyGetAdsListCategoryQuery } from '@/_redux/services/adsApi';
import { Carousel, Embla } from '@mantine/carousel';
import AdsRelated from '@/_components/adsSection/AdsRelated';
import AdsGalleryModal from '@/_components/adsSection/AdsGalleryModal';


type props = {
  product: IAdsProps
}

const PageClient: FC<props> = ({ product }) => {
  const dispatch: AppDispatch = useDispatch();
  const { ostan, city, status } = useSelector((state: RootState) => state.ads);
  const [adsQuery, { data: adsData, isSuccess: isSuccessAds, isLoading, isFetching: isFetchingAds }] = useLazyGetAdsListCategoryQuery()
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [openedImageModal, setOpenedImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    if (embla) {
      embla?.reInit({ direction: 'rtl' })
    }
  }, [embla]);

  useEffect(() => {
    if (!ostan.length) {
      dispatch(fetchOstan());
    }
    if (!city.length) {
      dispatch(fetchCity());
    }
  }, [ostan, city, dispatch]);


  useEffect(() => {
    if (product)
      adsQuery({ category: product.category.value })
  }, [product])

  const filteredAds = adsData?.data.filter(ad => ad.id !== product.id);

  const openModal = (index: number) => {
    setSelectedImage(index);
    setOpenedImageModal(true);
  };

  const handleImageAds = (image: string | undefined, title: string) => {
    if (image) {
      const images: string[] = JSON.parse(image);
      return (
        <>
          <Carousel
            slideSize={{ base: images.length === 1 ? '100%' : '62%', lg: '21%' }}
            slideGap={{ base: 'sm', sm: 'md' }}
            getEmblaApi={setEmbla}
            align="start"
            dragFree
            withControls={false}>
            {images.map((img, index) => (
              <Carousel.Slide key={index} mt={'sm'} >
                <Box onClick={() => openModal(index)}>
                  <Group wrap='nowrap' justify='center' className={classes.adsImages} key={index}>
                    <KiwiImage objectFit='cover' url={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/storage/${img}`} width={300} height={300} img={img} alt={title} />
                  </Group>
                </Box>
              </Carousel.Slide>
            ))}

          </Carousel>
        </>
      );

    } else {
      return (
        <></>
      )
    }
  }


  return (
    <Container styles={{ root: { flex: '1 0 auto', width: '100%' } }} size={'lg'}>
      <Breadcrumbs mb={'lg'} mt={'lg'}>
        <Anchor c={'var(--mantine-color-kiwi-2)'} size='sm' href={'/'}  >
          خانه
        </Anchor>
        <Anchor c={'var(--mantine-color-kiwi-2)'} size='sm' href={`/ads?category=${product.category.value}`}>
          {product.category.name}
        </Anchor>
        <Text c="dimmed" size='xs'>
          {product.title}
        </Text>
      </Breadcrumbs>

      {handleImageAds(product.image, product.title)}

      <Grid gutter={'xl'} mt={{ base: 'lg', md: '60px' }} mb={'xl'}>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Group mt={'calc(var(--mantine-spacing-lg) * 2)'} align='center'>
            <Text fw={'bold'} fz={'h1'}>{product.title}</Text>
            <Badge
              rightSection={product.status === 'approved' ? <IconDiscountCheckFilled style={{ width: rem(17), height: rem(17) }}/> : ''}
              color={product.status === 'approved' ? 'green' : 'orange'}>
              {product.status === 'approved' ? 'منتشر شده' : 'در انتظار تایید'}</Badge>
          </Group>
          <Flex justify={'space-between'} align={'baseline'} mt={'calc(var(--mantine-spacing-lg) * 2)'}>
            {product.price ? <>
              <Group gap={3} justify="end" align='center' mb="xs">
                <Text fz={'2rem'} fw={'bold'}>{Intl.NumberFormat('fa', {}).format(Number(product.price))}</Text>
                <Image className={classes.tomanIcon} src={'/svg/toman.svg'} alt='kiwi part price' width={26} height={26} />
              </Group>
            </> : ''}
            <Flex align={'baseline'}>
              <Text ml={'2px'} fz={'sm'}>{formatJalaliTimeAgo(product.created_at)}</Text>
              <Text mr={'2px'}>,</Text>
              <Text mr={'3px'} ta={'left'} fz={'13.5px'}>{provinceTitleHandler(status, product.ostan, ostan)}</Text>
              <Text mr={'2px'}>,</Text>
              <Text mr={'3px'} ta={'left'} fz={'13.5px'}>{cityTitleHandler(status, product.city, city)}</Text>
            </Flex>

          </Flex>
          <Divider />
          <Text fz={'xl'} mt={'xl'}>توضیحات : </Text>
          <div style={{ whiteSpace: 'pre-wrap', marginTop: '10px', paddingLeft: '30px' }}>
            {product.description}
          </div>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Card mt={'xl'} shadow=' rgba(0, 0, 0, 0.1) -4px 9px 25px -6px '>
            <Text fz={'sm'}>اطلاعات تماس</Text>
            <Flex direction={'column'} align={'center'} justify={'center'}>
              <ThemeIcon mt={'lg'} color="gray" variant="light" radius="xl" size="4rem">
                <IconUser style={{ width: '70%', height: '70%' }} />
              </ThemeIcon>
              <Text mt={'md'} fz={'sm'}>{product.user.name}</Text>
              <Button mt={'lg'} size='md' color='green' radius={'lg'} variant='light' w={'100%'} rightSection={<IconPhone size={20} />}>{product.user.phone}</Button>
            </Flex>
          </Card>
        </Grid.Col>
      </Grid>
      <Divider />
      {isSuccessAds && filteredAds && filteredAds.length > 0 && (
        <AdsRelated filteredAds={filteredAds} isFetchingAds={isFetchingAds} />
      )}
      <AdsGalleryModal image={product.image} openedImageModal={openedImageModal} selectedImage={selectedImage} setOpenedImageModal={setOpenedImageModal} />
    </Container>

  )
}

export default PageClient