import {
  ActionIcon,
  Button,
  Container,
  Grid,
  Group,
  InputWrapper,
  NumberInput,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import React from 'react';
import { IpcMessageEvent } from 'electron';
import { File, Folder } from 'tabler-icons-react';

const ipcRenderer = window.require('electron').ipcRenderer;

type Props = {};

const SettingsForm = (props: Props) => {
  const form = useForm({
    initialValues: {
      workDuration: parseInt(
        window.localStorage.getItem('workDuration') || '50'
      ),
      shortBreak: parseInt(window.localStorage.getItem('shortBreak') || '5'),
      longBreak: parseInt(window.localStorage.getItem('longBreak') || '10'),
      workLabel: window.localStorage.getItem('workLabel') || 'Working',
      shortBreakLabel:
        window.localStorage.getItem('shortBreakLabel') || 'Short break',
      longBreakLabel:
        window.localStorage.getItem('longBreakLabel') || 'Long break',
      fileDirectory: window.localStorage.getItem('fileDirectory') || '',
    },

    validationRules: {
      workDuration: (val) => val > 1,
      shortBreak: (val) => val > 1,
      longBreak: (val) => val > 1,
    },
  });

  const handleDialogOpen = () => {
    ipcRenderer.send('openDirectory');
    ipcRenderer.on('selectedDirectory', (event: IpcMessageEvent, args: any) => {
      if (args) {
        console.log({ dir: args[0] });
        form.setFieldValue('fileDirectory', args[0]);
      }
    });
  };

  const handleFormSubmit = (ev: any) => {
    const {
      workDuration,
      shortBreak,
      longBreak,
      workLabel,
      shortBreakLabel,
      longBreakLabel,
      fileDirectory,
    } = form.values;
    ev.preventDefault();
    window.localStorage.setItem('workDuration', JSON.stringify(workDuration));
    window.localStorage.setItem('shortBreak', JSON.stringify(shortBreak));
    window.localStorage.setItem('longBreak', JSON.stringify(longBreak));
    window.localStorage.setItem('workLabel', workLabel);
    window.localStorage.setItem('shortBreakLabel', shortBreakLabel);
    window.localStorage.setItem('longBreakLabel', longBreakLabel);
    window.localStorage.setItem('fileDirectory', fileDirectory);

    ipcRenderer.send('selectDirectory', fileDirectory);
  };

  return (
    <form onSubmit={(ev) => handleFormSubmit(ev)}>
      <Grid columns={12} gutter='md'>
        <Grid.Col span={4}>
          <NumberInput
            value={form.values.workDuration}
            onChange={(value) => form.setFieldValue('workDuration', value || 0)}
            min={1}
            label='Session duration'
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput
            value={form.values.shortBreak}
            onChange={(value) => form.setFieldValue('shortBreak', value || 0)}
            min={1}
            label='Short break'
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <NumberInput
            value={form.values.longBreak}
            onChange={(value) => form.setFieldValue('longBreak', value || 0)}
            min={1}
            label='Long break'
          />
        </Grid.Col>
      </Grid>
      <Grid gutter='md'>
        <Grid.Col span={4}>
          <TextInput
            value={form.values.workLabel}
            onChange={(event) =>
              form.setFieldValue('workLabel', event.target.value)
            }
            min={1}
            label='Work label'
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            value={form.values.shortBreakLabel}
            onChange={(event) =>
              form.setFieldValue('shortBreakLabel', event.target.value)
            }
            min={1}
            label='Short break label'
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            value={form.values.longBreakLabel}
            onChange={(event) =>
              form.setFieldValue('longBreakLabel', event.target.value)
            }
            min={1}
            label='Long break label'
          />
        </Grid.Col>
      </Grid>
      <Group mb='xs' mt='sm'>
        <Text>File directory</Text>
        <ActionIcon variant='filled' ml='xs' onClick={handleDialogOpen}>
          <Folder size={16} />
        </ActionIcon>
      </Group>
      {form.values.fileDirectory && (
        <Text size='sm'>{form.values.fileDirectory}</Text>
      )}
      <Button type='submit' mt='md'>
        Save
      </Button>
    </form>
  );
};

export default SettingsForm;
