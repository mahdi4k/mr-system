import { Group, Avatar, Text, Box, TypographyStylesProvider } from '@mantine/core';
import React, { useEffect, useState } from 'react'
import classes from './comment.module.css';



type CommentPO = {
    id: number,
    content: { rendered: string },
    email: string,
    author_name: string,
    date: string,
    image: string
};

const CommentList = ({ postID }: { postID: string }) => {


    const [data, setData] = useState<CommentPO[]>([]);


    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API}/comments?post=${postID}`)
            .then(response => response.json())
            .then(data => setData(data));
    }, []);


    const jalaliDate = (date: string) => {
        const gregorianDate = new Date(date);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return gregorianDate.toLocaleDateString('fa-IR', options);
    }


    return (
        <div>
            {data.map(comment => (
                <Box className={classes.boxComment} component='div' my={'lg'} key={comment.id}>
                    <Group>
                        <Avatar
                            alt=""
                            radius="xl"
                        />
                        <div>
                            <Text size="sm">{comment.author_name}</Text>
                            <Text size="xs" c="dimmed">
                                {jalaliDate(comment.date)}
                            </Text>
                        </div>
                    </Group>

                    <TypographyStylesProvider className={classes.body}>
                        <div
                            className={classes.content}
                            dangerouslySetInnerHTML={{
                                __html: comment.content.rendered
                            }}
                        />
                    </TypographyStylesProvider>
                </Box>
            ))}

        </div>
    )
}

export default CommentList