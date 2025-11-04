import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CalendarScreen from '../src/screens/CalendarScreen';
import QuickAddScreen from '../src/screens/QuickAddScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'ellipse-outline';

            if (route.name === 'Задачи') iconName = 'list';
            else if (route.name === 'Календарь') iconName = 'calendar';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Задачи" component={QuickAddScreen} />
        <Tab.Screen name="Календарь" component={CalendarScreen} />
      </Tab.Navigator>
    </GestureHandlerRootView>
  );
}
