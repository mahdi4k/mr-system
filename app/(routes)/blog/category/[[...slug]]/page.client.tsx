"use client";

import { postsMO } from "@/_components/articleSection/ArticleSection";
import {
  Card,
  Container,
  Grid,
  Text,
  Image,
  Group,
  Breadcrumbs,
  Anchor,
  Button,
  Stack,
} from "@mantine/core";
import React from "react";
import classes from "./categoryCard.module.css";
import Link from "next/link";
import type { PublicArticleCategory } from "../../../../_features/articles/types";

const PageClient = ({
  posts,
  categories,
  category,
  page,
  totalPages,
}: {
  posts: postsMO[];
  categories: PublicArticleCategory[];
  category?: string;
  page: number;
  totalPages: number;
}) => {
  const listingPath = category ? `/blog/category/${category}` : "/blog";

  return (
    <div>
      <Container mt={"50px"} mb={"80px"} size="lg">
        <Breadcrumbs mb={"lg"}>
          <Anchor href={"/"}>خانه</Anchor>
          <Text>مقالات</Text>
        </Breadcrumbs>
        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Grid>
              {!posts.length && (
                <Grid.Col span={12}>
                  <Text c="dimmed" py="xl" ta="center">
                    هنوز مقاله‌ای در این بخش منتشر نشده است.
                  </Text>
                </Grid.Col>
              )}
              {posts.map((post) => {
                const gregorianDate = new Date(post.date);
                const options: Intl.DateTimeFormatOptions = {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                };
                const jalaliDate = gregorianDate.toLocaleDateString(
                  "fa-IR",
                  options,
                );

                return (
                  <Grid.Col key={post.id} mt={"xs"} span={{ base: 12 }}>
                    <Link href={`/blog/${post.slug}`}>
                      <Card
                        withBorder
                        radius="md"
                        p={0}
                        className={classes.card}
                      >
                        <Group
                          className={classes.groupItem}
                          wrap="nowrap"
                          gap={0}
                        >
                          <Image
                            alt={post.title.rendered}
                            style={{ width: "320px" }}
                            src={post?._embedded["wp:featuredmedia"][0].link}
                            height={220}
                            width={"280px"}
                          />
                          <div className={classes.body}>
                            <Text
                              fw={"bolder"}
                              className={classes.title}
                              mt="xs"
                              mb="md"
                            >
                              {post.title.rendered}
                            </Text>
                            <div
                              className={classes.excerptTitle}
                              dangerouslySetInnerHTML={{
                                __html: post.excerpt.rendered,
                              }}
                            />

                            <Text className={classes.Date} size="xs" c="dimmed">
                              {jalaliDate}
                            </Text>
                          </div>
                        </Group>
                      </Card>
                    </Link>
                  </Grid.Col>
                );
              })}
            </Grid>
            {totalPages > 1 && (
              <Group justify="center" mt="xl">
                <Button
                  component={Link}
                  disabled={page <= 1}
                  href={`${listingPath}?page=${page - 1}`}
                  variant="default"
                >
                  صفحه قبل
                </Button>
                <Stack align="center" gap={0} miw={90}>
                  <Text fw={700}>{page.toLocaleString("fa-IR")}</Text>
                  <Text c="dimmed" fz="xs">
                    از {totalPages.toLocaleString("fa-IR")}
                  </Text>
                </Stack>
                <Button
                  component={Link}
                  disabled={page >= totalPages}
                  href={`${listingPath}?page=${page + 1}`}
                  variant="default"
                >
                  صفحه بعد
                </Button>
              </Group>
            )}
          </Grid.Col>

          <Grid.Col visibleFrom="md" span={4}>
            <Card withBorder className={classes.blogPostCategory}>
              <Text
                pos={"relative"}
                className={classes.categoryTitle}
                fw={"bolder"}
              >
                دسته بندی‌ ها
              </Text>
              <ul style={{ paddingRight: "5px", marginTop: "30px" }}>
                <li className={classes.categoryList}>
                  <Link href="/blog">
                    <Text fz="sm">همه مقالات</Text>
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category.id} className={classes.categoryList}>
                    <Link href={`/blog/category/${category.slug}`}>
                      <Text fz={"sm"}>{category.name}</Text>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
};

export default PageClient;
