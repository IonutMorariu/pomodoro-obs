import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from '@mantine/core';
import Home from './Home';
import AppContainer from './AppContainer';
import Configure from './Configure';
const electron = window.require('electron');

const ipcRenderer = electron.ipcRenderer;

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    const fileDirectory = localStorage.getItem('fileDirectory');
    if (fileDirectory) {
      ipcRenderer.send('selectDirectory', fileDirectory);
    }
  }, []);

  return (
    <>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider theme={{ colorScheme, primaryColor: 'cyan' }}>
          <AppContainer>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/configure' element={<Configure />} />
            </Routes>
          </AppContainer>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

export default App;
