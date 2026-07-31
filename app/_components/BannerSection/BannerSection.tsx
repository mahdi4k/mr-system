import { Container, Title, Box, Flex, Text } from "@mantine/core";
import { IconBrandTelegram } from "@tabler/icons-react";
import React from "react";
import bannerClasses from "./banner.module.css";
import SVG from "react-inlinesvg";
import Link from "next/link";

const BannerSection = () => {
  return (
    <Container styles={{ root: { flex: "1 0 auto" } }} size={"lg"}>
      <div className={bannerClasses.wrapper}>
        <div className={bannerClasses.body}>
          <Title className={bannerClasses.title}>
            به راهنمایی بیشتری نیاز دارید؟
          </Title>

          <Text fz="md" c="dimmed">
            در کانال و گروه کیوی پارت میتونید هرگونه سوال و یا مشکلی در انتخاب
            قطعات داشتید از ما سوال کنید✌️
          </Text>

          <div className={bannerClasses.controls}>
            <Link target="_blank" href={"https://t.me/kiwi_part"}>
              <button className={bannerClasses.bannerBtn}>
                <Flex align={"center"} justify={"center"}>
                  <Text ml={"5px"}>ورود به کانال تلگرام</Text>
                  <IconBrandTelegram
                    className={bannerClasses.paperPlane}
                    color="#24A1DE"
                    size={"20px"}
                  />
                </Flex>
              </button>
            </Link>
          </div>
        </div>

        <SVG
          className={bannerClasses.image}
          loader={
            <Box component="div" w={{ base: 300, md: 507 }} h={220}></Box>
          }
          src="/svg/bannerRow.svg"
        />
      </div>
    </Container>
  );
};

export default BannerSection;
