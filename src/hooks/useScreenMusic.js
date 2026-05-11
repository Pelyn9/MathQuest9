import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { soundManager } from '../utils/SoundManager';

export default function useScreenMusic(trackName) {
  useFocusEffect(
    useCallback(() => {
      soundManager.playMusic(trackName);
    }, [trackName])
  );
}
