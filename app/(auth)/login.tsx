import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState } from 'react';
import {
    Alert,
    Image,
    ImageStyle,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useTheme } from '../../contexts/ThemeContext';
import { authAPI } from '../../services/api';
import { AuthContext } from '../_layout';

interface Styles {
  container: ViewStyle;
  scrollContent: ViewStyle;
  formContainer: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  inputContainer: ViewStyle;
  label: TextStyle;
  input: TextStyle;
  inputError: TextStyle;
  errorText: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  logoContainer: ViewStyle;
  logo: ImageStyle;
  passwordContainer: ViewStyle;
  eyeButton: ViewStyle;
}

export default function LoginScreen() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const { signIn } = useContext(AuthContext);

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
    } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      
      if (response.token) {
        await signIn(response.token);
      } else {
        Alert.alert(
          'Login Failed',
          'Invalid response from server. Please try again.'
        );
      }
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Error',
        error.message || 'Unable to connect to the server. Please check your internet connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.DEFAULT }]}>
         <StatusBar style="dark" backgroundColor={theme.colors.background.DEFAULT} />
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: 'transparent' }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={[styles.formContainer, { 
            backgroundColor: '#FFFFFF',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 16,
            elevation: 5,
          }]}>
            <Text style={[styles.title, { color: theme.colors.text.DEFAULT }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>Sign in to your admin account</Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text.DEFAULT }]}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    borderColor: theme.colors.border.DEFAULT,
                    color: theme.colors.text.DEFAULT,
                    backgroundColor: theme.colors.background.DEFAULT
                  },
                  errors.email && styles.inputError
                ]}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.text.secondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              {errors.email && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.email}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text.DEFAULT }]}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      borderColor: theme.colors.border.DEFAULT,
                      color: theme.colors.text.DEFAULT,
                      backgroundColor: theme.colors.background.DEFAULT,
                      flex: 1
                    },
                    errors.password && styles.inputError
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.colors.text.secondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <FontAwesome
                    name={showPassword ? 'eye-slash' : 'eye'}
                    size={20}
                    color={theme.colors.text.secondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>{errors.password}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.button, { 
                backgroundColor: theme.colors.primary.DEFAULT,
                shadowColor: theme.colors.primary.DEFAULT,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <LoadingSpinner size="small" color={theme.colors.text.inverse} />
              ) : (
                <Text style={[styles.buttonText, { color: theme.colors.text.inverse }]}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 24,
  },
  formContainer: {
    borderRadius: 24,
    padding: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: 0.15,
    fontWeight: '400',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    letterSpacing: 0.15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    padding: 8,
    zIndex: 1,
  },
  inputError: {
    borderColor: '#ff0000',
    borderWidth: 2,
  },
  errorText: {
    fontSize: 13,
    marginTop: 6,
    letterSpacing: 0.25,
  },
  button: {
    padding: 16,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    height: 56,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
}); 