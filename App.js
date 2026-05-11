import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Animated, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { ThemeProvider } from './src/theme/ThemeContext';
import { GameProvider, useGame } from './src/context/GameContext';
import { ToastProvider } from './src/context/ToastContext';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import AppText from './src/components/AppText';

function AppContent() {
  const { state, loaded } = useGame();
  const [showSplash, setShowSplash] = useState(true);
  const splashExitAnim = useRef(new Animated.Value(1)).current;

  const handleSplashFinish = useCallback(() => {
    let didFinish = false;
    const finish = () => {
      if (didFinish) return;
      didFinish = true;
      setShowSplash(false);
    };

    Animated.timing(splashExitAnim, {
      toValue: 0, duration: 300, useNativeDriver: true,
    }).start(finish);

    setTimeout(finish, 450);
  }, [splashExitAnim]);

  useEffect(() => {
    if (loaded && showSplash) {
      const timer = setTimeout(handleSplashFinish, 3200);
      return () => clearTimeout(timer);
    }
  }, [loaded, showSplash, handleSplashFinish]);

  if (showSplash || !loaded) {
    return (
      <Animated.View style={[styles.splashContainer, { opacity: splashExitAnim }]}>
        <StatusBar style="light" />
        <SplashScreen />
      </Animated.View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <AppNavigator hasChosenDifficulty={state.hasChosenDifficulty} />
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'AncientModernTales': require('./assets/fonts/AncientModernTales.otf'),
  });
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => setAppReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!appReady || !fontsLoaded) {
    return (
      <Animated.View style={styles.splashContainer}>
        <StatusBar style="light" />
        <SplashScreen />
      </Animated.View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <GameProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </GameProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
  },
});
