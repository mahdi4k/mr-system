"use client";

import React from "react";
import {
  Button,
  Grid,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import notifCalsses from "@/_cssModules/notification.module.css";
import { currentPowerOnSave } from "@/_redux/features/power";
import { useDispatch } from "react-redux";
import { StepProps } from "../../motherboard/add/step1-form";
import { useCreatePowerMutation } from "@/_redux/services/powerApi";

const Step1Form = (props: StepProps) => {
  const [createPower, response] = useCreatePowerMutation();
  const dispatch = useDispatch();
  const form = useForm({
    initialValues: {
      name: "",
      psu: "",
      brand: "",
      emalls: "",
      torob: "",
      price: "",
      modular: "",
      attributes: [],
    },

    validate: {
      brand: isNotEmpty(),
      name: isNotEmpty(),
      psu: isNotEmpty(),
    },
  });

  const submitHandleForm = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    createPower({
      name: form.values.name,
      psu: form.values.psu,
      brand: form.values.brand,
      price: form.values.price,
      modular: form.values.modular,
      attributes: form.values.attributes,
      links: JSON.stringify([form.values.torob, form.values.emalls]),
    })
      .unwrap()
      .then((val) => {
        dispatch(currentPowerOnSave({ id: val.data.id, name: val.data.name }));
        form.onReset;
        notifications.show({
          color: "green",
          title: "power با موفقیت ثبت شد",
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
  return (
    <Stack>
      <Text my={"lg"} fz={"lg"} fw={"bolder"}>
        افزودن پاور
      </Text>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="نام"
              placeholder="green 600w"
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
            <TextInput
              label="توان خروجی"
              placeholder=" 600w"
              {...form.getInputProps("psu")}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="برند"
              placeholder=""
              {...form.getInputProps("brand")}
              data={["green", "Cooler Master", "DeepCool", "MSI"]}
            />
          </Grid.Col>
          <Grid.Col
            style={{ display: "flex", alignItems: "flex-end" }}
            span={{ base: 12, md: 6 }}
          >
            <Select
              w={"100%"}
              {...form.getInputProps("modular")}
              label="ماژولار"
              data={[
                { value: "1", label: "غیر ماژولار" },
                { value: "2", label: "نیمه ماژولار" },
                { value: "3", label: "کاملار ماژولار" },
              ]}
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
