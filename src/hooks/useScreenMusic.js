import { useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { soundManager } from '../utils/SoundManager';

export default function useScreenMusic(trackName) {
  const lastTrack = useRef(null);

  useFocusEffect(
    useCallback(() => {
      if (lastTrack.current !== trackName) {
        lastTrack.current = trackName;
        soundManager.playMusic(trackName);
      }
    }, [trackName])
  );
}
