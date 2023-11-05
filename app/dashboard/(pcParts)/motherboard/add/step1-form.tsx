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
import {useCreateMotherboardMutation} from "../../../../redux/services/motherboardApi";
import {isNotEmpty, useForm} from "@mantine/form";
import {ImageCheckbox} from "../../sharedComponent/CheckboxSelectImage";
import {toFormData} from "../../../../utils/utils";
import {notifications} from "@mantine/notifications";
import notifCalsses from "../../../../cssModules/notification.module.css";
import {currentMotherboardOnSave} from "../../../../redux/features/motherboard";
import {useDispatch} from "react-redux";
import {ActiveStepDTO} from "./page";

export type StepProps = {
    setActiveStep: React.Dispatch<React.SetStateAction<ActiveStepDTO>>
    setActive: React.Dispatch<React.SetStateAction<number>>
}
const Step1Form = (props: StepProps) => {
    const [createMotherboard, response] = useCreateMotherboardMutation();
    const dispatch = useDispatch()
    const form = useForm({
        initialValues: {
            name: '',
            cpu_socket: '',
            brand: '',
            size: '',
            manufacturer: '',
            total_slot_ram: 1,
            ddr3: false,
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
        createMotherboard(form.values)
            .unwrap()
            .then((val) => {
                console.log(val)
                dispatch(currentMotherboardOnSave({id: val.data.id, name: val.data.name}))
                form.onReset
                notifications.show({
                    color: 'green',
                    title: 'مادربورد با موفقیت ثبت شد',
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
            <Text my={"lg"} fz={"lg"} fw={'bolder'}>افزودن مادربورد</Text>
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
