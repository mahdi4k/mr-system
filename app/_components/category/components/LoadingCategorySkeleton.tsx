import { Grid, Skeleton } from "@mantine/core";
import React from "react";

const LoadingCategorySkeleton = () => {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, xs: 6, sm: 4, lg: 3 }}>
        <Skeleton
          radius={"md"}
          h={{ base: 250, md: 350 }}
          mb={{ base: "md", md: "xl" }}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, xs: 6, sm: 4, lg: 3 }}>
        <Skeleton
          radius={"md"}
          h={{ base: 250, md: 350 }}
          mb={{ base: "md", md: "xl" }}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, xs: 6, sm: 4, lg: 3 }}>
        <Skeleton
          radius={"md"}
          h={{ base: 250, md: 350 }}
          mb={{ base: "md", md: "xl" }}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, xs: 6, sm: 4, lg: 3 }}>
        <Skeleton
          radius={"md"}
          h={{ base: 250, md: 350 }}
          mb={{ base: "md", md: "xl" }}
        />
      </Grid.Col>
    </Grid>
  );
};

export default LoadingCategorySkeleton;
