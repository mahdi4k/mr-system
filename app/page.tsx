import React from 'react'
import { HeroHeader } from '@/_components/HeroHome/HeroHeader'
import CardService from '@/_components/cardService/CardService'
import CpuGraphic from "@/_components/cpuGraphic/CpuGraphic"
import CpuMotherboard from "@/_components/cpuMotherboard/CpuMotherboard"
import GraphicPower from './_components/graphicPower/GraphicPower'
import CardParts from './_components/cardParts/CardParts'
import ArticleSection from './_components/articleSection/ArticleSection'
import BannerSection from './_components/BannerSection/BannerSection'
import { Metadata, Viewport } from "next";


export const viewport: Viewport = {
  themeColor: "#87A10C",
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL("https://kiwipart.ir"),
    title: "کیوی پارت | مادربرد | cpu | کارت گرافیک | پاور",
    manifest: "/manifest.json",
    description: "انتخاب هوشمند قطعات کامبپوتر - کمترین قیمت موجود در بازار - کارت گرافیک - پاور - مادربرد - cpu",
    authors: [
      {
        name: "Site Name",
        url: "https://kiwipart.ir",
      },
    ],
    twitter: {
      card: "summary_large_image",
      creator: "@example",
      images: "some-image",
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
      title: "انتخاب هوشمند قطعات با کیوی پارت | مادربرد | cpu | کارت گرافیک | پاور",
      description: "انتخاب هوشمند قطعات کامبپوتر - کمترین قیمت موجود در بازار - کارت گرافیک - پاور - مادربرد - cpu",
      siteName: "کیوی پارت",
      images: [
        {
          url: "https://kiwipart.ir/kiwipart.png",
        },
      ],
    },
    keywords: [
      "کیوی پارت"
    ],
  };
}

const page = () => {
  return (
    <div>

      <HeroHeader />
      <CardParts />
      <CpuMotherboard />
      <CpuGraphic />
      <GraphicPower />
      <BannerSection />
      {/* <CardService /> */}
      <ArticleSection />
    </div>
  )
}

export default page
