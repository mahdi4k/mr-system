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

const green: MantineColorsTuple = [
  '#ebfbee', '#d3f9d8', '#b2f2bb', '#8ce99a', '#69db7c',
  '#51cf66', '#40c057', '#37b24d', '#2f9e44', '#2b8a3e'
];
export const theme = createTheme({
  colors: {
    kiwi,
  },
  primaryColor: 'green',
});
