"use client"
import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Flex, Grid, Group, Paper, Skeleton, Table, Text, TextInput, Title } from "@mantine/core";
import useLoading from "@/_utils/customHook/useLoading";
import { useAuth } from '@/_utils/customHook/useAuth';
import usePiecePc from '@/_utils/customHook/usePiecePc';
import { PiecesProps } from './page';
import classes from '@/_components/pieces/pieces.module.css'
import { IconCircleDotFilled } from '@tabler/icons-react';
import { ObjectIsEmpty } from '@/_utils/utils';
import { postsMO } from '@/_components/articleSection/ArticleSection';
import { ArticleCard } from '@/_components/articleSection/ArticleCard';


type Icategory = {
    id: string;
    slug: string;
}
const PageClient: React.FC<PiecesProps> = ({ params }) => {

    useAuth();

    const firstPiece = usePiecePc(params.slug[0])
    const secondPiece = usePiecePc(params.slug[1])
    const loadingEnd = useLoading();
    const [isPartSelected, setIsPartSelected] = useState<boolean>(false)
    const [posts, setPosts] = useState<postsMO[]>([])

    useEffect(() => {

        if (secondPiece.props.activeCpu && firstPiece.props.activeMotherboard) {
            setIsPartSelected(!ObjectIsEmpty(secondPiece.props.activeCpu) && !ObjectIsEmpty(firstPiece.props.activeMotherboard))

        }
        if (secondPiece.props.activePower && firstPiece.props.activeGraphic) {
            setIsPartSelected(!ObjectIsEmpty(secondPiece.props.activePower) && !ObjectIsEmpty(firstPiece.props.activeGraphic))
        }
        if (secondPiece.props.activeCpu && firstPiece.props.activeGraphic) {
            setIsPartSelected(!ObjectIsEmpty(secondPiece.props.activeCpu) && !ObjectIsEmpty(firstPiece.props.activeGraphic))
        }

    }, [secondPiece.props, firstPiece.props])


    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API}/categories?_fields=id,slug`)
            .then(response => response.json())
            .then(data => fetchPostsByCategories(data.filter((item: Icategory) => item.slug === params.slug[0] || item.slug === params.slug[1])));

    }, []);



    const fetchPostsByCategories = async (categoryIds: Icategory[]) => {

        const queryParams = new URLSearchParams();

        categoryIds.forEach(item => queryParams.append('categories[]', item.id));

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API}/posts?_fields=id,content,slug,excerpt,date,title,_links,_embedded&_embed&${queryParams}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const posts: postsMO[] = await response.json();
            setPosts(posts)
            // Handle the data as needed
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    };

    return (
        <>
            <Container className={classes.piecesSection} styles={{ root: { flex: '1 0 auto' } }} size={'xl'}>
                <Group className={classes.groupSection} mt={'100px'} justify={'space-between'} align={'start'}>
                    {!loadingEnd &&
                        (
                            <Flex direction={{ base: 'column', md: 'row' }} gap={7}>
                                <Skeleton radius={'xl'} w={{ base: 325, md: 400 }} h={300} mb="xl" />
                                <Skeleton radius={'xl'} w={{ base: 325, md: 400 }} h={300} mb="xl" />
                            </Flex>
                        )
                    }

                    {firstPiece}
                    <IconCircleDotFilled size={'40px'} className={`${classes.blob} ${loadingEnd ? classes.showBlob : ''} ${isPartSelected ? classes.activeBlob : ''} `} />
                    {secondPiece}
                </Group>


            </Container>

            {
                !ObjectIsEmpty(secondPiece.props.activeCpu) && !ObjectIsEmpty(firstPiece.props.activeMotherboard) ? (
                    <Container w={'100%'} mt={'50px'} mb={'80px'} size="990px">
                        <Text mb={'lg'} fw={'bolder'} fz={'1.5rem'}>مقالات مرتبط</Text>
                        <Grid gutter="xl">
                            {posts.map(post => (
                                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                                    <ArticleCard post={post} />
                                </Grid.Col>
                            ))}
                        </Grid>
                    </Container>
                ) : ''
            }

            {
                !ObjectIsEmpty(secondPiece.props.activeCpu) && !ObjectIsEmpty(firstPiece.props.activeGraphic) ? (
                    <Container w={'100%'} mt={'50px'} mb={'80px'} size="990px">
                        <Text mb={'lg'} fw={'bolder'} fz={'1.5rem'}>مقالات مرتبط</Text>
                        <Grid gutter="xl">
                            {posts.map(post => (
                                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                                    <ArticleCard post={post} />
                                </Grid.Col>
                            ))}
                        </Grid>
                    </Container>
                ) : ''
            }

            {
                !ObjectIsEmpty(secondPiece.props.activePower) && !ObjectIsEmpty(firstPiece.props.activeGraphic) ? (
                    <Container w={'100%'} mt={'50px'} mb={'80px'} size="990px">
                        <Text mb={'lg'} fw={'bolder'} fz={'1.5rem'}>مقالات مرتبط</Text>
                        <Grid gutter="xl">
                            {posts.map(post => (
                                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                                    <ArticleCard post={post} />
                                </Grid.Col>
                            ))}
                        </Grid>
                    </Container>
                ) : ''
            }
        </>

    );
};

export default PageClient;


