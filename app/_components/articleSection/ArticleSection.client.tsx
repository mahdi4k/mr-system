"use client";

import { Carousel, Embla } from "@mantine/carousel";
import { Box, Button, Container, Flex, Grid } from "@mantine/core";
import React, { FC, useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import { ArticleCard } from "./ArticleCard";
import classess from "./Article.module.css";
import { postsMO } from "./ArticleSection";
import Link from "next/link";
import Image from "next/image";
const ArticleSectionClient = ({ posts }: { posts: postsMO[] }) => {
  const [embla, setEmbla] = useState<Embla | null>(null);

  useEffect(() => {
    if (embla) {
      embla?.reInit({ direction: "rtl" });
    }
  }, [embla]);

  return (
    <Container mt={"50px"} mb={"80px"} size="lg">
      {/* <div dangerouslySetInnerHTML={{ __html: data[0].content.rendered }} /> */}

      <Grid classNames={{ inner: classess.articleGrid }} w={"100%"}>
        <Grid.Col span={{ base: 12, md: 5 }}>
          {/* <SVG
                        className={classess.articleSvg}
                        loader={<Box component='div'></Box>}
                        src='/svg/article.svg' /> */}
          <Flex
            mt={{ base: "xl", md: "0" }}
            align={"center"}
            justify={"center"}
            h={"100%"}
            direction={"column"}
          >
            <Image
              className={classess.articleSvg}
              alt=""
              width={100}
              height={100}
              src={"/svg/article.svg"}
            />

            <Flex align={"center"} justify={"center"} mt={"sm"}>
              <Link href={"/blog"}>
                <Button
                  mt={"md"}
                  variant="gradient"
                  gradient={{
                    from: " rgb(14,163,93)",
                    to: " rgb(12,119,115)",
                    deg: 90,
                  }}
                >
                  مشاهده تمام مقالات
                </Button>
              </Link>
            </Flex>
          </Flex>
        </Grid.Col>
        <Grid.Col pb={"lg"} span={{ base: 12, md: 7 }}>
          <div style={{ direction: "rtl" }}>
            <Carousel
              styles={{
                indicators: { bottom: "-7px" },
                viewport: { minHeight: "400px" },
                indicator: { backgroundColor: "var(--mantine-color-green-6)" },
              }}
              align="start"
              slideSize={{ base: "100%", sm: "50%" }}
              slideGap={{ base: "sm", sm: "xl" }}
              getEmblaApi={setEmbla}
              height={375}
              withControls={false}
              withIndicators
            >
              {posts.map((post) => (
                <Carousel.Slide key={post.id}>
                  <ArticleCard post={post} />
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default ArticleSectionClient;
