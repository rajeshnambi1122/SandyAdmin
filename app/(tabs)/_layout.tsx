import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { AuthContext } from '../_layout';

export default function TabLayout() {
  const { theme } = useTheme();
  const { user } = useContext(AuthContext);

  return (
    <>
      <StatusBar style="dark" backgroundColor={theme.colors.background.DEFAULT} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary.DEFAULT,
          tabBarInactiveTintColor: theme.colors.text.secondary,
          tabBarStyle: {
            backgroundColor: theme.colors.surface.DEFAULT,
            borderTopColor: theme.colors.border.DEFAULT,
            borderTopWidth: 1,
            paddingBottom: 4,
            paddingTop: 2,
            height: 70,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 0,
            marginBottom: 8,
          },
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
            href: user?.role === 'admin1' ? undefined : null,
            tabBarStyle: user?.role === 'admin1' ? undefined : { display: 'none' },
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