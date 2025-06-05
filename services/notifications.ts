import messaging from '@react-native-firebase/messaging';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { Alert, AppState, Linking, Platform } from 'react-native';
import { adminAPI } from './api';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
    android: {
      icon: '@mipmap/ic_launcher',
      color: '#FF231F7C',
      priority: 'high',
      vibrate: [0, 250, 250, 250],
      sound: true,
      channelId: 'default'
    }
  }),
});

// Track app state
let appState = AppState.currentState;

// Listen for app state changes
AppState.addEventListener('change', nextAppState => {
  console.log('App state changed:', { from: appState, to: nextAppState });
  appState = nextAppState;
});

// Configure notification channel for Android
const configureNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
        enableVibrate: true,
        enableLights: true,
        showBadge: true,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
      console.log('Notification channel configured successfully');
    } catch (error) {
      console.error('Error configuring notification channel:', error);
    }
  }
};

export const requestNotificationPermission = async () => {
  try {
    if (!Device.isDevice) {
      console.log('Push notifications are not supported on this device/emulator.');
      return null; 
    }

    // First request Expo notification permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      console.log('Requesting Expo notification permissions...');
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get Expo notification permissions!');
      Alert.alert(
        'Permission Required',
        'Please enable notifications in your device settings to receive important updates.',
        [
          {
            text: 'Open Settings',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
      return null;
    }

    // Configure notification channel for Android
    await configureNotificationChannel();

    // Then request Firebase messaging permissions
    console.log('Requesting Firebase messaging permissions...');
    const authStatus = await messaging().requestPermission();
    console.log('Firebase messaging permission status:', authStatus);
    
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('Failed to get Firebase messaging permissions!');
      Alert.alert(
        'Permission Required',
        'Please enable notifications in your device settings to receive important updates.',
        [
          {
            text: 'Open Settings',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
      return null;
    }

    // Get FCM token
    const token = await messaging().getToken();
    console.log('Native FCM Token:', token);

    if (token) {
      // Send token to backend
      try {
        await adminAPI.updateFCMToken(token);
        console.log('FCM Token sent to backend successfully');
        return token;
      } catch (error) {
        console.error('Error sending FCM token to backend:', error);
        return null;
      }
    } else {
      console.log('FCM token not available.');
      return null;
    }

  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

// Handle background messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', {
    messageId: remoteMessage.messageId,
    data: remoteMessage.data,
    notification: remoteMessage.notification,
    appState
  });
  
  // Only schedule a local notification if the app is in background
  if (remoteMessage.notification && appState === 'background') {
    try {
      // Cancel any existing notifications to prevent duplicates
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification.title,
          body: remoteMessage.notification.body,
          data: remoteMessage.data,
        },
        trigger: null,
      });
      console.log('Background notification scheduled successfully');
    } catch (error) {
      console.error('Error scheduling background notification:', error);
    }
  }
});

export const setupNotificationListeners = () => {
  console.log('Setting up notification listeners...');
  
  // Handle FCM messages when app is in foreground
  const onMessageListener = messaging().onMessage(async remoteMessage => {
    console.log('FCM Message received in foreground:', {
      messageId: remoteMessage.messageId,
      data: remoteMessage.data,
      notification: remoteMessage.notification,
      appState
    });
    
    // For foreground messages, we can show the notification directly
    if (remoteMessage.notification) {
      try {
        // Cancel any existing notifications to prevent duplicates
        await Notifications.cancelAllScheduledNotificationsAsync();
        
        await Notifications.scheduleNotificationAsync({
          content: {
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            data: remoteMessage.data,
          },
          trigger: null,
        });
        console.log('Foreground notification scheduled successfully');
      } catch (error) {
        console.error('Error scheduling foreground notification:', error);
      }
    }
  });

  // Handle notification tap when app is in background
  const backgroundListener = messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification opened app from background:', {
      messageId: remoteMessage.messageId,
      data: remoteMessage.data,
      notification: remoteMessage.notification
    });
    handleNotificationNavigation(remoteMessage.data);
  });

  // Handle notification tap when app was opened from quit state
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification opened app from quit state:', {
          messageId: remoteMessage.messageId,
          data: remoteMessage.data,
          notification: remoteMessage.notification
        });
        handleNotificationNavigation(remoteMessage.data);
      }
    })
    .catch(error => {
      console.error('Error getting initial notification:', error);
    });

  // Add notification response listener
  const notificationResponseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification response received:', response);
    handleNotificationNavigation(response.notification.request.content.data);
  });

  return () => {
    onMessageListener();
    backgroundListener();
    notificationResponseSubscription.remove();
  };
};

// Helper function to handle navigation based on notification data
const handleNotificationNavigation = (data: any) => {
  if (!data) return;

  console.log('Handling notification navigation with data:', data);

  // Add a longer delay to ensure navigation state is ready
  setTimeout(() => {
    try {
      // Navigate to orders tab for all notifications
      router.replace('/(tabs)/orders');
      console.log('Navigation to orders tab initiated');
    } catch (error) {
      console.error('Error navigating to orders tab:', error);
      // Retry navigation after a longer delay if first attempt fails
      setTimeout(() => {
        try {
          router.replace('/(tabs)/orders');
          console.log('Retry navigation to orders tab initiated');
        } catch (retryError) {
          console.error('Error in retry navigation to orders tab:', retryError);
        }
      }, 2000);
    }
  }, 1500);
}; 