import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export function HapticTab(props: BottomTabBarButtonProps) {
  const { theme } = useTheme();
  // @ts-ignore - accessibilityState exists but TypeScript doesn't recognize it
  const isSelected = props.accessibilityState?.selected;
  
  return (
    <View style={styles.tabContainer}>
      <PlatformPressable
        {...props}
        style={[
          props.style,
          styles.tabButton,
          isSelected && {
            backgroundColor: `${theme.colors.primary.DEFAULT}20`,
            borderRadius: 20,
            paddingHorizontal: 20,
          }
        ]}
        onPressIn={(ev) => {
          if (process.env.EXPO_OS === 'ios') {
            // Add a soft haptic feedback when pressing down on the tabs.
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          props.onPressIn?.(ev);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 2,
    borderRadius: 20,
    minWidth: 64,
  },
});
