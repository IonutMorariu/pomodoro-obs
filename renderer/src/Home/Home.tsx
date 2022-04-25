import { Button, Center, Container, Group } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'tabler-icons-react';
import Clock from './Clock';
import ModeSelect from './ModeSelect';

type Props = {};

export enum TimerModes {
  work = 'Pomodoro',
  shortBreak = 'Short Break',
  longBreak = 'Long Break',
}
const ipcRenderer = window.require('electron').ipcRenderer;

const Home = (props: Props) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<TimerModes>(TimerModes.work);
  const [autoBreak, toggleAutoBreak] = useToggle(false, [true, false]);

  useEffect(() => {}, []);

  const time = new Date();
  time.setSeconds(
    time.getSeconds() +
      parseInt(localStorage.getItem('workDuration') || '50') * 60
  );

  const { seconds, minutes, isRunning, start, pause, resume, restart } =
    useTimer({
      expiryTimestamp: time,
      onExpire: () => console.warn('onExpire called'),
      autoStart: false,
    });

  useEffect(() => {
    ipcRenderer.send('updateTimer', { seconds, minutes });
  }, [seconds]);

  return (
    <Container>
      <Center>
        <Button
          leftIcon={<Settings />}
          mt='lg'
          mb='md'
          size='xs'
          onClick={() => navigate('/configure')}
        >
          Configure
        </Button>
      </Center>

      <ModeSelect mode={mode} setMode={setMode} restart={restart} />

      <Clock minutes={minutes} seconds={seconds} />
      <Center>
        <Group>
          <Button mx='xs' onClick={start}>
            Start
          </Button>
          <Button mx='xs' onClick={isRunning ? pause : resume}>
            {isRunning ? 'Pause' : 'resume'}
          </Button>
        </Group>
      </Center>
    </Container>
  );
};

export default Home;
