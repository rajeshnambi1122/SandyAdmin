import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyANVivOQ_XKvdOJbscn6W242V5q20Ww7wk",
  projectId: "sandymarket-4e8e9",
  storageBucket: "sandymarket-4e8e9.firebasestorage.app",
  messagingSenderId: "757306243529",
  appId: "1:757306243529:android:5539ca0738eb5eee3f9018"
};

// Initialize Firebase
let app;
try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully with config:', {
      projectId: firebaseConfig.projectId,
      messagingSenderId: firebaseConfig.messagingSenderId
    });
  } else {
    app = getApp();
    console.log('Using existing Firebase app');
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

// Initialize Firebase Cloud Messaging
let messagingInstance: FirebaseMessagingTypes.Module;
try {
  if (Platform.OS === 'android') {
    messagingInstance = messaging();
    messagingInstance.setAutoInitEnabled(true);
    
    // Check if FCM is available
    const checkFCMRegistration = async () => {
      try {
        const isRegistered: boolean = await messagingInstance.isDeviceRegisteredForRemoteMessages;
        console.log('FCM Device Registration Status:', isRegistered);
      } catch (error: unknown) {
        console.error('Error checking FCM registration:', error);
      }
    };

    // Get the FCM token
    const getFCMToken = async () => {
      try {
        const token: string = await messagingInstance.getToken();
        console.log('FCM Token:', token);
      } catch (error: unknown) {
        console.error('Error getting FCM token:', error);
      }
    };

    // Execute the async functions
    checkFCMRegistration();
    getFCMToken();

    console.log('Firebase Messaging initialized for Android');
  } else {
    console.log('Firebase Messaging not initialized for non-Android platform');
  }
} catch (error) {
  console.error('Firebase Messaging initialization error:', error);
}

export { app, messagingInstance as messaging };

