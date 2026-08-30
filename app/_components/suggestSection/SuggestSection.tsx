"use client";

import { Card, Container, Grid, rem, SimpleGrid, Text } from "@mantine/core";
import React from "react";
import Image from "next/image";
import classes from "./ImageCard.module.css";
import {
  getSuggestedBuildHref,
  suggestedBuilds,
} from "@/_data/suggestedBuilds";

const PRIMARY_COL_HEIGHT = rem(300);

const SuggestSection = () => {
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

  return (
    <Container size={"lg"}>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <Grid gutter="md">
          <Grid.Col span={12}>
            <Card
              p="lg"
              shadow="lg"
              className={classes.card}
              radius="md"
              component="a"
              href={getSuggestedBuildHref(suggestedBuilds[0])}
            >
              <Image
                alt={suggestedBuilds[0].title}
                className={classes.image}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                src={suggestedBuilds[0].image}
                priority={false}
              />
              <div className={classes.overlay} />
              <div className={classes.content}>
                <div>
                  <Text size="lg" className={classes.title} fw={500}>
                    {suggestedBuilds[0].title}
                  </Text>
                </div>
              </div>
            </Card>
          </Grid.Col>
          <Grid.Col span={12}>
            <Card
              p="lg"
              shadow="lg"
              className={classes.card}
              radius="md"
              component="a"
              href={getSuggestedBuildHref(suggestedBuilds[1])}
            >
              <Image
                alt={suggestedBuilds[1].title}
                className={classes.image}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                src={suggestedBuilds[1].image}
              />
              <div className={classes.overlay} />
              <div className={classes.content}>
                <div>
                  <Text size="lg" className={classes.title} fw={500}>
                    {suggestedBuilds[1].title}
                  </Text>
                </div>
              </div>
            </Card>
          </Grid.Col>
        </Grid>
        <Grid gutter="md">
          <Grid.Col span={12}>
            <Card
              p="lg"
              shadow="lg"
              className={classes.card}
              radius="md"
              component="a"
              href={getSuggestedBuildHref(suggestedBuilds[2])}
            >
              <Image
                alt={suggestedBuilds[2].title}
                className={classes.image}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                src={suggestedBuilds[2].image}
              />
              <div className={classes.overlay} />
              <div className={classes.content}>
                <div>
                  <Text size="lg" className={classes.title} fw={500}>
                    {suggestedBuilds[2].title}
                  </Text>
                </div>
              </div>
            </Card>
          </Grid.Col>
          <Grid.Col span={12}>
            <Card
              p="lg"
              shadow="lg"
              className={classes.card}
              radius="md"
              component="a"
              href={getSuggestedBuildHref(suggestedBuilds[3])}
            >
              <Image
                alt={suggestedBuilds[3].title}
                className={classes.image}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                src={suggestedBuilds[3].image}
              />
              <div className={classes.overlay} />
              <div className={classes.content}>
                <div>
                  <Text size="lg" className={classes.title} fw={500}>
                    {suggestedBuilds[3].title}
                  </Text>
                </div>
              </div>
            </Card>
          </Grid.Col>
        </Grid>
      </SimpleGrid>
    </Container>
  );
};

export default SuggestSection;
