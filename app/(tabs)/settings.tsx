import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { LoadingSpinner } from '../../components/ui/loading-spinner';
import { useTheme } from '../../contexts/ThemeContext';
import { authAPI } from '../../services/api';
import { AuthContext } from '../_layout';

interface AdminProfile {
  name: string;
  email: string;
  phone?: string;
  role: string;
}

interface Styles {
  container: ViewStyle;
  content: ViewStyle;
  profileHeader: ViewStyle;
  avatarContainer: ViewStyle;
  avatar: ViewStyle;
  avatarText: TextStyle;
  profileInfo: ViewStyle;
  profileName: TextStyle;
  profileEmail: TextStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  infoRow: ViewStyle;
  infoIcon: ViewStyle;
  infoContent: ViewStyle;
  infoLabel: TextStyle;
  infoValue: TextStyle;
  loadingContainer: ViewStyle;
  logoutButton: ViewStyle;
  logoutContent: ViewStyle;
  logoutIconContainer: ViewStyle;
  logoutText: TextStyle;
}

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { signOut } = useContext(AuthContext);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setProfile(response);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to fetch profile information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const styles = StyleSheet.create<Styles>({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.DEFAULT,
    },
    content: {
      padding: 20,
    },
    profileHeader: {
      backgroundColor: theme.colors.surface.DEFAULT,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarContainer: {
      marginRight: 16,
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: theme.colors.primary.DEFAULT,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontSize: 32,
      fontWeight: '600' as const,
      color: theme.colors.text.inverse,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: 22,
      fontWeight: '600' as const,
      color: theme.colors.text.DEFAULT,
      letterSpacing: 0.15,
      marginBottom: 4,
    },
    profileEmail: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      letterSpacing: 0.25,
    },
    section: {
      backgroundColor: theme.colors.surface.DEFAULT,
      borderRadius: 16,
      padding: 0,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      overflow: 'hidden',
    },
    sectionTitle: {
      ...theme.typography.h3,
      color: theme.colors.text.DEFAULT,
      fontSize: 18,
      fontWeight: '600' as const,
      letterSpacing: 0.15,
      padding: 20,
      paddingBottom: 12,
      backgroundColor: `${theme.colors.primary.DEFAULT}08`,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: `${theme.colors.border.light}40`,
    },
    infoIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: `${theme.colors.primary.DEFAULT}15`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
      fontSize: 13,
      letterSpacing: 0.4,
      marginBottom: 4,
      textTransform: 'uppercase',
    },
    infoValue: {
      ...theme.typography.body,
      color: theme.colors.text.DEFAULT,
      fontWeight: '500' as const,
      fontSize: 16,
      letterSpacing: 0.15,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background.DEFAULT,
    },
    logoutButton: {
      marginTop: 8,
      backgroundColor: `${theme.colors.error}10`,
      borderRadius: 16,
      overflow: 'hidden',
    },
    logoutContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 18,
    },
    logoutIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 200,
      backgroundColor: `${theme.colors.error}20`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    logoutText: {
      ...theme.typography.body,
      fontWeight: '600' as const,
      fontSize: 16,
      letterSpacing: 0.5,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
      </View>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header Card */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.name ? getInitials(profile.name) : 'A'}
            </Text>
          </View>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profile?.name || 'Admin'}</Text>
          <Text style={styles.profileEmail}>{profile?.email || 'No email'}</Text>
        </View>
      </View>

      {/* Account Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Details</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Ionicons name="person" size={22} color={theme.colors.primary.DEFAULT} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{profile?.name || 'Not set'}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Ionicons name="mail" size={22} color={theme.colors.primary.DEFAULT} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email Address</Text>
            <Text style={styles.infoValue}>{profile?.email || 'Not set'}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Ionicons name="call" size={22} color={theme.colors.primary.DEFAULT} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Phone Number</Text>
            <Text style={styles.infoValue}>{profile?.phone || 'Not set'}</Text>
          </View>
        </View>

        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <View style={styles.infoIcon}>
            <Ionicons name="shield-checkmark" size={22} color={theme.colors.primary.DEFAULT} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Account Role</Text>
            <Text style={styles.infoValue}>{profile?.role || 'Not set'}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={signOut}
      >
        <View style={styles.logoutContent}>
          <View style={styles.logoutIconContainer}>
            <Ionicons name="log-out" size={24} color={theme.colors.error} />
          </View>
          <Text style={[styles.logoutText, { color: theme.colors.error }]}>
            Sign Out
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}