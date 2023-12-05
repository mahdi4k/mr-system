'use client';

import { MantineColorsTuple, createTheme } from '@mantine/core';
const kiwi: MantineColorsTuple = [
  '#fbfeec',
  '#f6fbd8',
  '#7ea300',
  '#dff379',
  '#d5f053',
  '#cfee3c',
  '#cbed31',
  '#b3d226',
  '#9ebb1d',
  '#87a10c'
];
export const theme = createTheme({
  colors: {
    kiwi,
  }
});
