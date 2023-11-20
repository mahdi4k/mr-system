import React, {useEffect, useRef, useState} from 'react';
import ImageUpload from "../../(sharedComponent)/imageUpload";
import {dataURItoBlob, toFormData} from "@/_utils/utils";
import {CropperRef} from "react-advanced-cropper";
import {useDisclosure} from "@mantine/hooks";
import {Button, Flex, Text} from "@mantine/core";
import {useSelector} from "react-redux";
import {RootState} from "@/_redux/store";
import {useAddMotherboardImageMutation} from "@/_redux/services/motherboardApi";
import {notifications} from "@mantine/notifications";
import notifClasses from "@/_cssModules/notification.module.css";
import {ActiveStepDTO} from "./page";

type Iprops = {
    setActiveStep: React.Dispatch<React.SetStateAction<ActiveStepDTO>>
    setActive: React.Dispatch<React.SetStateAction<number>>
}
const Step2Image = (props: Iprops) => {
    const [previewLogo, setPreviewLogo] = useState<string | undefined>()
    const cropperRef = useRef<CropperRef>(null)
    const [opened, handlers] = useDisclosure(false)
    const [logo, setLogo] = useState<File | undefined>()
    const [addMotherboardImage, response] = useAddMotherboardImageMutation();

    const currentMotherboard = useSelector((state: RootState) => state.motherboard.currentMotherBoard)
    const onSubmitAvatar = async () => {
        setPreviewLogo(cropperRef.current ? cropperRef.current.getCanvas()?.toDataURL() : undefined)
        if (cropperRef.current) {
            setLogo(await dataURItoBlob(cropperRef.current.getCanvas()?.toDataURL()))
        }
        handlers.close()
    }

    const backToLevelOne = ()=>{
        props.setActiveStep('step-1')
        props.setActive(0)
    }
    useEffect(() => {
        if (logo) {
            addMotherboardImage({
                id: currentMotherboard.id,
                logo: toFormData({
                    image: logo,
                })
            }).unwrap()
                .then((val) => {
                    console.log(val)
                    notifications.show({
                        color: 'green',
                        title: 'تصویر مادربورد با موفقیت ثبت شد',
                        message: '',
                        classNames: notifClasses
                    })
                })
        }
    }, [addMotherboardImage, currentMotherboard.id, logo])
    return (
        <>
            <Text mt={"lg"} fz={"lg"} fw={"bold"} mr={"lg"}>افزودن تصویر برای مادربورد {currentMotherboard.name}  </Text>
            <Flex direction={'column'} align={'center'} justify={'center'}>
                <ImageUpload currentImage={previewLogo} handlers={handlers} opened={opened}
                             cropperRef={cropperRef}
                             onSubmit={onSubmitAvatar}/>
            </Flex>

           <Flex justify={'flex-end'} mt={'xl'}>
               <Button onClick={backToLevelOne}>افزودن مادربودر جدید</Button>
           </Flex>
        </>
    );
};

export default Step2Image;
