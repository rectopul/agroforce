import React from 'react';

import { Container, Spinner, Text } from './styles';

export default function Loading({ color = '#00567B', size = 50, text = '' }) {
  return (
    <Container>
      <Spinner color={color} size={size} />
      <Text>{text}</Text>
    </Container>
  );
}
