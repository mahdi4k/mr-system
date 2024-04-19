import {
    Card,
    Image,
    ActionIcon,
    Group,
    Text,
    useMantineTheme,
    rem,
} from '@mantine/core';
import { IconShare } from '@tabler/icons-react';
import classes from './Article.module.css';
import { postsMO } from './ArticleSection';
import Link from 'next/link';

export function ArticleCard({ post }: { post: postsMO }) {
    const theme = useMantineTheme();

    const gregorianDate = new Date(post.date);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const jalaliDate = gregorianDate.toLocaleDateString('fa-IR', options);


    return (
        <Link href={`/blog/${post.slug}`}>
            <Card withBorder padding="lg" radius="md" className={classes.card}>
                <Card.Section mb="sm">
                    <Image
                        src={post?._embedded['wp:featuredmedia'][0].link}
                        alt="Top 50 underrated plants for house decoration"
                        height={180}
                    />
                </Card.Section>

                <Text fw={700} className={classes.title} >
                    {post.title.rendered}
                </Text>
                <div className={classes.excerptTitle} dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />

                <Card.Section className={classes.footer}>
                    <Group align='center' justify='space-between' gap={0}>
                        <ActionIcon variant="subtle" color="gray">
                            <IconShare
                                style={{ width: rem(20), height: rem(20) }}
                                color={theme.colors.blue[6]}
                                stroke={1.5}
                            />
                        </ActionIcon>
                        <Text fz={'xs'}>{jalaliDate}</Text>
                    </Group>
                </Card.Section>
            </Card>
        </Link>
    );
}