"use client"

import { Box, Accordion, NavLink, Stack, Skeleton, TextInput, ActionIcon, Text, ScrollArea, Button, Flex, Group, Divider, Select, MultiSelect } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Category } from '(routes)/ads/[id]/page'
import { convertToEnglishNumber, currentUrlCategory, formatNumberWithCommas } from '@/_utils/utils'
import classes from './scroll.module.css'
import { Province } from '(routes)/ads/create/page'
import { CategoryProdcut } from '(routes)/ads/page'

const AdsFilter = ({ isTablet, setPage, provinces, categories }: { isTablet: boolean, categories: CategoryProdcut[], provinces: Province[], setPage: React.Dispatch<React.SetStateAction<number>> }) => {
    const searchParams = useSearchParams();
    const [value, setValue] = useState('');
    const [price_from, setPriceFrom] = useState('');
    const [price_to, setPriceTo] = useState('');
    const router = useRouter();
    const [selectedProvince, setSelectedProvince] = useState<string[] | null>([]);


    const handleSearch = () => {
        setPage(1)
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('search', value); // Set or update the 'search' query param
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;

        // Update the browser's URL without reloading the page
        window.history.pushState({}, '', newUrl);
    };

    const handlePrice = () => {
        const searchParams = new URLSearchParams(window.location.search);
        setPage(1)
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

    const handleOstanFilter = () => {
        const searchParams = new URLSearchParams(window.location.search);
        // Remove the existing 'ostan' parameter
        searchParams.delete('ostan');

        // Add each selected province as a separate 'ostan' parameter
        if (selectedProvince && selectedProvince.length > 0) {
            setPage(1);

            selectedProvince.forEach((province) => {
                searchParams.append('ostan', province);
            });
        }

        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;

        // Update the browser's URL without reloading the page
        window.history.pushState({}, '', newUrl);
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

    const handleProvinceChange = (provinceId: string[] | null) => {
        if (provinceId) {
            setSelectedProvince(provinceId);
        }
    };

    useEffect(() => {
        const searchValue = searchParams.get('search');
        if (searchValue) {
            setValue(searchValue);
        }

        const priceFromValue = searchParams.get('price_from');
        if (priceFromValue) {
            setPriceFrom(priceFromValue);
        }

        const priceToValue = searchParams.get('price_to');
        if (priceToValue) {
            setPriceTo(priceToValue);
        }

        const ostanValues = searchParams.getAll('ostan');
        if (ostanValues.length) {
            setSelectedProvince(ostanValues); // Update the MultiSelect state
        }
    }, [searchParams]);



    return (
        <ScrollArea classNames={classes} scrollbars='y' pl={'xs'} offsetScrollbars type="always" scrollbarSize={3}
            h={isTablet ? 310 : 560}>
            <Accordion styles={{ content: { padding: '0' } }} defaultValue="categories">
                <Accordion.Item value={'categories'}>
                    <Accordion.Control >
                        <Text fw={'bold'} fz={'md'} >دسته‌بندی‌ ها</Text>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {categories.length ? (
                            categories.map(item => (
                                <Link key={item.id} href={currentUrlCategory(item.value)}>
                                    <NavLink onClick={() => { setPage(1) }} component='div'
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
            <Box mt={'xl'}>
                <MultiSelect searchable
                    label="استان"
                    value={selectedProvince ? selectedProvince : []}
                    onChange={handleProvinceChange}
                    data={provinces.map((province) => ({
                        value: province.id.toString(),
                        label: province.name,
                    }))}
                />
                <Group mt={'md'} justify='flex-end' wrap='nowrap' >
                    <Button size='xs' onClick={handleOstanFilter} ><Text fz={'xs'}>اعمال فیلتر استان</Text></Button>
                    <Button size='xs' onClick={(e) => handleRemoveParam(e)} variant='outline'><Text fz={'xs'}>حذف</Text></Button>
                </Group>

            </Box>

            <Text mt={'xl'} fw={'bold'} fz={'sm'}> جستجو در نتایج</Text>
            <TextInput mt='xs'
                onKeyDown={handleKeyDown}
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)} rightSection={<ActionIcon onClick={handleSearch} variant='light'>
                    <IconSearch size={13} />
                </ActionIcon>} />
            <Divider mt={'xl'} />
            <Text mt={'lg'} fw={'bold'} fz={'sm'}> قیمت</Text>

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

            <Group mt={'md'} justify='flex-end' wrap='nowrap' >
                <Button size='xs' onClick={handlePrice} ><Text fz={'xs'}>اعمال فیلتر قیمت</Text></Button>
                <Button size='xs' onClick={(e) => handleRemoveParam(e)} variant='outline'><Text fz={'xs'}>حذف</Text></Button>
            </Group>

        </ScrollArea>
    )
}

export default AdsFilter