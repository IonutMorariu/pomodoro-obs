import { Center, Text, Title } from '@mantine/core';
import React from 'react';

type Props = {
  minutes: number;
  seconds: number;
};

const Clock = ({ minutes, seconds }: Props) => {
  return (
    <Center>
      <Text style={{ fontSize: '6rem', fontWeight: 600 }}>
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </Text>
    </Center>
  );
};

export default Clock;
