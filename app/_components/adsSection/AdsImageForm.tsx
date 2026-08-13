"use client";

import {
  ActionIcon,
  Box,
  Flex,
  Group,
  Loader,
  Progress,
  Text,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconCamera, IconPlus, IconTrash } from "@tabler/icons-react";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

interface AdsImageFormProps {
  images: File[];
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
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <Box
      h={{ base: 80, sm: 108 }}
      pos="relative"
      style={{ borderRadius: 8, overflow: "hidden" }}
      w={{ base: 88, sm: 108 }}
    >
      <ActionIcon
        aria-label="حذف تصویر"
        color="red"
        onClick={onRemove}
        pos="absolute"
        size="sm"
        style={{ left: 6, top: 6, zIndex: 2 }}
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
    </Box>
  );
}

export default function AdsImageForm({
  images,
  onProcessingChange,
  setImages,
}: AdsImageFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [preparedCount, setPreparedCount] = useState(0);
  const [preparingTotal, setPreparingTotal] = useState(0);
  const openRef = useRef<() => void>(null);

  const handleImageUpload = async (files: File[]) => {
    if (images.length + files.length > MAX_IMAGES) {
      setError("حداکثر تعداد عکس ۳ است.");
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
    <Box mb="xl" mt="xl">
      <Group justify="space-between" mb="xs">
        <Box>
          <Text fw={600} fz="sm">
            عکس‌های آگهی
          </Text>
          <Text c="dimmed" fz="xs">
            حداکثر ۳ تصویر، هر تصویر تا ۱۰ مگابایت
          </Text>
        </Box>
        <Text c="dimmed" fz="xs">
          {images.length} از {MAX_IMAGES}
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

      <Flex gap="xs" style={{ overflowX: "auto" }}>
        {images.length < MAX_IMAGES && (
          <Dropzone
            accept={IMAGE_MIME_TYPE}
            disabled={processing}
            maxSize={MAX_SOURCE_SIZE}
            multiple
            onDrop={handleImageUpload}
            onReject={() => setError("فرمت یا حجم تصویر قابل قبول نیست.")}
            openRef={openRef}
            p={0}
            styles={{ root: { border: 0 } }}
          >
            <Flex
              align="center"
              direction="column"
              h={{ base: 80, sm: 108 }}
              justify="center"
              style={{
                border: "1px dashed var(--mantine-primary-color-filled)",
                borderRadius: 8,
                cursor: processing ? "wait" : "pointer",
              }}
              w={{ base: 88, sm: 108 }}
            >
              <IconPlus color="var(--mantine-primary-color-filled)" size={22} />
              <Text c="var(--mantine-primary-color-filled)" fz="xs">
                افزودن عکس
              </Text>
            </Flex>
          </Dropzone>
        )}

        {images.map((file, index) => (
          <ImagePreview
            file={file}
            key={`${file.name}-${file.lastModified}-${index}`}
            onRemove={() =>
              setImages((current) =>
                current.filter((_, itemIndex) => itemIndex !== index),
              )
            }
          />
        ))}

        {Array.from({
          length: Math.max(MAX_IMAGES - images.length - 1, 0),
        }).map((_, index) => (
          <Flex
            align="center"
            direction="column"
            h={{ base: 80, sm: 108 }}
            justify="center"
            key={index}
            onClick={() => !processing && openRef.current?.()}
            style={{
              border: "1px dashed var(--mantine-color-gray-4)",
              borderRadius: 8,
              cursor: processing ? "wait" : "pointer",
            }}
            w={{ base: 88, sm: 108 }}
          >
            <IconCamera color="var(--mantine-color-gray-5)" size={26} />
          </Flex>
        ))}
      </Flex>
      {error && (
        <Text c="red" fz="xs" mt="xs">
          {error}
        </Text>
      )}
    </Box>
  );
}
