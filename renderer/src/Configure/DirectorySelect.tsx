import { Button } from '@mantine/core';
import React from 'react';
import { IpcMessageEvent } from 'electron';
const ipcRenderer = window.require('electron').ipcRenderer;

type Props = {};

const DirectorySelect = (props: Props) => {
  const handleDialogOpen = () => {
    ipcRenderer.send('openDirectory');
    ipcRenderer.on('selectedDirectory', (event: IpcMessageEvent, args: any) => {
      console.log({ dir: args[0] });
    });
  };

  return (
    <Button size='xs' onClick={handleDialogOpen}>
      Open Dialog
    </Button>
  );
};

export default DirectorySelect;
