import { View, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors, spacingY } from '@/constants/Theme';
import { verticalScale } from '@/utils/styling';
import { Ionicons } from "@expo/vector-icons";

export default function CustomTabs({ state, descriptors, navigation }: BottomTabBarProps) {
    const tabBarIcons: any = {
      index: (isFocused: boolean) => (
          <View style={isFocused ? styles.activeTabContainer : null}>
              <Ionicons
                  name={isFocused ? "home" : "home-outline"}
                  size={verticalScale(30)}
                  color={isFocused ? colors.white : colors.primary}
              />
          </View>
      ),
      statistics: (isFocused: boolean) => (
          <View style={isFocused ? styles.activeTabContainer : null}>
              <Ionicons
                  name={isFocused ? "stats-chart" : "stats-chart-outline"}
                  size={verticalScale(30)}
                  color={isFocused ? colors.white : colors.primary}
              />
          </View>
      ),
      wallet: (isFocused: boolean) => (
          <View style={isFocused ? styles.activeTabContainer : null}>
              <Ionicons
                  name={isFocused ? "wallet" : "wallet-outline"}
                  size={verticalScale(30)}
                  color={isFocused ? colors.white : colors.primary}
              />
          </View>
      ),
      profile: (isFocused: boolean) => (
          <View style={isFocused ? styles.activeTabContainer : null}>
              <Ionicons
                  name={isFocused ? "person" : "person-outline"}
                  size={verticalScale(30)}
                  color={isFocused ? colors.white : colors.primary}
              />
          </View>
      ),
  };


  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label: any=
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            // href={buildHref(route.name, route.params)}
            key={route.name}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
          >
            {
                tabBarIcons[route.name] && tabBarIcons[route.name](isFocused)
            }
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  activeTabContainer: {
    backgroundColor: colors.primaryDark,
    borderRadius: 50,
    padding: verticalScale(10),
  },

  tabBar: {
      flexDirection: 'row',
      width: '100%',
      height: Platform.OS == 'ios'? verticalScale(73) : verticalScale(55),
      backgroundColor: colors.inputBackground,
      justifyContent: 'space-around',
      alignItems: 'center',
      borderTopColor: colors.border,
      borderTopWidth: 1,
  },
  tabBarItem: {
      marginBottom: Platform.OS == 'ios'? spacingY._10 : spacingY._5,
      justifyContent: "center",
      alignItems: "center"
  }
})