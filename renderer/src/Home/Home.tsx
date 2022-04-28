import { Button, Center, Container, Group } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'tabler-icons-react';
import Clock from './Clock';
import ModeSelect from './ModeSelect';
import useSound from 'use-sound';

import { createCanvas, loadImage } from 'canvas';

import ding from './ding.wav';

type Props = {};

export enum TimerModes {
  work = 'Pomodoro',
  shortBreak = 'Short Break',
  longBreak = 'Long Break',
}

const maxPomodoros = 4;
const ipcRenderer = window.require('electron').ipcRenderer;

const Home = (props: Props) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<TimerModes>(TimerModes.work);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const [play] = useSound(ding);

  useEffect(() => {}, []);

  const time = new Date();
  time.setSeconds(
    time.getSeconds() +
      parseInt(localStorage.getItem('workDuration') || '50') * 60
  );

  const { seconds, minutes, isRunning, start, pause, resume, restart } =
    useTimer({
      expiryTimestamp: time,
      onExpire: async () => {
        play();
        if (mode === TimerModes.work) {
          try {
            const canvas = createCanvas(4 * 256 + 8 * 32, 256);
            const ctx = canvas.getContext('2d');

            const fullTomato = await loadImage('./tomate.png');
            const emptyTomato = await loadImage('./tomate-outline.png');

            for (let i = 0; i < maxPomodoros; i++) {
              if (i < pomodoroCount + 1) {
                ctx.drawImage(fullTomato, i * 288, 0, 256, 256);
              } else {
                ctx.drawImage(emptyTomato, i * 288, 0, 256, 256);
              }
            }

            const url = canvas.toDataURL('image/png');
            ipcRenderer.send('updateCounter', url);
            console.log({ url });

            handleRestart();
          } catch (e) {
            console.log(e);
          }
          setPomodoroCount(
            pomodoroCount + 1 >= maxPomodoros ? maxPomodoros : pomodoroCount + 1
          );
        }
      },
      autoStart: false,
    });

  const handleRestart = () => {
    const time = new Date();
    time.setSeconds(
      time.getSeconds() +
        parseInt(localStorage.getItem('workDuration') || '50') * 60
    );
    restart(time, false);
  };

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
            {isRunning ? 'Pause' : 'Resume'}
          </Button>
        </Group>
      </Center>
    </Container>
  );
};

export default Home;
