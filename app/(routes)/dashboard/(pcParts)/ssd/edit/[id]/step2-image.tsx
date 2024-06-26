import React, {useEffect, useRef, useState} from 'react';
import {dataURItoBlob, toFormData} from "@/_utils/utils";
import {CropperRef} from "react-advanced-cropper";
import {useDisclosure} from "@mantine/hooks";
import {Button, Flex, Text} from "@mantine/core";
import {useSelector} from "react-redux";
import {RootState} from "@/_redux/store";
import {notifications} from "@mantine/notifications";
import notifClasses from "@/_cssModules/notification.module.css";
import {ActiveStepDTO} from "./page";
import { useAddSsdImageMutation } from '@/_redux/services/ssdApi';
import ImageUpload from '(routes)/dashboard/(pcParts)/_sharedComponent/imageUpload';
 
type Iprops = {
    setActiveStep: React.Dispatch<React.SetStateAction<ActiveStepDTO>>
    setActive: React.Dispatch<React.SetStateAction<number>>
}
const Step2Image = (props: Iprops) => {
    const [previewLogo, setPreviewLogo] = useState<string | undefined>()
    const cropperRef = useRef<CropperRef>(null)
    const [opened, handlers] = useDisclosure(false)
    const [logo, setLogo] = useState<File | undefined>()
    const [addSsdImage, response] = useAddSsdImageMutation();

    const currentSsd = useSelector((state: RootState) => state.ssd.currentSsd)
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
            addSsdImage({
                id: currentSsd.id,
                logo: toFormData({
                    image: logo,
                })
            }).unwrap()
                .then((val) => {
                    notifications.show({
                        color: 'green',
                        title: 'تصویر ssd با موفقیت ثبت شد',
                        message: '',
                        classNames: notifClasses
                    })
                })
        }
    }, [addSsdImage, currentSsd.id, logo])
    return (
        <>
            <Text mt={"lg"} fz={"lg"} fw={"bold"} mr={"lg"}>افزودن تصویر برای ssd {currentSsd.name}  </Text>
            <Flex direction={'column'} align={'center'} justify={'center'}>
                <ImageUpload currentImage={previewLogo} handlers={handlers} opened={opened}
                             cropperRef={cropperRef}
                             onSubmit={onSubmitAvatar}/>
            </Flex>

           <Flex justify={'flex-end'} mt={'xl'}>
               <Button onClick={backToLevelOne}>افزودن ssd جدید</Button>
           </Flex>
        </>
    );
};

export default Step2Image;
