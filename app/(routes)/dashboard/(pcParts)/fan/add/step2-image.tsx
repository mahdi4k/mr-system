import React, { useEffect, useRef, useState } from "react";
import ImageUpload from "../../_sharedComponent/imageUpload";
import { dataURItoBlob, toFormData } from "@/_utils/utils";
import { CropperRef } from "react-advanced-cropper";
import { useDisclosure } from "@mantine/hooks";
import { Button, Flex, Text } from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "@/_redux/store";
import { notifications } from "@mantine/notifications";
import notifClasses from "@/_cssModules/notification.module.css";
import { ActiveStepDTO } from "./page";
import { useAddFanImageMutation } from "@/_redux/services/fanApi";

type Iprops = {
  setActiveStep: React.Dispatch<React.SetStateAction<ActiveStepDTO>>;
  setActive: React.Dispatch<React.SetStateAction<number>>;
};
const Step2Image = (props: Iprops) => {
  const [previewLogo, setPreviewLogo] = useState<string | undefined>();
  const cropperRef = useRef<CropperRef>(null);
  const [opened, handlers] = useDisclosure(false);
  const [logo, setLogo] = useState<File | undefined>();
  const [addFanImage, response] = useAddFanImageMutation();

  const currentFan = useSelector((state: RootState) => state.fan.currentFan);
  const onSubmitAvatar = async () => {
    setPreviewLogo(
      cropperRef.current
        ? cropperRef.current.getCanvas()?.toDataURL()
        : undefined,
    );
    if (cropperRef.current) {
      setLogo(await dataURItoBlob(cropperRef.current.getCanvas()?.toDataURL()));
    }
    handlers.close();
  };

  const backToLevelOne = () => {
    props.setActiveStep("step-1");
    props.setActive(0);
  };
  useEffect(() => {
    if (logo) {
      addFanImage({
        id: currentFan.id,
        logo: toFormData({
          image: logo,
        }),
      })
        .unwrap()
        .then((val) => {
          notifications.show({
            color: "green",
            title: "تصویر فن با موفقیت ثبت شد",
            message: "",
            classNames: notifClasses,
          });
        });
    }
  }, [addFanImage, currentFan.id, logo]);
  return (
    <>
      <Text mt={"lg"} fz={"lg"} fw={"bold"} mr={"lg"}>
        افزودن تصویر برای fan {currentFan.name}{" "}
      </Text>
      <Flex direction={"column"} align={"center"} justify={"center"}>
        <ImageUpload
          currentImage={previewLogo}
          handlers={handlers}
          opened={opened}
          cropperRef={cropperRef}
          onSubmit={onSubmitAvatar}
        />
      </Flex>

      <Flex justify={"flex-end"} mt={"xl"}>
        <Button onClick={backToLevelOne}>افزودن فن جدید</Button>
      </Flex>
    </>
  );
};

export default Step2Image;
