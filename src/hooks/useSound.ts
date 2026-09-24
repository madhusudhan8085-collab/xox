import { useState, useEffect } from 'react';
import { getItem, setItem } from '../utils/storage';
import { soundManager } from '../utils/sound';

export function useSound() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return getItem<boolean>('sound_enabled', true);
  });

  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
    setItem('sound_enabled', soundEnabled);
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  return {
    soundEnabled,
    toggleSound,
    soundManager,
  };
}
