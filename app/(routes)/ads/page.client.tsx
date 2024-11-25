'use client'

import { ActionIcon, Anchor, Badge, Breadcrumbs, Button, Card, Container, Drawer, Flex, Grid, Group, Loader, Menu, rem, SimpleGrid, Skeleton, Text, UnstyledButton } from '@mantine/core'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Product, useLazyGetAdsListCategoryQuery } from '@/_redux/services/adsApi';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CardPartPrice from '@/_components/shared/CardPartPrice';
import { formatJalaliTimeAgo, provinceTitleHandler, cityTitleHandler, formatNumberWithCommas, debounce } from '@/_utils/utils';
import { IconChevronDown, IconFilter, IconFlag3, IconX } from '@tabler/icons-react';
import { AppDispatch, RootState } from '@/_redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOstan, fetchCity } from '@/_redux/features/ads';
import AdsFilter from '@/_components/adsSection/AdsFilter';
import classes from './AdsPage.module.css'
import ImgNoProduct from '../../../public/no-product.png'
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { Province } from './create/page';
import { CategoryProdcut } from './page';


const data = [
    { label: 'جدیدترین', value: 'created_at' },
    { label: 'ارزان‌ترین', value: 'price_asc' },
    { label: 'گران‌ترین', value: 'price_desc' },
];


