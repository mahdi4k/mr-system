"use client";

import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Loader,
  Progress,
  Stack,
  Text,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhotoPlus, IconTrash } from "@tabler/icons-react";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import classes from "./ads-image-form.module.css";

interface AdsImageFormProps {
  images: File[];
  maxImages?: number;
  onProcessingChange: (processing: boolean) => void;
  setImages: Dispatch<SetStateAction<File[]>>;
}

const MAX_IMAGES = 3;
const MAX_SOURCE_SIZE = 10 * 1024 ** 2;
const COMPRESSION_THRESHOLD = 700 * 1024;

async function prepareImage(file: File): Promise<File> {
  if (file.size <= COMPRESSION_THRESHOLD || file.type === "image/gif") {
    return file;
  }

  const compressed = await imageCompression(file, {
    alwaysKeepResolution: false,
    fileType: "image/webp",
    initialQuality: 0.82,
    maxIteration: 8,
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1600,
    preserveExif: false,
    useWebWorker: true,
  });
  return new File([compressed], `${file.name.replace(/\.[^.]+$/, "")}.webp`, {
    lastModified: Date.now(),
    type: compressed.type,
  });
}

function ImagePreview({
  file,
  isCover,
  onRemove,
}: {
  file: File;
  isCover: boolean;
  onRemove: () => void;
}) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <Box className={classes.preview}>
      <ActionIcon
        aria-label="حذف تصویر"
        color="red"
        onClick={onRemove}
        pos="absolute"
        size="sm"
        style={{ left: 8, top: 8, zIndex: 2 }}
        variant="filled"
      >
        <IconTrash size={14} />
      </ActionIcon>
      {url && (
        <Image
          alt="پیش‌نمایش تصویر آگهی"
          fill
          sizes="108px"
          src={url}
          style={{ objectFit: "cover" }}
          unoptimized
        />
      )}
      {isCover && (
        <Badge className={classes.coverBadge} color="dark" size="xs">
          تصویر اصلی
        </Badge>
      )}
    </Box>
  );
}

export default function AdsImageForm({
  images,
  maxImages = MAX_IMAGES,
  onProcessingChange,
  setImages,
}: AdsImageFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [preparedCount, setPreparedCount] = useState(0);
  const [preparingTotal, setPreparingTotal] = useState(0);
  const openRef = useRef<() => void>(null);

  const handleImageUpload = async (files: File[]) => {
    if (images.length + files.length > maxImages) {
      setError(`حداکثر ${maxImages} تصویر دیگر قابل انتخاب است.`);
      return;
    }
    if (files.some((file) => file.size > MAX_SOURCE_SIZE)) {
      setError("حجم هر تصویر باید کمتر از ۱۰ مگابایت باشد.");
      return;
    }

    setError(null);
    setProcessing(true);
    onProcessingChange(true);
    setPreparedCount(0);
    setPreparingTotal(files.length);
    try {
      const results = await Promise.allSettled(
        files.map(async (file) => {
          const prepared = await prepareImage(file);
          setPreparedCount((count) => count + 1);
          return prepared;
        }),
      );
      const preparedFiles = results.flatMap((result) =>
        result.status === "fulfilled" ? [result.value] : [],
      );
      if (preparedFiles.length !== files.length) {
        setError("بعضی از تصاویر آماده نشدند. دوباره تلاش کنید.");
      }
      setImages((current) => [...current, ...preparedFiles]);
    } finally {
      setProcessing(false);
      onProcessingChange(false);
      setPreparedCount(0);
      setPreparingTotal(0);
    }
  };

  return (
    <Box>
      <Group justify="space-between" mb="xs">
        <Box>
          <Text c="dimmed" fz="xs">
            JPG، PNG یا WebP، حداکثر ۳ تصویر و هرکدام تا ۱۰ مگابایت
          </Text>
        </Box>
        <Text c="dimmed" fz="xs">
          {images.length} از {maxImages}
        </Text>
      </Group>

      {processing && (
        <Box mb="sm">
          <Group gap="xs" mb={5}>
            <Loader size="xs" />
            <Text fz="xs">در حال بهینه‌سازی تصاویر...</Text>
          </Group>
          <Progress
            animated
            value={preparingTotal ? (preparedCount / preparingTotal) * 100 : 0}
          />
        </Box>
      )}

      {images.length < maxImages && (
        <Dropzone
          accept={IMAGE_MIME_TYPE}
          className={classes.dropzone}
          disabled={processing}
          maxSize={MAX_SOURCE_SIZE}
          multiple
          onDrop={handleImageUpload}
          onReject={() => setError("فرمت یا حجم تصویر قابل قبول نیست.")}
          openRef={openRef}
        >
          <Stack align="center" gap="sm" justify="center" mih={130} py="sm">
            <Box className={classes.uploadIcon}>
              <IconPhotoPlus size={27} />
            </Box>
            <Text fw={700} ta="center">
              عکس‌ها را اینجا رها کنید
            </Text>
            <Text c="dimmed" fz="sm" ta="center">
              یا برای انتخاب از دستگاه کلیک کنید
            </Text>
          </Stack>
        </Dropzone>
      )}

      {images.length > 0 && (
        <div className={classes.previewGrid}>
          {images.map((file, index) => (
            <ImagePreview
              file={file}
              isCover={index === 0}
              key={`${file.name}-${file.lastModified}-${index}`}
              onRemove={() =>
                setImages((current) =>
                  current.filter((_, itemIndex) => itemIndex !== index),
                )
              }
            />
          ))}
          {images.length < maxImages && (
            <button
              aria-label="افزودن تصویر دیگر"
              className={classes.preview}
              disabled={processing}
              onClick={() => openRef.current?.()}
              style={{ cursor: "pointer" }}
              type="button"
            >
              <Stack align="center" gap={4} justify="center" h="100%">
                <IconPhotoPlus color="var(--mantine-color-green-7)" size={25} />
                <Text c="green.7" fz="xs" fw={600}>
                  افزودن عکس
                </Text>
              </Stack>
            </button>
          )}
        </div>
      )}
      {error && (
        <Text c="red" fz="xs" mt="xs">
          {error}
        </Text>
      )}
    </Box>
  );
}
