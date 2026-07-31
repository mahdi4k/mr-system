import React, { useRef, useState } from "react";
import { Cropper, CropperRef, RectangleStencil } from "react-advanced-cropper";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { ActionIcon, Avatar, Flex, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import "react-advanced-cropper/dist/style.css";
import "@mantine/dropzone/styles.css";
import {
  IconAlertTriangle,
  IconCheck,
  IconEdit,
  IconPhotoSquareRounded,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";

type IProps = {
  currentImage?: string;
  opened: boolean;
  handlers: {
    readonly open: () => void;
    readonly close: () => void;
    readonly toggle: () => void;
  };
  cropperRef: React.RefObject<CropperRef>;
  onSubmit: () => Promise<void>;
};
const ImageUpload = ({
  onSubmit,
  currentImage,
  cropperRef,
  handlers,
  opened,
}: IProps) => {
  const openRef = useRef<() => void>(null);
  const [image, setImage] = useState<string>("");

  const onDrop = (fileWithPath: FileWithPath) => {
    setImage(URL.createObjectURL(fileWithPath));
    handlers.open();
  };
  const removeSelectedImage = () => {
    handlers.close();
    setImage("");
  };
  const dropZoneShowErrorMessage = (error: string) => {
    notifications.show({
      message: error === "file-too-large" ? "سایز فایل بیش از حد است" : "",
      autoClose: 6000,
    });
  };
  return (
    <>
      {opened ? (
        <div style={{ maxWidth: "210px", maxHeight: "210px" }}>
          <Cropper
            ref={cropperRef}
            src={image}
            stencilProps={{
              width: 200,
              height: 200,
            }}
            stencilComponent={RectangleStencil}
          />
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <Dropzone
            onDrop={(files) => onDrop(files[0])}
            openRef={openRef}
            onReject={(files) =>
              dropZoneShowErrorMessage(files[0].errors[0].code)
            }
            maxSize={1000000}
            accept={IMAGE_MIME_TYPE}
            w={200}
            h={200}
            styles={() => ({
              root: {
                borderRadius: "5%",
                margin: "auto",
                padding: "5px",
                [`&:hover`]: {
                  opacity: ".9",
                },
              },
              inner: {
                height: "100%",
              },
            })}
          >
            <Group
              style={{
                height: "100%",
                width: "100%",
                pointerEvents: "none",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Dropzone.Accept>
                <IconUpload size="3.5rem" />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconAlertTriangle size="3.2rem" />
              </Dropzone.Reject>
              <Dropzone.Idle>
                {currentImage ? (
                  <Avatar
                    styles={() => ({
                      root: {
                        borderRadius: "10%",
                      },
                    })}
                    size="100%"
                    src={currentImage}
                  />
                ) : (
                  <IconPhotoSquareRounded color={"gray"} size="7.2rem" />
                )}
              </Dropzone.Idle>
            </Group>
          </Dropzone>
          <div
            onClick={() => openRef?.current?.()}
            style={{
              position: "absolute",
              left: "6px",
              bottom: 0,
              width: "22px",
              cursor: "pointer",
            }}
          >
            <IconEdit color={"gray"} />
          </div>
        </div>
      )}
      {opened ? (
        <Flex>
          <ActionIcon m={"sm"} variant={"light"} radius={"xl"}>
            <IconTrash onClick={removeSelectedImage} size="1.125rem" />
          </ActionIcon>
          <ActionIcon m={"sm"} variant={"light"} radius={"xl"}>
            <IconCheck onClick={onSubmit} size="1.125rem" />
          </ActionIcon>
        </Flex>
      ) : (
        ""
      )}
    </>
  );
};

export default ImageUpload;
