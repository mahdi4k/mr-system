import { Group, Modal } from '@mantine/core'
import React, { FC, useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import { Carousel } from '@mantine/carousel';
import { EmblaCarouselType } from 'embla-carousel-react';

type props = {
    image?: string,
    openedImageModal: boolean,
    setOpenedImageModal: React.Dispatch<React.SetStateAction<boolean>>
    selectedImage?: number | null
}

const AdsGalleryModal: FC<props> = ({ image, openedImageModal, setOpenedImageModal, selectedImage }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const emblaRef = useRef<EmblaCarouselType | null>(null); // To access embla API
    const [images, setImages] = useState<string[]>([])

    useEffect(() => {
        if (image) {
            const images: string[] = JSON.parse(image);
            setImages(images)
        }

    }, [image])

    useEffect(() => {
        setSelectedImageIndex(selectedImage ? selectedImage : 0)
    }, [selectedImage])



    const handleThumbnailClick = (index: number) => {
        setSelectedImageIndex(index);
        emblaRef.current?.scrollTo(index); // Move carousel to clicked thumbnail
    };

    return (
        <div>
            <Modal
                transitionProps={{ transition: 'pop-top-left' }}
                opened={openedImageModal}
                onClose={() => setOpenedImageModal(false)}
                centered
                size="600px" // Adjust the size automatically based on content
            >
                <Carousel
                    slideSize="100%"
                    withIndicators
                    height={500}
                    align="center"
                    slideGap="md"
                    loop
                    draggable
                    getEmblaApi={(embla) => (emblaRef.current = embla)}
                    initialSlide={selectedImageIndex}
                >
                    {images.map((img, index) => (
                        <Carousel.Slide key={index}>
                            <Image
                                fill
                                style={{objectFit:'contain'}}
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${img}`}
                                alt={`Large Image ${index}`} />
                        </Carousel.Slide>
                    ))}
                </Carousel>


                <Group mt="lg">
                    {images.map((img, index) => (
                        <Image
                            key={index}
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${img}`}
                            alt={`Thumbnail ${index}`}
                            width={80}
                            height={80}
                            onClick={() => handleThumbnailClick(index)}
                            style={{
                                cursor: 'pointer',
                                border: selectedImageIndex === index ? '2px solid blue' : 'none',
                            }}
                        />
                    ))}
                </Group>
            </Modal>
        </div>
    )
}

export default AdsGalleryModal