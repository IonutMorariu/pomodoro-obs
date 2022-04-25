import { Container } from '@mantine/core';
import React from 'react';

import useStyles from './style';

const AppContainer: React.FC = ({ children }) => {
  const { classes } = useStyles();
  return (
    <Container px={0} m={0} className={classes.wrapper}>
      {children}
    </Container>
  );
};

export default AppContainer;
