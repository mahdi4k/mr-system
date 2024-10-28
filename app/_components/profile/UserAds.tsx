import { Badge, Card, Flex, Group, SimpleGrid, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import Image from 'next/image';
import { Product } from "@/_redux/services/adsApi";
import CardPartPrice from "../shared/CardPartPrice";
import classes from './UserProfile.module.css'
import { Carousel, Embla } from "@mantine/carousel";

type prop = {
    message: string
    userData: Product[]
}

const UserAds = () => {
    const [userAds, setUserads] = useState<Product[]>([]);
    const [error, setError] = useState(null);
    const [embla, setEmbla] = useState<Embla | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/profile-ads', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // Check if the request was successful
                if (response.ok) {
                    const data = await response.json();
                    setUserads(data.userData); // Assuming userData is in the response
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Something went wrong');
                }
            } catch (error) {
                // setError(error.message || 'An error occurred');
            }
        };

        fetchUserData();
    }, []);

    const handleImageAds = (image: string | undefined, title: string) => {
        if (image) {
            const images: string[] = JSON.parse(image);
            return (
                <>
                    {images.map((img, index) => (
                        <Carousel.Slide key={index}>
                            <Image
                                alt={title}
                                width={100}
                                height={100}
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${img}`}
                            />
                        </Carousel.Slide>
                    ))}
                </>
            );

        } else {
            return (
                <></>
            )
        }
    }

    useEffect(() => {
        if (embla) {
            embla?.reInit({ direction: 'rtl' })
        }
    }, [embla]);


    return (
        <div>
            <SimpleGrid cols={{ base: 1, lg: 2 }}>
                {userAds && userAds.length > 0 ? userAds.map(item => (
                    <Card key={item.id} withBorder>
                        <Group wrap="nowrap">
                            <Carousel
                                w={100}
                                getEmblaApi={setEmbla}
                                withIndicators
                                loop={false}
                                classNames={{
                                    root: classes.carousel,
                                    controls: classes.carouselControls,
                                    indicator: classes.carouselIndicator,
                                }}
                            >
                                {handleImageAds(item.image, item.title)}
                            </Carousel>
                            <Flex w={'100%'} direction={'column'}>
                                <Text fz='sm'>{item.title}</Text>
                                <Flex mt={'md'} justify={'space-between'} align={'center'} w={'100%'}>
                                    <CardPartPrice tomanHeight={17} tomanWidth={17} textSize={14} isAds price={item.price} />
                                    <Badge>{item.status === 'approved' ? 'منتشر شده' : 'در حال بررسی'}</Badge>
                                </Flex>
                            </Flex>
                        </Group>

                    </Card>
                )) : <Text w={'100%'} ta={'center'} fw={'bold'}>{'آگهی یافت نشد'}</Text>}
            </SimpleGrid>
        </div>
    )
}
export default UserAds