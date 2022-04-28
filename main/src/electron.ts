import { BrowserWindow, app, ipcMain, IpcMessageEvent, dialog } from 'electron';
import * as isDev from 'electron-is-dev';
import * as path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 600,
		height: 400,
		resizable: false,
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: true,
		},
	});
	let fileDirectory = '';
	mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
	mainWindow.on('closed', () => mainWindow.destroy());

	ipcMain.on('selectDirectory', (event: any, arg: any) => {
		fileDirectory = arg;
	});

	ipcMain.on('openDirectory', function () {
		let dir = dialog.showOpenDialog(mainWindow, {
			properties: ['openDirectory'],
		});

		mainWindow.webContents.send('selectedDirectory', dir);
	});

	ipcMain.on('updateTimer', (event: any, arg: any) => {
		if (!fs) {
			return;
		}
		if (fileDirectory) {
			const seconds = arg.seconds < 10 ? `0${arg.seconds}` : arg.seconds;
			fs.writeFile(`${fileDirectory}\\timer.txt`, `${arg.minutes}:${seconds}`, { encoding: 'utf-8' }, (e) => {
				console.error(e);
			});
		}
	});

	ipcMain.on('updateLabel', (event: any, arg: any) => {
		if (!fs) {
			return;
		}
		console.log(arg);
		if (fileDirectory) {
			fs.writeFile(`${fileDirectory}\\label.txt`, `${arg}`, { encoding: 'utf-8' }, (e) => {});
		}
	});
}

//in you main process:-

//hold the array of directory paths selected by user

app.on('ready', createWindow);
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});
