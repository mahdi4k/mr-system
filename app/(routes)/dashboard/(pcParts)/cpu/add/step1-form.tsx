"use client"

import React from 'react';
import {
    Button,
    Flex,
    Grid,
    Group,
    MultiSelect,
    Radio,
    Stack,
    Text,
    TextInput
} from "@mantine/core";
import {isNotEmpty, useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";
import notifCalsses from "@/_cssModules/notification.module.css";
import {currentCpuOnSave} from "@/_redux/features/cpu";
import {useDispatch} from "react-redux";
import {StepProps} from "../../motherboard/add/step1-form";
import {useCreateCpusMutation} from "@/_redux/services/cpuApi";
import {useGetMotherboardsQuery} from "@/_redux/services/motherboardApi";


const Step1Form = (props: StepProps) => {
    const [createCpu, response] = useCreateCpusMutation();
    const {isSuccess, data = [], error} = useGetMotherboardsQuery({})
    const dispatch = useDispatch()
    const form = useForm({
        initialValues: {
            name: '',
            cpu_socket: '',
            manufacturer: '',
            motherboards: [],
            integrated_graphic: '',
            emalls:'',
            torob:'',
            price:'',
            attributes: []
        },

        validate: {
            manufacturer: isNotEmpty(),
            name: isNotEmpty(),
            cpu_socket: isNotEmpty(),
            motherboards: isNotEmpty(),
        },
    });


    const submitHandleForm = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        createCpu({
            name: form.values.name,
            cpu_socket: form.values.cpu_socket,
            manufacturer: form.values.manufacturer,
            motherboards: form.values.motherboards,
            integrated_graphic: form.values.integrated_graphic,
            price: form.values.price,
            links: JSON.stringify([form.values.torob,form.values.emalls])       
             
        })
            .unwrap()
            .then((val) => {
                dispatch(currentCpuOnSave({id: val.data.id, name: val.data.name}))
                form.onReset
                notifications.show({
                    color: 'green',
                    title: 'cpu با موفقیت ثبت شد',
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
            <Text my={"lg"} fz={"lg"} fw={'bolder'}>افزودن CPU</Text>
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
                <Grid>
                    <Grid.Col span={{base: 12, md: 6}}>
                        <TextInput
                            label="نام"
                            placeholder="core i3"
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
                        <MultiSelect
                            styles={{
                                pill: {direction: 'ltr'}
                            }}
                            label="مادربردهای مرتبط"
                            placeholder=""
                             {...form.getInputProps('motherboards')}
                            data={data.map(el => ({value:`${el.id}`,label:el.name}))}
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
                        <TextInput
                            label="گرافیک مجتمع"
                            placeholder=""
                            {...form.getInputProps('integrated_graphic')}
                        />
                    </Grid.Col>

{/* 
                    <Grid.Col span={{base: 12, md: 6}}>
                        <MultiSelect
                            styles={{
                                pill: {direction: 'ltr'}
                            }}
                            label="نوع رم قابل پشتیبانی"
                            placeholder=""
                            data={['dd3', 'ddr4', 'ddr5']}
                        />
                    </Grid.Col> */}
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
                    <Grid.Col span={{base: 12, md: 6}}>
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
                </Grid>
                <Group justify="flex-end" mt="md">
                    <Button disabled={!form.isValid()} onClick={(event) => submitHandleForm(event)}
                            type="submit">ثبت</Button>
                </Group>
            </form>
        </Stack>
    );
};

export default Step1Form;
