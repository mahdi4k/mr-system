import { Container, Title, Button, Group, Text, List, ThemeIcon, rem, Box, Skeleton } from '@mantine/core';
import classes from './Hero.module.css';
import { IconCheck, IconMoodSmile } from '@tabler/icons-react';
import ListItem from './ListItem';
import Image from 'next/image'
import SVG from "react-inlinesvg"

export function HeroHeader() {
  return (
    <Container size="lg">
      <div className={classes.inner}>
        {/* <Image
          className={classes.responiveImage}
          src="/svg/hero.svg"
          width={507}
          height={478}
          alt="Picture of the author"
        /> */}
        <SVG
          className={classes.heroSvg}
          loader={<Box component='div' w={{ base: 300, sm: 507 }} h={{ base: 360, md: 478 }}></Box>}

          src='/svg/hero.svg' />
        <div className={classes.content}>
          <Title className={classes.title}>
            سیستمی که دوست داری، با خیال راحت<span className={classes.highlight}> اسمبل </span>  کن
            <IconMoodSmile className={classes.IconSmile} size={50} color='var(--mantine-color-kiwi-8)' />
          </Title>
          <ListItem />
        </div>
      </div>
    </Container>
  );
}
