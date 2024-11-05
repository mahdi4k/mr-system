import { Grid, TextInput, Select, Radio, Flex, Checkbox } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form';
import React, { FC } from 'react'

type props = {
    form: UseFormReturnType<{
        name: string;
        max_total_fan: string;
        rgb: boolean;
        brand: string;
        form: string;
        emalls: string;
        torob: string;
        price: string;
    }, (values: {
        name: string;
        max_total_fan: string;
        rgb: boolean;
        brand: string;
        form: string;
        emalls: string;
        torob: string;
        price: string;
    }) => {
        name: string;
        max_total_fan: string;
        rgb: boolean;
        brand: string;
        form: string;
        emalls: string;
        torob: string;
        price: string;
    }>
}
const FormFields: FC<props> = ({ form }) => {
    return (
        <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                    label="نام"
                    placeholder=" "
                    {...form.getInputProps('name')}
                />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                    label="قیمت"
                    placeholder=""
                    {...form.getInputProps('price')}
                />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                    label="برند"
                    placeholder=""
                    {...form.getInputProps('brand')}
                    data={['Green', 'Crucial', 'Awest', 'MSI']}
                />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                    label="تعداد فن"
                    placeholder=" "
                    {...form.getInputProps('max_total_fan')}
                />
            </Grid.Col>

            <Grid.Col span={{ base: 6 }}>
                <Radio.Group
                    name="favoriteFramework"
                    label=" فرم کیس"
                    {...form.getInputProps('form')}
                >
                    <Flex mt={'sm'}>
                        <Radio ml={'md'} value="mid_tower" label="Mid Tower" />
                        <Radio value="full_tower" label="Full Tower" />
                        <Radio value="mini_tower" label="Mini Tower" />
                    </Flex>
                </Radio.Group>
            </Grid.Col>
            <Grid.Col span={{ base: 6 }}>
                <Checkbox
                    {...form.getInputProps('rgb')}
                    label="rgb"
                />
            </Grid.Col>


            <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                    label="لینک ترب"
                    placeholder=""
                    {...form.getInputProps('torob')}
                />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                    label="لینک ایمالز"
                    placeholder=""
                    {...form.getInputProps('emalls')}
                />
            </Grid.Col>
        </Grid>
    )
}

export default FormFields