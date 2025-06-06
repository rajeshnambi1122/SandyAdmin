import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { createContext, useEffect, useState } from 'react';
import { View } from 'react-native';
import LoadingSpinner from '../components/LoadingSpinner';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { authAPI } from '../services/api';
import { requestNotificationPermission } from '../services/notifications';

SplashScreen.preventAutoHideAsync();

export const AuthContext = createContext<{
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  user: any;
}>({
  signIn: async () => {},
  signOut: async () => {},
  isAuthenticated: false,
  user: null,
});

function RootLayoutContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const segments = useSegments();
  const router = useRouter();
  const { theme } = useTheme();

  // Temporarily remove custom font loading
  const [loadedFonts] = useFonts({});

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for existing token
        const token = await AsyncStorage.getItem('token');
        if (token) {
          // Get user data
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
          
          // Request notification permissions
          await requestNotificationPermission();
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        // Clear invalid token
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      console.log('Navigation check:', { isAuthenticated, segments, isLoading });
      const inAuthGroup = segments[0] === '(auth)';
      
      if (!isAuthenticated && !inAuthGroup) {
        console.log('Redirecting to /(auth)/login');
        router.replace('/(auth)/login');
      } else if (isAuthenticated && inAuthGroup) {
        console.log('Redirecting to /(tabs)/orders');
        router.replace('/(tabs)/orders');
      } else if (isAuthenticated && segments[0] === '(tabs)' && segments[1] === undefined) {
        // Only redirect to orders if we're at the root of tabs
        console.log('Redirecting from root to orders');
        router.replace('/(tabs)/orders');
      }
    }
  }, [isAuthenticated, segments, isLoading]);

  useEffect(() => {
    if (loadedFonts) {
      SplashScreen.hideAsync();
    }
  }, [loadedFonts]);

  const signIn = async (token: string) => {
    try {
      console.log('Signing in with token:', token.substring(0, 20) + '...');
      await AsyncStorage.setItem('token', token);
      setIsAuthenticated(true);
      
      // Get user data
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      // Request notification permissions after successful login
      console.log('Requesting notification permissions after login...');
      await requestNotificationPermission();
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out...');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background.DEFAULT }}>
        <LoadingSpinner size="large" color={theme.colors.primary.DEFAULT} />
      </View>
    );
  }

  if (!loadedFonts) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthContext.Provider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
