import { Stack, StackProps } from '@chakra-ui/react';

export const Main = (props: StackProps) => (
  <Stack
    spacing='20'
    width='100%'
    maxWidth='5xl'
    pt='8rem'
    px='1rem'
    {...props}
  />
);
