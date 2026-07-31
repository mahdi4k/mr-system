"use client";

import React, { useEffect } from "react";
import {
  Button,
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
import {
  useGetCaseQuery,
  useUpdateCaseMutation,
} from "@/_redux/services/caseApi";
import { useGetMotherboardsQuery } from "@/_redux/services/motherboardApi";
import { StepProps } from "(routes)/dashboard/(pcParts)/motherboard/add/step1-form";
import { useParams } from "next/navigation";
import FormFields from "../../FormFields";

const Step1Form = (props: StepProps) => {
  const [updateCase, response] = useUpdateCaseMutation();
  const { isSuccess, data = [], error } = useGetMotherboardsQuery({});
  const router = useParams();
  const { data: caseData, isSuccess: isSuccessCase } = useGetCaseQuery({
    id: router.id as string,
  });
  useEffect(() => {
    if (isSuccessCase) {
      form.setInitialValues({
        name: caseData.data.name,
        form: caseData.data.form,
        rgb: caseData.data.rgb,
        max_total_fan: caseData.data.max_total_fan,
        brand: caseData.data.brand ? caseData.data.brand : "",
        emalls: caseData.data.links ? JSON.parse(caseData.data.links)[1] : "",
        torob: caseData.data.links ? JSON.parse(caseData.data.links)[0] : "",
        price: caseData.data.price ? caseData.data.price : "",
      });
      form.setValues({
        name: caseData.data.name,
        form: caseData.data.form,
        rgb: caseData.data.rgb,
        max_total_fan: caseData.data.max_total_fan,
        brand: caseData.data.brand ? caseData.data.brand : "",
        emalls: caseData.data.links ? JSON.parse(caseData.data.links)[1] : "",
        torob: caseData.data.links ? JSON.parse(caseData.data.links)[0] : "",
        price: caseData.data.price ? caseData.data.price : "",
      });
    }
  }, [isSuccessCase]);

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
    updateCase({
      id: router.id,
      name: form.values.name,
      max_total_fan: form.values.max_total_fan,
      form: form.values.form,
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
          title: "case با موفقیت ویرایش شد",
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
        ویرایش case
      </Text>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <FormFields form={form} />

        <Group justify="flex-end" mt="md">
          <Button
            disabled={!form.isValid()}
            onClick={(event) => submitHandleForm(event)}
            type="submit"
          >
            ویرایش
          </Button>
        </Group>
      </form>
    </Stack>
  );
};

export default Step1Form;
