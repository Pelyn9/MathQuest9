import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useGame } from '../context/GameContext';
import { DIFFICULTY } from '../utils/gameLogic';

import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LevelScreen from '../screens/LevelScreen';
import QuizScreen from '../screens/QuizScreen';
import ResultScreen from '../screens/ResultScreen';
import AssessmentScreen from '../screens/AssessmentScreen';
import ShopScreen from '../screens/ShopScreen';
import DifficultySelectScreen from '../screens/DifficultySelectScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { colors: C } = useTheme();
  const { state } = useGame();
  const activeDifficulty = DIFFICULTY[state.difficulty] || DIFFICULTY.normal;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Map') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: activeDifficulty.color,
        tabBarInactiveTintColor: C.textMuted,
        tabBarStyle: {
          backgroundColor: C.card,
          borderTopWidth: 1,
          borderTopColor: C.backgroundLight,
          paddingBottom: 12,
          paddingTop: 8,
          height: 82,
          minHeight: 82,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
          paddingHorizontal: 4,
          minHeight: 50,
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 2,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          lineHeight: 14,
          fontWeight: '700',
          fontFamily: C.fontFamily,
        },
        tabBarLabelPosition: 'below-icon',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ tabBarLabel: 'Map' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator({ hasChosenDifficulty }) {
  return (
    <Stack.Navigator
      initialRouteName={hasChosenDifficulty ? 'Main' : 'DifficultySelect'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="DifficultySelect" component={DifficultySelectScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="Level" component={LevelScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="Assessment" component={AssessmentScreen} />
      <Stack.Screen name="Shop" component={ShopScreen} />
    </Stack.Navigator>
  );
}
