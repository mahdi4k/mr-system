"use client"
import React, { useState } from 'react'
import {
    TextInput,
    Checkbox,
    Radio,
    Select,
    Button,
    Group,
    Box,
    Stack,
    Flex,
    MultiSelect,
    SimpleGrid, Container, Grid
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { ImageCheckbox } from "../sharedComponent/CheckboxSelectImage";


const Motherboard = () => {
    const [value, setValue] = useState('react');

    const form = useForm({
        initialValues: {
            email: '',
            termsOfService: false,
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });
    const mockdata = [
        { title: 'ddr3' },
        { title: 'ddr4' },
        { title: 'ddr5' },
        { title: 'hdmi support' },
        { title: 'sli support' },
        { title: 'wifi support' },
        { title: 'rgb support' },
    ];
    const items = mockdata.map((item) => <ImageCheckbox {...item} key={item.title} />);
    return (
        <form onSubmit={form.onSubmit((values) => console.log(values))}>
            <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput

                        label="نام"
                        placeholder="z690"
                        {...form.getInputProps('email')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <TextInput

                        label="cpu socket"
                        placeholder="LGA 1700"
                        {...form.getInputProps('email')}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Select
                        label="برند"
                        placeholder="Pick value"
                        data={['asus', 'msi']}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Select
                        label="سایز مادربرد"
                        placeholder=""
                        data={['micro', 'mini', 'standard']}
                    />
                </Grid.Col>

                <Grid.Col span={{ base: 12 }}>
                    <Radio.Group
                        value={value}
                        onChange={setValue}
                        name="favoriteFramework"
                        label="AMD یا INTEL"

                    >
                        <Flex mt={'sm'}>
                            <Radio ml={'md'} value="amd" label="amd" />
                            <Radio value="intel" label="intel" />
                        </Flex>
                    </Radio.Group>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <MultiSelect
                        data={['React', 'Angular', 'Svelte', 'Vue', 'Riot', 'Next.js', 'Blitz.js']}
                        label="انتخاب cpu"
                        searchable
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <MultiSelect
                        data={['2100', '2300', '3200', '4000']}
                        label="ram frequency support"
                        searchable
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Select
                        label="تعداد اسلات رم"
                        placeholder=""
                        data={['micro', 'mini', 'standard']}
                    />
                </Grid.Col>
            </Grid>
            <SimpleGrid mt={'xl'} cols={{ base: 1, sm: 2, md: 4 }}>{items}</SimpleGrid>
            <Group justify="flex-end" mt="md">
                <Button type="submit">ثبت</Button>
            </Group>

        </form>
    )
}

export default Motherboard
