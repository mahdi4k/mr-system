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
    Stack,
    Text,
    TextInput
} from "@mantine/core";
import {isNotEmpty, useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";
import notifCalsses from "@/_cssModules/notification.module.css";
import {currentGraphicOnSave} from "@/_redux/features/graphic";
import {useDispatch} from "react-redux";
import {StepProps} from "../../motherboard/add/step1-form";
import { useCreateGraphicMutation } from '@/_redux/services/graphicApi';
import { useGetPowersQuery } from '@/_redux/services/PowerApi';


const Step1Form = (props: StepProps) => {
    const [createGraphic, response] = useCreateGraphicMutation();
    const {isSuccess, data = [], error} = useGetPowersQuery();
    const dispatch = useDispatch();
    const form = useForm({
        initialValues: {
            name: '',
            brand:'',
            manufacturer: '',
            powers: [],
            attributes: [],
            psu:''
        },

        validate: {
            name: isNotEmpty(),
            powers: isNotEmpty(),
            psu: isNotEmpty(),
            brand: isNotEmpty(),
        },
    });


    const submitHandleForm = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        createGraphic(form.values)
            .unwrap()
            .then((val) => {
                console.log(val)
                dispatch(currentGraphicOnSave({id: val.data.id, name: val.data.name}))
                form.onReset
                notifications.show({
                    color: 'green',
                    title: 'گرافیک با موفقیت ثبت شد',
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
            <Text my={"lg"} fz={"lg"} fw={'bolder'}>افزودن گرافیک  </Text>
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
                        <Select
                            label="برند"
                            placeholder="Pick value"
                            data={['asus', 'msi']}
                            {...form.getInputProps('brand')}
                        />
                    </Grid.Col>
                     <Grid.Col span={{base: 12, md: 6}}>
                        <MultiSelect
                            styles={{
                                pill: {direction: 'ltr'}
                            }}
                            label="power مرتبط"
                            placeholder=""
                             {...form.getInputProps('powers')}
                            data={data.map(el => ({value:`${el.id}`,label:el.name}))}
                        />
                    </Grid.Col>

                    <Grid.Col span={{base: 12, md: 6}}>
                        <TextInput
                            label="psu"
                            placeholder="550w"
                            {...form.getInputProps('psu')}
                        />
                    </Grid.Col>

                    <Grid.Col span={{base: 12}}>
                        <Radio.Group
                            name="favoriteFramework"
                            label="AMD یا NVIDIA"
                            {...form.getInputProps('manufacturer')}
                        >
                            <Flex mt={'sm'}>
                                <Radio ml={'md'} value="amd" label="amd"/>
                                <Radio value="nvidia" label="nvidia"/>
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
