import React, { FC } from 'react'
import Image from 'next/image'
import { useMantineColorScheme } from '@mantine/core'

type Props = {
  img: string,
  alt: string
}

const CategoryImage: FC<Props> = ({ img, alt }) => {
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

  return (
    <Image placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(300, 300))}`}
      sizes="(max-width: 300px) 100vw, (max-width: 300x) 50vw, 33vw"
      style={{ objectFit: 'contain' }} alt={alt} fill src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${img}`} />

  )
}

export default CategoryImage