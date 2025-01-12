"use client"

import { Flex, Group, Box, ActionIcon, Text } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { IconCamera, IconPlus, IconTrash } from '@tabler/icons-react'
import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import imageCompression from 'browser-image-compression';
import Image from "next/image";
import classes from './ads.module.css'

type props = {
  images: File[]
  setImages: Dispatch<SetStateAction<File[]>>
}
const MAX_IMAGES = 3;

const AdsImageForm: FC<props> = ({ images, setImages }) => {
  const [error, setError] = useState<string | null>(null);


  const compressImage = async (file: File) => {
    try {
      const options = {
        maxSizeMB: 1, // Maximum compressed size in MB
        maxWidthOrHeight: 1920, // Resize images to fit within these dimensions
        useWebWorker: true, // Use a web worker for faster compression
      };
      return await imageCompression(file, options);
    } catch (err) {
      console.error('Compression error:', err);
      setError('خطا در فشرده‌سازی عکس');
      return null;
    }
  };

  const handleImageUpload = async (files: File[]) => {
    if (images.length + files.length > 3) {
      setError('حداکثر تعداد عکس ۳ است.');
      return;
    }

    setError(null);

    const compressedFiles: File[] = [];
    for (const file of files) {
      if (file.size > 1 * 1024 ** 2) {
        const compressedFile = await compressImage(file);
        if (compressedFile) {
          compressedFiles.push(compressedFile);
        }
      } else {
        compressedFiles.push(file);
      }
    }

    setImages((current) => [...current, ...compressedFiles]);
  }


  const renderPlaceholders = () => {
    const placeholders = [];
    const placeholdersNeeded = MAX_IMAGES - images.length;

    for (let i = 0; i < placeholdersNeeded; i++) {
      placeholders.push(
        <Flex
          key={`placeholder-${i}`}
          direction="column"
          align="center"
          justify="center"
          h={100}
          w={100}
          style={{
            borderRadius: '5px',
            cursor: 'pointer',
            border: '1px dashed var(--mantine-color-gray-5)',
          }}
        >
          <IconCamera color="var(--mantine-color-gray-5)" size={30} />
        </Flex>
      );
    }

    return placeholders;
  };

  const handleRemoveImage = (index: number) => {
    setImages((current) => current.filter((_, i) => i !== index));
  };
  return (
    <>
      <Text fz={'sm'} mb={'3px'} mt={'xl'}>عکس‌های آگهی <span style={{ fontSize: '12px', color: 'gray' }}>(حداکثر ۳ عکس)</span></Text>

      <Flex mb={'xl'} pos={'relative'}>
        <Dropzone
          onDrop={handleImageUpload}
          onReject={(files) => console.log('rejected files', files)}
          maxSize={10 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
        >
          <Flex direction={'column'} align={'center'} justify={'center'} h={{ base: '60px', sm: '100px' }} w={{ base: '70px', sm: '100px' }}
            style={{ borderRadius: '5px', cursor: 'pointer', padding: 20, border: '1px dashed var(--mantine-color-kiwi-8)' }}>
            <IconPlus color='var(--mantine-color-kiwi-8)' size={22} />
            <Text style={{whiteSpace:'nowrap'}} c={'var(--mantine-color-kiwi-8)'} fz={'xs'}>افزودن عکس</Text>
          </Flex>
        </Dropzone>

        <Group mr={'lg'} gap="sm" wrap="wrap">
          {images.map((file, index) => (
            <Box
              key={index}
              style={{
                position: 'relative',
                cursor: 'pointer',
                borderRadius: '5px',
                overflow: 'hidden',
                width: 100,
                height: 100,
              }}
            >
              <ActionIcon
                variant="filled"
                color="red"
                size="sm"
                style={{
                  position: 'absolute',
                  top: 5,
                  left: 5,
                  zIndex: 10,
                }}
                onClick={() => handleRemoveImage(index)}
              >
                <IconTrash size={14} />
              </ActionIcon>
              <Image
                src={URL.createObjectURL(file)}
                alt={`Preview ${index}`}
                width={100}
                height={100}
                style={{ objectFit: 'cover' }}
              />
            </Box>
          ))}
          {renderPlaceholders()}
        </Group>
      </Flex>
    </>
  )
}

export default AdsImageForm