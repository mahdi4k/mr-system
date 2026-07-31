"use client";

import React from "react";
import {
  Button,
  Grid,
  Group,
  MultiSelect,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import notifCalsses from "@/_cssModules/notification.module.css";
import { currentRamOnSave } from "@/_redux/features/ram";
import { useDispatch } from "react-redux";
import { StepProps } from "../../motherboard/add/step1-form";
import { useCreateRamMutation } from "@/_redux/services/ramApi";
import { ImageCheckbox } from "../../_sharedComponent/CheckboxSelectImage";
import { useGetMotherboardsQuery } from "@/_redux/services/motherboardApi";

const Step1Form = (props: StepProps) => {
  const [createRam, response] = useCreateRamMutation();
  const { isSuccess, data = [], error } = useGetMotherboardsQuery({});

  const dispatch = useDispatch();
  const form = useForm({
    initialValues: {
      name: "",
      ddr3: false,
      ddr4: false,
      ddr5: false,
      motherboards: [],
      brand: "",
      frequency: "",
      emalls: "",
      torob: "",
      price: "",
    },

    validate: {
      brand: isNotEmpty(),
      name: isNotEmpty(),
    },
  });

  const submitHandleForm = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    createRam({
      name: form.values.name,
      ddr3: form.values.ddr3,
      ddr4: form.values.ddr4,
      ddr5: form.values.ddr5,
      frequency: form.values.frequency,
      motherboards: form.values.motherboards,
      brand: form.values.brand,
      price: form.values.price,
      links: JSON.stringify([form.values.torob, form.values.emalls]),
    })
      .unwrap()
      .then((val) => {
        dispatch(currentRamOnSave({ id: val.data.id, name: val.data.name }));
        form.onReset;
        notifications.show({
          color: "green",
          title: "ram با موفقیت ثبت شد",
          message: "",
          classNames: notifCalsses,
        });
        props.setActiveStep("step-2");
        props.setActive(1);
      });
    if (response.isError) {
      notifications.show({
        color: "red",
        title: "خطای سرور!",
        message: "",
        classNames: notifCalsses,
      });
    }
  };

  const checkBoxes = [
    { title: "ddr3", inputname: "ddr3" },
    { title: "ddr4", inputname: "ddr4" },
    { title: "ddr5", inputname: "ddr5" },
  ];
  const items = checkBoxes.map((item) => (
    <ImageCheckbox
      {...form.getInputProps(item.inputname)}
      {...item}
      key={item.title}
    />
  ));

  return (
    <Stack>
      <Text my={"lg"} fz={"lg"} fw={"bolder"}>
        افزودن رم
      </Text>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="نام"
              placeholder=" "
              {...form.getInputProps("name")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="قیمت"
              placeholder=""
              {...form.getInputProps("price")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <MultiSelect
              styles={{
                pill: { direction: "ltr" },
              }}
              label="مادربردهای مرتبط"
              placeholder=""
              {...form.getInputProps("motherboards")}
              data={data.map((el) => ({ value: `${el.id}`, label: el.name }))}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="برند"
              placeholder=""
              {...form.getInputProps("brand")}
              data={["KINGSTON", "Crucial", "Samsung"]}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="فرکانس"
              placeholder=""
              {...form.getInputProps("frequency")}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="لینک ترب"
              placeholder=""
              {...form.getInputProps("torob")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="لینک ایمالز"
              placeholder=""
              {...form.getInputProps("emalls")}
            />
          </Grid.Col>
        </Grid>
        <SimpleGrid mt={"xl"} cols={{ base: 1, sm: 2, md: 4 }}>
          {items}
        </SimpleGrid>

        <Group justify="flex-end" mt="md">
          <Button
            disabled={!form.isValid()}
            onClick={(event) => submitHandleForm(event)}
            type="submit"
          >
            ثبت
          </Button>
        </Group>
      </form>
    </Stack>
  );
};

export default Step1Form;
