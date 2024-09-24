"use client"

import { Box, Accordion, NavLink, Stack, Skeleton, TextInput, ActionIcon, Text, ScrollArea, Button, Flex, Group, Divider } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Category } from '(routes)/ads/[id]/page'
import { convertToEnglishNumber, currentUrlCategory, formatNumberWithCommas } from '@/_utils/utils'

const AdsFilter = () => {
    const [categoriesAds, setCategoriesAds] = useState<Category[]>([]);
    const searchParams = useSearchParams();
    const [value, setValue] = useState('');
    const [price_from, setPriceFrom] = useState('');
    const [price_to, setPriceTo] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Fetch categories from API
        const fetchCategories = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`);
            const data: Category[] = await response.json();
            setCategoriesAds(data);
        };
        fetchCategories();
    }, []);

    const handleSearch = () => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('search', value); // Set or update the 'search' query param
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;

        // Update the browser's URL without reloading the page
        window.history.pushState({}, '', newUrl);
    };

    const handlePrice = () => {
        const searchParams = new URLSearchParams(window.location.search);
        if (price_from)
            searchParams.set('price_from', price_from.replace(/,/g, ''));
        if (price_to)
            searchParams.set('price_to', price_to.replace(/,/g, ''));
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;

        // Update the browser's URL without reloading the page
        window.history.pushState({}, '', newUrl);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };



    const handleNumberChange = (value: string, setValue: React.Dispatch<React.SetStateAction<string>>) => {
        // Convert Persian/Arabic digits to English digits
        let inputValue = convertToEnglishNumber(value);
        // Remove non-numeric characters (except commas for formatted values)
        inputValue = inputValue.replace(/\D/g, '');
        // Format number with commas as thousand separators
        const formattedValue = formatNumberWithCommas(inputValue);
        // Update the state
        setValue(formattedValue);
    };

    const handleRemoveParam = (e: React.MouseEvent) => {
        e.preventDefault();
        // Create a new search parameter object without the removed key
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete('price_from');
        newParams.delete('price_to');
        setPriceTo('');
        setPriceFrom('');
        // Update the URL by pushing new search parameters
        router.push(`?${newParams.toString()}`);
    };
    return (
        <ScrollArea scrollbars='y' pl={'xs'} offsetScrollbars type="always" scrollbarSize={3} h={560}>
            <Accordion defaultValue="categories">
                <Accordion.Item value={'categories'}>
                    <Accordion.Control >
                        <Text fw={'bold'} fz={'md'} pr={'xs'}>دسته‌بندی‌ ها‌</Text>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {categoriesAds.length ? (
                            categoriesAds.map(item => (
                                <Link key={item.id} href={currentUrlCategory(item.value)}>
                                    <NavLink component='div'
                                        active={searchParams.get('category') === item.value}
                                        label={item.name}
                                        leftSection={<Image width={13} height={13} src={`/svg/${item.value}.svg`} alt={item.name} />}
                                    />
                                </Link>
                            ))
                        ) : (
                            <Stack mt={'md'}>
                                {
                                    Array.from({ length: 8 }).map((_, index) => (
                                        <Skeleton key={index} height="20px" />
                                    ))
                                }
                            </Stack>
                        )}
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>

            <Text mt={'lg'} fw={'bold'} fz={'md'} pr={'xs'}> جستجو در نتایج</Text>
            <TextInput mt='xs'
                onKeyDown={handleKeyDown}
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)} rightSection={<ActionIcon onClick={handleSearch} variant='light'>
                    <IconSearch size={13} />
                </ActionIcon>} />
            <Divider mt={'xl'} />
            <Text mt={'lg'} fw={'bold'} fz={'md'} pr={'xs'}> قیمت</Text>

            {/* price filter */}
            <TextInput mt='xs' styles={{ input: { textAlign: 'left', direction: 'ltr' } }}
                onKeyDown={handleKeyDown}
                leftSection={<Text fz={'xs'}>از</Text>}
                value={price_from}
                onChange={(event) => handleNumberChange(event.currentTarget.value, setPriceFrom)}
                rightSection={<Image src={'/svg/toman.svg'} alt='kiwi part price from' width={18} height={18} />} />

            <TextInput mt='xs' styles={{ input: { textAlign: 'left', direction: 'ltr' } }}
                onKeyDown={handleKeyDown}
                leftSection={<Text fz={'xs'}>تا</Text>}
                value={price_to}
                onChange={(event) => handleNumberChange(event.currentTarget.value, setPriceTo)}
                rightSection={<Image src={'/svg/toman.svg'} alt='kiwi part price to' width={18} height={18} />} />

            <Group mt={'md'} wrap='nowrap' >
                <Button onClick={handlePrice} >اعمال فیلتر قیمت</Button>
                <Button onClick={(e) => handleRemoveParam(e)} variant='outline'>حذف</Button>
            </Group>

        </ScrollArea>
    )
}

export default AdsFilter