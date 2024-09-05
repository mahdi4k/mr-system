"use client"

import { Flex, Group, Box, ActionIcon, Text } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import React, { Dispatch, FC, SetStateAction, useState } from 'react'
import Image from "next/image";
import classes from './ads.module.css'

type props = {
  images: File[]
  setImages: Dispatch<SetStateAction<File[]>>
}

const AdsImageForm: FC<props> = ({ images, setImages }) => {


  const handleImageUpload = (files: File[]) => {
    setImages((current) => [...current, ...files]);
  };
  const handleRemoveImage = (index: number) => {
    setImages((current) => current.filter((_, i) => i !== index));
  };
  return (
    <>
      <Text fz={'sm'} mb={'3px'} mt={'xl'}>عکس‌های آگهی <span style={{fontSize:'12px',color:'gray'}}>(حداکثر ۳ عکس)</span></Text>

      <Flex mb={'xl'}>
        <Dropzone
          onDrop={handleImageUpload}
          onReject={(files) => console.log('rejected files', files)}
          maxSize={3 * 1024 ** 2}
          accept={IMAGE_MIME_TYPE}
        >
          <Flex direction={'column'} align={'center'} justify={'center'} h={'90px'} w={'110px'}
            style={{ borderRadius: '5px', cursor: 'pointer', padding: 20, border: '1px dashed var(--mantine-color-kiwi-8)' }}>
            <IconPlus size={22} />
            <Text fz={'xs'}>افزودن عکس</Text>
          </Flex>
        </Dropzone>

        <Group align='center' gap={'xl'} mr={'lg'}>
          {images.map((file, index) => (
            <Box className={classes.imageBox} pos={'relative'} key={index} style={{ cursor: 'pointer' }}>
              <ActionIcon className={classes.removeIcon} variant='filled' color='red' size={'sm'} pos={'absolute'} onClick={() => handleRemoveImage(index)} style={{ left: '0' }}>
                <IconTrash size={14} />
              </ActionIcon>
              <Image
                src={URL.createObjectURL(file)}
                alt={`preview ${index}`}
                width={70}
                height={70}
                style={{ objectFit: 'scale-down' }}
              />
            </Box>

          ))}
        </Group>
      </Flex>
    </>
  )
}

export default AdsImageForm