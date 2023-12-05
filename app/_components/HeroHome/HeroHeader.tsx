import { Container, Title, Button, Group, Text, List, ThemeIcon, rem } from '@mantine/core';
import classes from './Hero.module.css';
import { IconCheck, IconMoodSmile } from '@tabler/icons-react';
import ListItem from './ListItem';
import Image from 'next/image'

export function HeroHeader() {
  return (
    <Container size="lg">
      <div className={classes.inner}>
        <Image
          className={classes.responiveImage}
          src="/svg/hero.svg"
          width={500}
          height={400}
          alt="Picture of the author"
        />
        <div className={classes.content}>
          <Title className={classes.title}>
            سیستمی <span className={classes.highlight}> که دوست داری</span> خیلی راحت  رو هم کن
            <IconMoodSmile className={classes.IconSmile} size={50}  color='var(--mantine-color-kiwi-8)' />
          </Title>
          <ListItem />
        </div>
      </div>
    </Container>
  );
}
