import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.tabBar, { backgroundColor: theme.colors.surface.DEFAULT }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          // Add haptic feedback for both iOS and Android
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            <View style={styles.tabButton}>
              <View
                style={[
                  styles.iconContainer,
                  isFocused && {
                    backgroundColor: `${theme.colors.primary.DEFAULT}25`,
                    borderRadius: 20,
                    paddingHorizontal: 25,
                    paddingVertical: 5,
                  },
                ]}
              >
                {options.tabBarIcon &&
                  options.tabBarIcon({
                    focused: isFocused,
                    color: isFocused
                      ? theme.colors.primary.DEFAULT
                      : theme.colors.text.secondary,
                    size: 24,
                  })}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isFocused
                      ? theme.colors.primary.DEFAULT
                      : theme.colors.text.secondary,
                    fontWeight: isFocused ? '700' : '600',
                  },
                ]}
              >
                {typeof label === 'string' ? label : ''}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 88 : 80,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
    paddingTop: 12,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop:5
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
    minHeight: 32,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

