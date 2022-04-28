import { Button, Center, Group } from '@mantine/core';
import React from 'react';
import { TimerModes } from './Home';

const ipcRenderer = window.require('electron').ipcRenderer;

type Props = {
	mode: TimerModes;
	setMode: (mode: TimerModes) => void;
	restart: (newDate: Date, autoStart: boolean) => void;
};

const ModeSelect = ({ mode, setMode, restart }: Props) => {
	const handleModeChange = (newMode: TimerModes) => {
		if (newMode !== mode) {
			const newDate = new Date();
			const timeToAdd = getMoreSeconds(newMode);
			newDate.setSeconds(newDate.getSeconds() + getMoreSeconds(newMode));
			ipcRenderer.send('updateLabel', getModeLabel(newMode));
			restart(newDate, false);
			setMode(newMode);

			ipcRenderer.send('updateTimer', {
				minutes: timeToAdd / 60,
				seconds: 0,
			});
		}
	};

	const getMoreSeconds = (newMode: TimerModes) => {
		switch (newMode) {
			case TimerModes.work:
				return parseInt(localStorage.getItem('workDuration') || '50') * 60;
			case TimerModes.shortBreak:
				return parseInt(localStorage.getItem('shortBreak') || '5') * 60;
			case TimerModes.longBreak:
				return parseInt(localStorage.getItem('longBreak') || '10') * 60;
		}
	};

	const getModeLabel = (newMode: TimerModes) => {
		switch (newMode) {
			case TimerModes.work:
				return localStorage.getItem('workLabel') || '';
			case TimerModes.shortBreak:
				return localStorage.getItem('shortBreakLabel') || '';
			case TimerModes.longBreak:
				return localStorage.getItem('longBreakLabel') || '';
		}
	};

	return (
		<Center>
			<Group>
				<Button
					onClick={() => handleModeChange(TimerModes.work)}
					mx='sm'
					variant={mode === TimerModes.work ? 'light' : 'subtle'}>
					{TimerModes.work}
				</Button>
				<Button
					onClick={() => handleModeChange(TimerModes.shortBreak)}
					mx='sm'
					variant={mode === TimerModes.shortBreak ? 'light' : 'subtle'}>
					{TimerModes.shortBreak}
				</Button>
				<Button
					onClick={() => handleModeChange(TimerModes.longBreak)}
					mx='sm'
					variant={mode === TimerModes.longBreak ? 'light' : 'subtle'}>
					{TimerModes.longBreak}
				</Button>
			</Group>
		</Center>
	);
};

export default ModeSelect;
