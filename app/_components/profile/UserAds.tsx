import { Badge, Card, Flex, Group, SimpleGrid, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import Image from 'next/image';
import { Product } from "@/_redux/services/adsApi";
import CardPartPrice from "../shared/CardPartPrice";
import classes from './UserProfile.module.css'
import { Carousel, Embla } from "@mantine/carousel";
import ImgNoProduct from '../../../public/no-product.png'
import Link from "next/link";

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

    const handleImageAds = (image: string, title: string) => {
        const images: string[] = JSON.parse(image);

        if (images.length > 0) {
            return (
                <>
                    {images.map((img, index) => (
                        <Carousel.Slide key={index}>
                            <Image
                                alt={title}
                                width={100}
                                height={100}
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/storage/${img}`}
                            />
                        </Carousel.Slide>
                    ))}
                </>
            );

        } else {
            return (
                <Image style={{ objectFit: 'contain' }} width={90} height={80} alt='no img' src={ImgNoProduct} />
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
            <SimpleGrid mb={'xl'} cols={{ base: 1, xs: 2, sm: 3, xl: 2 }}>
                {userAds && userAds.length > 0 ? userAds.map(item => (
                    <Link href={`/ads/${item.id}`}>
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
                                    {handleImageAds(item.image as string, item.title)}
                                </Carousel>
                                <Flex w={'100%'} direction={'column'}>
                                    <Text fz='sm'>{item.title}</Text>
                                    <Flex mt={'xl'} justify={'space-between'} align={'center'} w={'100%'}>
                                        <CardPartPrice mb={'0'} mt={'0'} tomanHeight={17} tomanWidth={17} textSize={14} isAds price={item.price} />
                                        <Badge mr={'auto'}>{item.status === 'approved' ? 'منتشر شده' : 'در حال بررسی'}</Badge>
                                    </Flex>
                                </Flex>
                            </Group>
                        </Card>
                    </Link>
                )) : (
                    <Card withBorder>
                        <Text w={'100%'} ta={'center'} fw={'bold'}>{'آگهی یافت نشد'}</Text>
                    </Card>
                )
                }
            </SimpleGrid>
        </div>
    )
}
export default UserAds