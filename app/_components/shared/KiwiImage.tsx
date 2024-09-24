"use client"

import React, { FC } from 'react';
import Image from 'next/image';
import { useMantineColorScheme } from '@mantine/core';

type Props = {
  img: string;
  alt: string;
  width: number;
  height: number;
  url?: string
  objectFit?: 'cover' | 'contain' | 'none'
};

const KiwiImage: FC<Props> = ({ img, alt, width, height, url, objectFit }) => {
  const { colorScheme } = useMantineColorScheme();

  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g">
            <stop stop-color="rgba(255, 255, 255, 0.2)" offset="20%" />
            <stop stop-color="rgba(255, 255, 255, 0.1)" offset="50%" />
            <stop stop-color="rgba(255, 255, 255, 0.2)" offset="70%" />
          </linearGradient>
        </defs>
      <rect width="${w}" height="${h}" fill="rgba(0, 0, 0, 0.1)" />
      <rect width="${w}" height="${h}" fill="url(#g)" />
      <animate attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
    </svg>`;

  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  if (!img || !alt) return null;

  return (
    <Image
      placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{ objectFit: objectFit ? objectFit : 'contain' }}
      alt={alt}
      fill
      src={url ? url : `${process.env.NEXT_PUBLIC_BACKEND_URL}/${img}`}
    />
  );
};

export default KiwiImage;