const PageClient = ({ categories }: { categories: CategoryProdcut[] }) => {
    const [adsQuery, { data: adsData, isSuccess: isSuccessAds, isLoading, isFetching: isFetchingAds }] = useLazyGetAdsListCategoryQuery();
    const searchParams = useSearchParams();
    const dispatch: AppDispatch = useDispatch();
    const { ostan, city, status } = useSelector((state: RootState) => state.ads);
    const [params, setParams] = useState<{ [key: string]: string }>({});
    const router = useRouter();
    const [opened, setOpened] = useState(false);
    const [selectedSort, setSelectedSort] = useState(data[0]);
    const [page, setPage] = useState(1);
    const [products, setProducts] = useState<Product[]>([]);
    const observerRef = useRef(null);  // Ref for the observer target
    const [provinces, setProvinces] = useState<Province[]>([]);

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
        console.log("🚀 ~ searchParams.forEach ~ paramObj:", paramObj)

        setParams(paramObj);
    }, [searchParams]);


    // check query params exist 

    useEffect(() => {
        const categoryParam = searchParams.get('category');
        const searchParam = searchParams.get('search');
        const priceFrom = searchParams.get('price_from');
        const priceTo = searchParams.get('price_to');
        const sort = searchParams.get('sort');
        const ostanParams = searchParams.getAll('ostan'); // Retrieve all 'ostan' values

        const queryParams: {
            ostan?: string; // Array for multiple 'ostan' values
            category?: string;
            search?: string;
            price_from?: string;
            price_to?: string;
            sort?: string;
            page?: string;
        } = {};

        if (ostanParams.length > 0) queryParams.ostan = ostanParams.join(','); // Add 'ostan' array to query
        if (categoryParam) queryParams.category = categoryParam;
        if (searchParam) queryParams.search = searchParam;
        if (priceFrom) queryParams.price_from = priceFrom;
        if (priceTo) queryParams.price_to = priceTo;
        if (sort) queryParams.sort = sort;
        if (page) queryParams.page = `${page}`;

        if (sort) {
            const sortParam = sort;
            setSelectedSort(
                data.find((item) => item.value === sortParam) as { label: string; value: string }
            );
        }

        adsQuery(queryParams); // Call your API with the constructed queryParams

    }, [searchParams, page]);



    useEffect(() => {
        // Fetch provinces and cities data from public folder
        const fetchProvincesAndCities = async () => {
            const provincesResponse = await fetch('/provinces.json');
            const provincesData: Province[] = await provincesResponse.json();

            setProvinces(provincesData);
        };

        fetchProvincesAndCities();
    }, []);




    // set total page number in query param
    useEffect(() => {
        const setSearchParams = new URLSearchParams(window.location.search);

        if (isSuccessAds) {
            console.log('here');

            setSearchParams.set('total_page', `${adsData ? adsData.last_page : 0}`);
            const newUrl = `${window.location.pathname}?${setSearchParams.toString()}`;
            window.history.pushState({}, '', newUrl);
        }
    }, [isSuccessAds, adsData, searchParams])



    // Clear products
    useEffect(() => {
        if (page === 1 && (searchParams.get('category') || searchParams.get('sort'))) {
            setProducts([]);
        }
    }, [page, searchParams.get('category'), searchParams.get('sort')]);


    // set product and merge old product with new product and also checked for duplicate products
    useEffect(() => {
        if (isSuccessAds && adsData) {
            const totalPages = adsData.last_page;

            setTimeout(() => {
                setProducts((prev) => {
                    const existingIds = new Set(prev.map((product) => product.id));

                    // Check if we are resetting or appending
                    if (page === 1) {
                        // On search reset, replace products entirely
                        return adsData.data;
                    }

                    // For pagination, append only new products
                    const newProducts = adsData.data.filter((product) => !existingIds.has(product.id));
                    return [...prev, ...newProducts];
                });
            }, 0);
        }
    }, [isSuccessAds, adsData, page, searchParams]);


    //observer listiner for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(debounce((entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting) {
                setPage((prev) => {
                    const currentTotalPage = Number(searchParams.get('total_page')); // Get the latest value as number

                    if (Number(prev) <= currentTotalPage) {
                        return prev + 1; // Increment page if current page is less than total pages
                    } else {
                        // Disconnect the observer when we reach or exceed the totalPage
                        if (observerRef.current) {
                            observer.disconnect(); // Stop observing when last page is reached
                        }
                    }
                    return prev; // No page increment if we reach totalPage
                });
            }
        }, 500), {
            root: null,
            rootMargin: '0px',
            threshold: 1.0
        });

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        // Cleanup the observer on component unmount or effect re-run
        return () => {
            if (observerRef.current) {
                observer.disconnect();
            }
        };
    }, [page, searchParams]);

    const handleImageAds = (image: string, title: string) => {

        const images: string[] = JSON.parse(image);
        if (images.length > 0) {
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
                <Image style={{ objectFit: 'contain' }} width={180} height={170} alt='no img' src={ImgNoProduct} />
            )
        }
    }

    const handleRemoveParam = (paramKey: string) => {
        // Create a new search parameter object without the removed key
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete(paramKey);

        // Clear products before updating the URL
        setProducts([]);
        setPage(1)

        // Use a timeout or promise to ensure the state is cleared before routing
        setTimeout(() => {
            // Update the URL by pushing new search parameters
            router.push(`?${newParams.toString()}`);
        }, 100);
    };


    const items = data.map((item) => (
        <Menu.Item
            onClick={() => {
                setPage(1);
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

    function AdsFilterWithDrawer({ setPage }: { setPage: React.Dispatch<React.SetStateAction<number>> }) {
        // Manage drawer state
        const [opened, { open, close }] = useDisclosure(false);

        // Detect screen size (returns true if width < 768px)
        const isTablet = useMediaQuery('(max-width: 1200px)');

        return (
            <>
                {isTablet ? (
                    <>
                        {/* Button to open the drawer */}
                        <ActionIcon style={{ position: 'relative', top: '52px' }} mr={'sm'} size={'xl'} variant='light' onClick={open} >
                            <IconFilter size={22} />
                        </ActionIcon>


                        {/* Drawer component */}
                        <Drawer position='bottom' opened={opened} onClose={close} title="فیلترها" padding="md" size="sm">
                            <AdsFilter categories={categories} provinces={provinces} setPage={setPage} />
                        </Drawer>
                    </>
                ) : (
                    // Render the Card with AdsFilter for larger screens
                    <Grid.Col className={classes.sidebar} span={3} pt={'xl'}>
                        <Card withBorder mb={'lg'} mt={'42px'} pl={'xs'}>
                            <AdsFilter categories={categories} provinces={provinces} setPage={setPage} />
                        </Card>
                    </Grid.Col>
                )}
            </>
        );
    }

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
                <AdsFilterWithDrawer setPage={setPage} />
                <Grid.Col span={{ base: 12, lg: 9 }}>
                    <Flex align={'center'} justify={'space-between'}>
                        {/* Render badges for each query parameter */}
                        {Object.entries(params)
                            .filter(([key]) => key !== 'sort' && key !== 'total_page') // Exclude irrelevant keys
                            .map(([key, value]) => {
                                const category = categories.find(item => item.value === value)?.name;

                                return (
                                    <Badge
                                        ml={'4px'}
                                        color="var(--mantine-color-kiwi-3)"
                                        key={`${key}-${value}`}
                                        rightSection={
                                            <IconX
                                                onClick={() => handleRemoveParam(key)}
                                                color="var(--mantine-color-gray-8)"
                                                style={{
                                                    width: rem(12),
                                                    height: rem(12),
                                                    cursor: 'pointer',
                                                    marginLeft: '3px',
                                                }}
                                            />
                                        }
                                    >
                                        {key === 'search' && (
                                            <Text c="var(--mantine-color-gray-8)" fz="12px">
                                                جستجو: {value}
                                            </Text>
                                        )}
                                        {category && key !== 'search' && (
                                            <Text c="var(--mantine-color-gray-8)" fz="12px">
                                                {category}
                                            </Text>
                                        )}
                                        {key === 'price_from' && (
                                            <Text c="var(--mantine-color-gray-8)" fz="12px">
                                                از {formatNumberWithCommas(value)}
                                            </Text>
                                        )}
                                        {key === 'price_to' && (
                                            <Text c="var(--mantine-color-gray-8)" fz="12px">
                                                تا {formatNumberWithCommas(value)}
                                            </Text>
                                        )}
                                    </Badge>
                                );
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
                        {isFetchingAds && page === 1 && (
                            <>
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <Skeleton key={index} height={'340px'} />
                                ))
                                }
                            </>

                        )}
                        {adsData?.total && adsData.total > 0 ? products.map(item => (
                            <Link key={item.id} href={`/ads/${item.id}`}>
                                <Card withBorder  >
                                    <Card.Section mt={'0'} ta={'center'}>
                                        {handleImageAds(item.image as string, item.title)}
                                    </Card.Section>
                                    <Text h={40} ta={'right'} mt={'5px'} lineClamp={2} fz={'sm'}>{item.title}</Text>
                                    <Flex align={'baseline'} justify={'space-between'}>
                                        {item.price ? <CardPartPrice tomanHeight={17} tomanWidth={17} textSize={14} isAds price={item.price} /> : <Text c={'#25ac9e'} mb="xs" fz={'sm'} mt={'md'}>توافقی</Text>}
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
                        {adsData?.data.length === 0 && products.length === 0 && !isFetchingAds ? <Text>آگهی یافت نشد</Text> : ''}
                    </SimpleGrid>
                    {isFetchingAds ? <Flex justify={'center'} align={'center'}><Loader color="green" type="dots" /></Flex> : ''}


                </Grid.Col>
            </Grid>
            <div ref={observerRef} style={{ height: '20px', backgroundColor: 'transparent' }} />

        </Container>

    )
}

export default PageClient