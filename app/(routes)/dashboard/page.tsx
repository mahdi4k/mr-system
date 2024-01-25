"use client"

import { Card, Grid, Text, Group } from '@mantine/core'
import React from 'react'
import Image from "next/image";
import classes from './dashboard.module.css'
const page = () => {
  return (
    <Grid>
      <Grid.Col span={3}>
        <Card className={classes.dashboradCard} shadow="md" radius="md" m={'lg'} p={'lg'}  >
          <Card.Section mt={'0'} ta={'center'}>
            <Image width={110} height={60} src={'/svg/cpu.svg'} alt={'cpu'} />
          </Card.Section>
          <Text ta={'center'} fw={500}>
            cpu
          </Text>
        </Card>
      </Grid.Col>
      <Grid.Col span={3}>
        <Card className={classes.dashboradCard} shadow="md" radius="md" m={'lg'} p={'lg'}  >
          <Card.Section mt={'0'} ta={'center'}>
            <Image width={110} height={60} src={'/svg/motherboard.svg'} alt={'cpu'} />
          </Card.Section>
          <Text ta={'center'} fw={500}>
            مادربورد
          </Text>
        </Card>
      </Grid.Col>
      <Grid.Col span={3}>
        <Card className={classes.dashboradCard} shadow="md" radius="md" m={'lg'} p={'lg'}  >
          <Card.Section mt={'0'} ta={'center'}>
            <Image width={110} height={60} src={'/svg/graphic.svg'} alt={'cpu'} />
          </Card.Section>
          <Text ta={'center'} fw={500}>
            کارت گرافیک
          </Text>
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>

      </Grid.Col>
    </Grid>
  )
}

export default page