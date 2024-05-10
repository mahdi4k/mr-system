import {
    Card,
    Image,
    ActionIcon,
    Group,
    Text,
    useMantineTheme,
    rem,
    CopyButton,
    Affix,
} from '@mantine/core';
import { IconCheck, IconShare } from '@tabler/icons-react';
import classes from './Article.module.css';
import { postsMO } from './ArticleSection';
import Link from 'next/link';
import { Notification } from '@mantine/core';
import { usePathname } from 'next/navigation'

export function ArticleCard({ post }: { post: postsMO }) {
    const theme = useMantineTheme();

    const gregorianDate = new Date(post.date);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const jalaliDate = gregorianDate.toLocaleDateString('fa-IR', options);
    const pathname = usePathname()
    console.log(pathname,'{pathname}');
    

    return (

        <Card withBorder padding="lg" radius="md" className={classes.card}>
            <Link href={`/blog/${post.slug}`}>
                <Card.Section mb="sm">
                    <Image
                        src={post?._embedded['wp:featuredmedia'][0].link}
                        alt={post.slug}
                        height={180}
                    />
                </Card.Section>

                <Text h={'50px'} fw={700} className={classes.title} >
                    {post.title.rendered}
                </Text>
                <div className={classes.excerptTitle} dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
            </Link >
            <Card.Section className={classes.footer}>
                <Group align='center' justify='space-between' gap={0}>
                    <CopyButton value={`${window.origin}/blog/${post.slug}`}>
                        {({ copied, copy }) => (
                            <>
                                <ActionIcon loading={copied} onClick={copy} variant="subtle" color="gray">
                                    <IconShare
                                        style={{ width: rem(20), height: rem(20) }}
                                        color={theme.colors.blue[6]}
                                        stroke={1.5}
                                    />
                                </ActionIcon>
                                {copied ?
                                    <Affix position={{ bottom: 20, right: 20 }}>
                                        <Notification icon={<IconCheck size={12} />} color="teal" mt="md">
                                            لینک با موفقیت کپی شد
                                        </Notification>
                                    </Affix> : ''}
                            </>
                        )}
                    </CopyButton>


                    <Text fz={'xs'}>{jalaliDate}</Text>
                </Group>
            </Card.Section>
        </Card>

    );
}