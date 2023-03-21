import React, { useState, useEffect } from 'react';
import modeToggleStyles from '../styles/ModeToggle.module.scss';

import Image from 'next/image';

import { useSelector, useDispatch } from 'react-redux';
import { setMode } from '../state';
import { ModeRootState } from '../utils/interfaces/ReduxStateProps';

import DarkMode from '../assets/images/dark-mode.svg';
import LightMode from '../assets/images/light-mode.svg';
import LightModeDarkFill from '../assets/images/light-mode-black-fill.svg';

interface ModeToggleProps {
  mobile?: boolean;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ mobile }) => {
  const [lightModeState, setLightModeState] = useState(true);
  const [darkModeState, setDarkModeState] = useState(false);
  const dispatch = useDispatch();
  const mode = useSelector((state: ModeRootState) => state.mode);

  useEffect(() => {
    if (mode === 'dark') {
      setLightModeState(false);
      setDarkModeState(true);
    } else if (mode === 'light') {
      setLightModeState(true);
      setDarkModeState(false);
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
        src={mobile ? LightModeDarkFill : LightMode}
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
