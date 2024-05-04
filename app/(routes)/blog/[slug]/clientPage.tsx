"use client"

import { postsMO } from '@/_components/articleSection/ArticleSection'
import { Container, Divider, Title } from '@mantine/core'
import React from 'react'
import { Image, Text } from '@mantine/core'
import './style.scss'
import CommentPost from '@/_components/commentPost/CommentPost'
import CommentList from '@/_components/commentPost/CommentList'

const ClientPage = ({ post }: { post: postsMO[] }) => {

    const gregorianDate = new Date(post[0].date);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const jalaliDate = gregorianDate.toLocaleDateString('fa-IR', options);

    return (

        <Container mb={'50px'} styles={{ root: { flex: '1 0 auto', width: '100%' } }} size={'md'}>
            <Title mt={'60px'} fz={'h2'}>{post[0].title.rendered}</Title>
            {jalaliDate}
            <Image mah={500} my={'30px'}
                src={post[0]?._embedded['wp:featuredmedia'][0].link}
                alt={post[0].slug}

            />
            <div className='contentPost' dangerouslySetInnerHTML={{ __html: post[0].content.rendered }} />
            <Divider mt={'50px'} mb={'xl'} size={'md'} label={<Text fz={'lg'}>نظرات</Text>} />

            <CommentPost postID={post[0].id} />
            <CommentList postID={post[0].id} />
        </Container>

    )
}

export default ClientPage