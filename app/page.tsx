import React from "react";
import { HeroHeader } from "@/_components/HeroHome/HeroHeader";
import CardService from "@/_components/cardService/CardService";
import CpuGraphic from "@/_components/cpuGraphic/CpuGraphic";
import CpuMotherboard from "@/_components/cpuMotherboard/CpuMotherboard";
import GraphicPower from "./_components/graphicPower/GraphicPower";
import CardParts from "./_components/cardParts/CardParts";
import ArticleSection from "./_components/articleSection/ArticleSection";
import BannerSection from "./_components/BannerSection/BannerSection";
import { Metadata, Viewport } from "next";
import SuggestSection from "./_components/suggestSection/SuggestSection";
import AdsSection from "./_components/adsSection/AdsSection";
import { cookies } from "next/headers";
import { Button, Container, Group, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import PageClient from "./(routes)/choose-part/page.client";
import BuildAssistantIntro from "@/_components/chooseParts/BuildAssistantIntro";
import classes from "./page.module.css";

export const viewport: Viewport = {
  themeColor: "#87A10C",
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL("https://kiwipart.ir"),
    title: "کیوی پارت | انتخاب هوشمند",
    manifest: "/manifest.json",
    description:
      "انتخاب هوشمند قطعات کامبپوتر - کمترین قیمت موجود در بازار - کارت گرافیک - پاور - مادربرد - cpu",
    authors: [
      {
        name: "kiwipart",
        url: "https://kiwipart.ir",
      },
    ],
    twitter: {
      card: "summary_large_image",
      creator: "kiwipart",
      images: "https://kiwipart.ir/kiwipart.png",
    },
    robots: "index, follow",
    alternates: {
      canonical: `https://kiwipart.ir`,
      languages: {
        "fa-IR": "/",
      },
    },
    openGraph: {
      type: "website",
      url: `https://kiwipart.ir`,
      title:
        "انتخاب هوشمند قطعات با کیوی پارت | مادربرد | cpu | کارت گرافیک | پاور",
      description:
        "انتخاب هوشمند قطعات کامبپوتر - کمترین قیمت موجود در بازار - کارت گرافیک - پاور - مادربرد - cpu",
      siteName: "کیوی پارت",
      images: [
        {
          url: "https://kiwipart.ir/kiwipart.png",
        },
      ],
    },
    keywords: ["کیوی پارت"],
  };
}

const page = async () => {
  const token = (await cookies()).get("authToken")?.value;

  return (
    <div>
      <BuildAssistantIntro />
      <div className={classes.builderPreview}>
        <div className={classes.builderContent}>
          <PageClient />
        </div>
        <div className={classes.builderAction}>
          <div className={classes.builderActionPanel}>
            <Text className={classes.builderActionText} fw={600} size="sm">
              قطعات سازگار را کنار هم بچین و سیستم ایده‌آلت را بساز
            </Text>
            <Button
              className={classes.builderButton}
              color="lime"
              component="a"
              href="/choose-part"
              radius="xl"
              rightSection={<IconArrowLeft size={18} stroke={2} />}
              size="md"
            >
              سیستم خودت را بساز
            </Button>
          </div>
        </div>
      </div>
      <SuggestSection />

      <AdsSection token={token} />
      <Container my={"xl"} size="lg">
        <Group>
          <CpuMotherboard />
          <CpuGraphic />
        </Group>
        {/* <GraphicPower /> */}
      </Container>
      <BannerSection />
      {/* <CardService /> */}
      <ArticleSection />
    </div>
  );
};

export default page;
