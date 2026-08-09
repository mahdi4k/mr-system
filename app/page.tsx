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
import { Container, Group, Text } from "@mantine/core";
import { IconArrowLeft, IconCircleCheck } from "@tabler/icons-react";
import BuildAssistantIntro from "@/_components/chooseParts/BuildAssistantIntro";
import Image from "next/image";
import Link from "next/link";
import classes from "./page.module.css";

const exampleParts = [
  {
    type: "پردازنده",
    name: "Intel Core i5-14400F",
    image: "/svg/cpu.svg",
  },
  {
    type: "کارت گرافیک",
    name: "ASUS Prime RTX 5060 8GB",
    image: "/svg/graphic.svg",
  },
  {
    type: "مادربرد",
    name: "ASUS Prime B760-Plus D4",
    image: "/svg/motherboard.svg",
  },
  {
    type: "حافظه رم",
    name: "Crucial 16GB DDR4-3200",
    image: "/svg/ram.svg",
  },
];

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
      <Container className={classes.builderContainer} size="lg">
        <Link
          aria-label="ساخت سیستم شخصی"
          className={classes.builderPreview}
          href="/choose-part"
        >
          <div className={classes.previewHeader}>
            <div>
              <Text className={classes.eyebrow} fw={800} size="xs">
                نمونه سیستم پیشنهادی
              </Text>
              <Text className={classes.previewTitle} fw={900}>
                یک ترکیب متعادل برای بازی و کار روزمره
              </Text>
              <Text c="dimmed" mt={4} size="sm">
                نمونه‌ای از نتیجه‌ای که با انتخاب هوشمند قطعات دریافت می‌کنید
              </Text>
            </div>
            <div className={classes.compatibilityStatus}>
              <IconCircleCheck size={20} stroke={2.2} />
              کاملا سازگار
            </div>
          </div>

          <div className={classes.partsGrid}>
            {exampleParts.map((part, index) => (
              <div className={classes.partCard} key={part.type}>
                <div className={classes.partImage}>
                  <Image
                    alt={part.type}
                    height={72}
                    loading={index === 0 ? "eager" : "lazy"}
                    src={part.image}
                    width={82}
                  />
                </div>
                <div className={classes.partDetails}>
                  <Text c="dimmed" fw={700} size="xs">
                    {part.type}
                  </Text>
                  <Text className={classes.partName} fw={800} size="sm">
                    {part.name}
                  </Text>
                </div>
              </div>
            ))}
          </div>

          <div className={classes.previewFooter}>
            <div>
              <Text c="dimmed" size="xs">
                قیمت تقریبی این ترکیب
              </Text>
              <Text className={classes.totalPrice} fw={900}>
                حدود ۸۲ میلیون تومان
              </Text>
            </div>
            <span className={classes.builderButton}>
              سیستم خودت بساز
              <IconArrowLeft size={18} stroke={2} />
            </span>
          </div>
        </Link>
      </Container>
      <SuggestSection />

      <AdsSection token={token} />
      {/* <Container my={"xl"} size="lg">
        <Group>
          <CpuMotherboard />
          <CpuGraphic />
        </Group>
      </Container> */}
      <BannerSection />
      {/* <CardService /> */}
      <ArticleSection />
    </div>
  );
};

export default page;
