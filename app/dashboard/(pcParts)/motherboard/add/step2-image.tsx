import React, {useRef, useState} from 'react';
import ImageUpload from "../../(sharedComponent)/imageUpload";
import {dataURItoBlob} from "../../../../utils/utils";
import {CropperRef} from "react-advanced-cropper";
import {useDisclosure} from "@mantine/hooks";
import {Flex} from "@mantine/core";

const Step2Image = () => {
    const [previewLogo, setPreviewLogo] = useState<string | undefined>()
    const cropperRef = useRef<CropperRef>(null)
    const [opened, handlers] = useDisclosure(false)
    const [logo, setLogo] = useState<File | undefined>()
    const onSubmitAvatar = async () => {
        setPreviewLogo(cropperRef.current ? cropperRef.current.getCanvas()?.toDataURL() : undefined)
        if (cropperRef.current) {
            setLogo(await dataURItoBlob(cropperRef.current.getCanvas()?.toDataURL()))
        }
        handlers.close()
    }
    return (
        <Flex align={'center'} justify={'center'}>
            <ImageUpload currentImage={previewLogo} handlers={handlers} opened={opened}
                         cropperRef={cropperRef}
                         onSubmit={onSubmitAvatar}/>
        </Flex>
    );
};

export default Step2Image;
