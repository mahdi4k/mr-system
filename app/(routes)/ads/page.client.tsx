'use client'

import { Anchor, Badge, Breadcrumbs, Card, Container, Flex, Grid, Group, Menu, rem, SimpleGrid, Skeleton, Text, UnstyledButton } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { Category } from './[id]/page';
import Image from 'next/image'
import { useLazyGetAdsListCategoryQuery } from '@/_redux/services/adsApi';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CardPartPrice from '@/_components/shared/CardPartPrice';
import { formatJalaliTimeAgo, provinceTitleHandler, cityTitleHandler, formatNumberWithCommas } from '@/_utils/utils';
import { IconChevronDown, IconFlag3, IconX } from '@tabler/icons-react';
import { AppDispatch, RootState } from '@/_redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOstan, fetchCity } from '@/_redux/features/ads';
import AdsFilter from '@/_components/adsSection/AdsFilter';
import classes from './AdsPage.module.css'



const data = [
    { label: 'جدیدترین', value: 'created_at' },
    { label: 'ارزان‌ترین', value: 'price_asc' },
    { label: 'گران‌ترین', value: 'price_desc' },
];


const PageClient = () => {
    const [categoriesAds, setCategoriesAds] = useState<Category[]>([]);
    const [adsQuery, { data: adsData, isSuccess: isSuccessAds, isLoading, isFetching: isFetchingAds }] = useLazyGetAdsListCategoryQuery();
    const searchParams = useSearchParams();
    const dispatch: AppDispatch = useDispatch();
    const { ostan, city, status } = useSelector((state: RootState) => state.ads);
    const [params, setParams] = useState<{ [key: string]: string }>({});
    const router = useRouter();
    const [opened, setOpened] = useState(false);
    const [selectedSort, setSelectedSort] = useState(data[0]);

    useEffect(() => {
        if (!ostan.length) {
            dispatch(fetchOstan());
        }
        if (!city.length) {
            dispatch(fetchCity());
        }
    }, [ostan, city, dispatch]);


    useEffect(() => {
        // Convert search params to an object and set it to state
        const paramObj: { [key: string]: string } = {};
        searchParams.forEach((value, key) => {
            paramObj[key] = value;
        });

        setParams(paramObj);
    }, [searchParams]);



    useEffect(() => {
        const categoryParam = searchParams.get('category');
        const searchParam = searchParams.get('search');
        const priceFrom = searchParams.get('price_from');
        const priceTo = searchParams.get('price_to');
        const sort = searchParams.get('sort');

        const queryParams: { category?: string; search?: string; price_from?: string; price_to?: string; sort?: string } = {};

        if (categoryParam) queryParams.category = categoryParam;
        if (searchParam) queryParams.search = searchParam;
        if (priceFrom) queryParams.price_from = priceFrom;
        if (priceTo) queryParams.price_to = priceTo;
        if (sort) queryParams.sort = sort;
        console.log(sort, 'sort');


        adsQuery(queryParams);
    }, [searchParams]); // Re-run when `searchParams` changes


    useEffect(() => {
        // Fetch categories from API
        const fetchCategories = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`);
            const data: Category[] = await response.json();
            setCategoriesAds(data);
        };
        fetchCategories();
    }, []);

    const handleImageAds = (image: string | undefined, title: string) => {
        if (image) {
            const images: string[] = JSON.parse(image);
            return (
                <Image
                    alt={title}
                    style={{ borderRadius: '7px' }}
                    width={180}
                    height={170}
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${images[0]}`}
                />
            );

        } else {
            return (
                <></>
            )
        }
    }

    const handleRemoveParam = (paramKey: string) => {
        // Create a new search parameter object without the removed key
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete(paramKey);

        // Update the URL by pushing new search parameters
        router.push(`?${newParams.toString()}`);
    };


    const items = data.map((item) => (
        <Menu.Item
            onClick={() => {
                setSelectedSort(item)
                const searchParams = new URLSearchParams(window.location.search);
                searchParams.set('sort', item.value.replace(/,/g, ''));
                const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
                window.history.pushState({}, '', newUrl);

            }}
            key={item.label}
        >
            {item.label}
        </Menu.Item>
    ));

    return (
        <Container styles={{ root: { flex: '1 0 auto', width: '100%' } }} size={'lg'}>
            <Breadcrumbs mb={'lg'} mt={'lg'}>
                <Anchor c={'var(--mantine-color-kiwi-2)'} size='sm' href={'/'}>
                    خانه
                </Anchor>

                <Text c="dimmed" size='xs'>
                    آگهی ها
                </Text>
            </Breadcrumbs>
            <Grid gutter={'lg'}>
                <Grid.Col span={3} pt={'xl'}>
                    <Card mb={'lg'} shadow='sm'>
                        <AdsFilter />
                    </Card>
                </Grid.Col>
                <Grid.Col span={9}>
                    <Flex align={'center'} justify={'space-between'}>
                        {/* Render badges for each query parameter */}
                        {Object.entries(params).map(([key, value]) => {
                            if (key !== 'sort') {
                                return (
                                    <Badge
                                        ml={'4px'}
                                        color='var(--mantine-color-kiwi-3)'
                                        key={key}
                                        rightSection={<IconX onClick={() => handleRemoveParam(key)} color='var(--mantine-color-gray-8)' style={{ width: rem(12), height: rem(12), cursor: 'pointer', marginLeft: '3px' }} />}
                                    >
                                        <Text c={'var(--mantine-color-gray-8)'} fz={'12px'}>{categoriesAds.find(item => item.value === value)?.name}</Text>
                                        {key === 'search' ? <Text c={'var(--mantine-color-gray-8)'} fz={'12px'}>{value}</Text> : ''}
                                        {key === 'price_from' ? <Text c={'var(--mantine-color-gray-8)'} fz={'12px'}> از {formatNumberWithCommas(value)}</Text> : ''}
                                        {key === 'price_to' ? <Text c={'var(--mantine-color-gray-8)'} fz={'12px'}> تا {formatNumberWithCommas(value)}</Text> : ''}
                                    </Badge>
                                )
                            }
                        })}

                        <Menu
                            onOpen={() => setOpened(true)}
                            onClose={() => setOpened(false)}
                            radius="md"
                            width="target"
                            withinPortal
                        >
                            <Menu.Target>
                                <UnstyledButton className={classes.control} data-expanded={opened || undefined}>
                                    <Group gap="xs">
                                        <span className={classes.label}>{selectedSort.label}</span>
                                    </Group>
                                    <IconChevronDown size="1rem" className={classes.icon} stroke={1.5} />
                                </UnstyledButton>
                            </Menu.Target>
                            <Menu.Dropdown>{items}</Menu.Dropdown>
                        </Menu>
                    </Flex>
                    <SimpleGrid spacing="xs" py={'lg'} cols={{ base: 2, md: 3, xl: 4 }} >
                        {isFetchingAds && (
                            <>
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <Skeleton key={index} height={'340px'} />
                                ))
                                }
                            </>

                        )}
                        {adsData?.total && adsData.total > 0 && !isFetchingAds ? adsData.data.map(item => (
                            <Link key={item.id} href={`/ads/${item.id}`}>
                                <Card withBorder  >
                                    <Card.Section mt={'0'} ta={'center'}>
                                        {handleImageAds(item.image, item.title)}
                                    </Card.Section>
                                    <Text h={40} ta={'right'} mt={'5px'} lineClamp={2} fz={'sm'}>{item.title}</Text>
                                    <Flex align={'baseline'} justify={'space-between'}>
                                        <CardPartPrice tomanHeight={17} tomanWidth={17} textSize={14} isAds price={item.price} />
                                        <Flex>
                                            <Text ml={'2px'} fz={'11px'}>{formatJalaliTimeAgo(item.created_at)}</Text>
                                        </Flex>
                                    </Flex>
                                    <Flex justify={'flex-end'} mt='xs' align={'baseline'}>
                                        <IconFlag3 size={15} />
                                        <Text style={{ position: 'relative', bottom: '3px' }} mr={'3px'} ta={'left'} fz={'11.5px'}>{provinceTitleHandler(status, item.ostan, ostan)}</Text>
                                        <Text mr={'2px'}>,</Text>
                                        <Text style={{ position: 'relative', bottom: '3px' }} mr={'3px'} ta={'left'} fz={'11.5px'}>{cityTitleHandler(status, item.city, city)}</Text>

                                    </Flex>
                                </Card>
                            </Link>
                        )) : ''}
                        {adsData?.data.length === 0 && !isFetchingAds ? <Text>آگهی یافت نشد</Text> : ''}
                    </SimpleGrid>

                </Grid.Col>
            </Grid>
        </Container>

    )
}

export default PageClient