"use client"

import React from 'react';
import {
    Button,
    Flex,
    Grid,
    Group,
    MultiSelect,
    Radio,
    Select,
    SimpleGrid,
    Stack,
    TagsInput,
    Text,
    TextInput
} from "@mantine/core";
import {useCreateMotherboardMutation} from "@/_redux/services/motherboardApi";
import {isNotEmpty, useForm} from "@mantine/form";
import {ImageCheckbox} from "../../_sharedComponent/CheckboxSelectImage";
import {toFormData} from "@/_utils/utils";
import {notifications} from "@mantine/notifications";
import notifCalsses from "@/_cssModules/notification.module.css";
import {currentMotherboardOnSave} from "@/_redux/features/motherboard";
import {useDispatch} from "react-redux";
import {ActiveStepDTO} from "./page";
import { useGetCpusQuery } from '@/_redux/services';

export type StepProps = {
    setActiveStep: React.Dispatch<React.SetStateAction<ActiveStepDTO>>
    setActive: React.Dispatch<React.SetStateAction<number>>
}
const Step1Form = (props: StepProps) => {
    const [createMotherboard, response] = useCreateMotherboardMutation();
    const {isSuccess, data = [], error} = useGetCpusQuery({})

    const dispatch = useDispatch()
    const form = useForm({
        initialValues: {
            name: '',
            cpu_socket: '',
            brand: '',
            size: '',
            emalls:'',
            torob:'',
            price:'',
            manufacturer: '',
            total_slot_ram: 1,
            ddr3: false,
            cpus: [],
            ddr4: false,
            ddr5: false,
            hdmi_support: false,
            sli_support: false,
            wifi_support: false,
            rgb_support: false,
            attributes: []
        },

        validate: {
            name: isNotEmpty(),
            brand: isNotEmpty(),
            size: isNotEmpty(),
            manufacturer: isNotEmpty(),
        },
    });
    const checkBoxes = [
        {title: 'ddr3', inputname: 'ddr3'},
        {title: 'ddr4', inputname: 'ddr4'},
        {title: 'ddr5', inputname: 'ddr5'},
        {title: 'hdmi support', inputname: 'hdmi_support'},
        {title: 'sli support', inputname: 'sli_support'},
        {title: 'wifi support', inputname: 'wifi_support'},
        {title: 'rgb support', inputname: 'rgb_support'},
    ];
    const items = checkBoxes.map((item) => <ImageCheckbox   {...form.getInputProps(item.inputname)}
                                                            {...item} key={item.title}/>);

    const submitHandleForm = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        createMotherboard(
            {
                name: form.values.name,
                cpu_socket: form.values.cpu_socket,
                brand: form.values.brand,
                size: form.values.size,
                cpus:form.values.cpus,
                price: form.values.price,
                manufacturer: form.values.manufacturer,
                total_slot_ram: form.values.total_slot_ram,
                ddr3: form.values.ddr3,
                ddr4: form.values.ddr4,
                ddr5: form.values.ddr5,
                hdmi_support: form.values.hdmi_support,
                sli_support: form.values.sli_support,
                wifi_support: form.values.wifi_support,
                rgb_support: form.values.rgb_support,
                attributes: form.values.attributes,
                links: JSON.stringify([form.values.torob,form.values.emalls])       

            }
        )
            .unwrap()
            .then((val) => {
                dispatch(currentMotherboardOnSave({id: val.data.id, name: val.data.name}))
                form.onReset
                notifications.show({
                    color: 'green',
                    title: 'مادربرد با موفقیت ثبت شد',
                    message: '',
                    classNames: notifCalsses
                })
                props.setActiveStep('step-2')
                props.setActive(1)
            })
        if (response.isError) {
            notifications.show({
                color: 'red',
                title: 'خطای سرور!',
                message: '',
                classNames: notifCalsses
            })
        }
    }
    return (
        <Stack>
            <Text my={"lg"} fz={"lg"} fw={'bolder'}>افزودن مادربرد</Text>
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
                <Grid>
                    <Grid.Col span={{base: 12, md: 6}}>
                        <TextInput

                            label="نام"
                            placeholder="z690"
                            {...form.getInputProps('name')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{base: 12, md: 6}}>
                        <TextInput
                            label="قیمت"
                            placeholder=""
                            {...form.getInputProps('price')}
                        />
                    </Grid.Col>

                    <Grid.Col span={{base: 12, md: 6}}>
                        <TextInput

                            label="cpu socket"
                            placeholder="LGA 1700"
                            {...form.getInputProps('cpu_socket')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{base: 12, md: 6}}>
                        <Select
                            label="برند"
                            placeholder="Pick value"
                            data={['asus', 'msi']}
                            {...form.getInputProps('brand')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{base: 12, md: 6}}>
                        <Select
                            label="سایز مادربرد"
                            placeholder=""
                            data={['micro', 'mini', 'normal']}
                            {...form.getInputProps('size')}

                        />
                    </Grid.Col>
                    <Grid.Col span={{base: 12, md: 6}}>
                        <MultiSelect
                            styles={{
                                pill: {direction: 'ltr'}
                            }}
                            label="cpu مرتبط"
                            placeholder=""
                             {...form.getInputProps('cpus')}
                            data={data.map(el => ({value:`${el.id}`,label:el.name}))}
                        />
                    </Grid.Col>
                    <Grid.Col span={{base: 12, md: 6}}>
                        <TextInput
                            label="لینک ترب"
                            placeholder=""
                            {...form.getInputProps('torob')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{base: 12, md: 6}}>
                        <TextInput
                            label="لینک ایمالز"
                            placeholder=""
                            {...form.getInputProps('emalls')}
                        />
                    </Grid.Col>
                    <Grid.Col span={{base: 12}}>
                        <Radio.Group
                            name="favoriteFramework"
                            label="AMD یا INTEL"
                            {...form.getInputProps('manufacturer')}
                        >
                            <Flex mt={'sm'}>
                                <Radio ml={'md'} value="amd" label="amd"/>
                                <Radio value="intel" label="intel"/>
                            </Flex>
                        </Radio.Group>
                    </Grid.Col>

                    <Grid.Col span={{base: 12, md: 6}}>
                        <TagsInput {...form.getInputProps('attributes')} label="ram frequency support" placeholder=""/>
                    </Grid.Col>
                    <Grid.Col span={{base: 12, md: 6}}>

                        <TextInput
                            label="تعداد اسلات رم"
                            placeholder="1"
                            {...form.getInputProps('total_slot_ram')}
                        />
                    </Grid.Col>
                </Grid>
                <SimpleGrid mt={'xl'} cols={{base: 1, sm: 2, md: 4}}>{items}</SimpleGrid>
                <Group justify="flex-end" mt="md">
                    <Button disabled={!form.isValid()} onClick={(event) => submitHandleForm(event)}
                            type="submit">ثبت</Button>
                </Group>
            </form>
        </Stack>
    );
};

export default Step1Form;
