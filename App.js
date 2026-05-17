import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { ThemeProvider } from './src/theme/ThemeContext';
import { GameProvider, useGame } from './src/context/GameContext';
import { ToastProvider } from './src/context/ToastContext';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import { RpgTransitionProvider } from './src/components/RpgRouteTransition';

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
      <View style={styles.navigatorShell}>
        <RpgTransitionProvider>
          <AppNavigator hasChosenDifficulty={state.hasChosenDifficulty} />
        </RpgTransitionProvider>
      </View>
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
            <View style={styles.appOuter}>
              <View style={styles.appFrame}>
                <AppContent />
              </View>
            </View>
          </ToastProvider>
        </GameProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appOuter: {
    flex: 1,
    backgroundColor: '#101217',
    alignItems: 'center',
    overflow: 'hidden',
  },
  appFrame: {
    flex: 1,
    width: '100%',
    backgroundColor: '#051126',
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? {
      maxWidth: 430,
      minHeight: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.28,
      shadowRadius: 30,
    } : null),
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  navigatorShell: {
    flex: 1,
    backgroundColor: '#051126',
    overflow: 'hidden',
  },
});
