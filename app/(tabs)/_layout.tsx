import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { Platform } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { AuthContext } from '../_layout';
import { CustomTabBar } from '../../components/CustomTabBar';

export default function TabLayout() {
  const { theme } = useTheme();
  const { user } = useContext(AuthContext);

  return (
    <>
      <StatusBar style="dark" backgroundColor={theme.colors.background.DEFAULT} />
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary.DEFAULT,
          },
          headerTintColor: theme.colors.text.inverse,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 20,
          },
          headerShown: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            headerTitle: 'Sandy\'s Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: 'Orders',
            headerTitle: 'Orders',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="shopping-cart" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            headerTitle: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="cog" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}