"use client";

import React from "react";
import {
  Button,
  Checkbox,
  Flex,
  Grid,
  Group,
  Radio,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import notifCalsses from "@/_cssModules/notification.module.css";
import { currentCaseOnSave } from "@/_redux/features/case";
import { useDispatch } from "react-redux";
import { StepProps } from "../../motherboard/add/step1-form";
import { useCreateCaseMutation } from "@/_redux/services/caseApi";
import FormFields from "../FormFields";

const Step1Form = (props: StepProps) => {
  const [createCase, response] = useCreateCaseMutation();

  const dispatch = useDispatch();
  const form = useForm({
    initialValues: {
      name: "",
      max_total_fan: "",
      rgb: false,
      brand: "",
      form: "",
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
    createCase({
      name: form.values.name,
      form: form.values.form,
      max_total_fan: form.values.max_total_fan,
      rgb: form.values.rgb,
      brand: form.values.brand,
      price: form.values.price,
      links: JSON.stringify([form.values.torob, form.values.emalls]),
    })
      .unwrap()
      .then((val) => {
        dispatch(currentCaseOnSave({ id: val.data.id, name: val.data.name }));
        form.onReset;
        notifications.show({
          color: "green",
          title: "case با موفقیت ثبت شد",
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
        افزودن case
      </Text>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <FormFields form={form} />

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
