import { Button, Center, Container, Space } from '@mantine/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowNarrowLeft } from 'tabler-icons-react';
import DirectorySelect from './DirectorySelect';
import SettingsForm from './SettingsForm';

type Props = {};

const Configure = (props: Props) => {
  const navigate = useNavigate();
  return (
    <Container>
      <Button
        size='xs'
        leftIcon={<ArrowNarrowLeft />}
        mt='lg'
        mb='lg'
        onClick={() => navigate('/')}
      >
        Back to App
      </Button>
      <Space />
      <SettingsForm />
    </Container>
  );
};

export default Configure;
