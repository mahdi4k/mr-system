import {
    Card,
    Image,
    ActionIcon,
    Group,
    Text,
    Avatar,
    Badge,
    useMantineTheme,
    rem,
} from '@mantine/core';
import { IconHeart, IconBookmark, IconShare } from '@tabler/icons-react';
import classes from './Article.module.css';

export function ArticleCard() {
    const theme = useMantineTheme();

    return (
        <Card withBorder padding="lg" radius="md" className={classes.card}>
            <Card.Section mb="sm">
                <Image
                    src="/svg/cpu.svg"
                    alt="Top 50 underrated plants for house decoration"
                    height={180}
                />
            </Card.Section>

            <Badge w="fit-content" variant="light">
                decorations
            </Badge>

            <Text fw={700} className={classes.title} mt="xs">
                Top 50 underrated plants for house decoration
            </Text>

             

            <Card.Section className={classes.footer}>
                <Group justify="flex-end">
                    <Group gap={0}>
                        <ActionIcon variant="subtle" color="gray">
                            <IconShare
                                style={{ width: rem(20), height: rem(20) }}
                                color={theme.colors.blue[6]}
                                stroke={1.5}
                            />
                        </ActionIcon>
                    </Group>
                </Group>
            </Card.Section>
        </Card>
    );
}