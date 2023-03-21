import React, { useState, useEffect } from 'react';
import modeToggleStyles from '../styles/ModeToggle.module.scss';

import Image from 'next/image';

import { useSelector, useDispatch } from 'react-redux';
import { setMode } from '../state';
import { ModeRootState } from '../utils/interfaces/ReduxStateProps';

import DarkMode from '../assets/images/dark-mode.svg';
import LightMode from '../assets/images/light-mode.svg';

const ModeToggle = () => {
  const [lightModeState, setLightModeState] = useState(true);
  const [darkModeState, setDarkModeState] = useState(false);
  const dispatch = useDispatch();
  const mode = useSelector((state: ModeRootState) => state.mode);

  useEffect(() => {
    if (mode === 'dark') {
      setLightModeState(false);
      setDarkModeState(true);
    }
  }, [mode]);

  const handleModeChange = () => {
    dispatch(setMode());
  };

  return (
    <div
      className={modeToggleStyles.lightDarkToggle}
      onClick={() => {
        setLightModeState(!lightModeState);
        setDarkModeState(!darkModeState);
        handleModeChange();
      }}
    >
      <Image
        src={LightMode}
        className={
          lightModeState
            ? modeToggleStyles.lightDarkToggle__lightMode
            : modeToggleStyles.lightDarkToggle__lightModeHidden
        }
        alt="light-mode"
      />
      <Image
        src={DarkMode}
        className={
          darkModeState
            ? modeToggleStyles.lightDarkToggle__darkMode
            : modeToggleStyles.lightDarkToggle__darkModeHidden
        }
        alt="dark-mode"
      />
    </div>
  );
};

export default ModeToggle;
