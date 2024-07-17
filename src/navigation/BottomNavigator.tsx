// external imports
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// internal imports
import BusinessEventManagement from '../screen/business/businessEventManagement/BusinessEventManagement';
import BusinessGroup from '../screen/business/businessGroup/BusinessGroup';
import BusinessHome from '../screen/homeScreen/BusinessHome';
import Community from '../screen/community/Community';
import Create from '../screen/createButton/Create';
import Home from '../screen/homeScreen/Home';
import Notes from '../screen/notes/Notes';
import OrganizationEventManagement from '../screen/organization/organizationEventManagement/OrganizationEventManagement';
import OrganizationGroup from '../screen/organization/organizationGroup/OrganizationGroup';
import OrganizationHome from '../screen/homeScreen/OrganizationHome';
import {colors} from '../constants/ColorConstant';
import BusinessScheduleManagement from '../screen/business/businessScheduleManagement/BusinessScheduleManagement';
import OrganizationScheduleManagement from '../screen/organization/organizationScheduleManagement/OrganizationScheduleManagement';
import GoalTracker from '../screen/goalTracker/GoalTracker';
import {useEffect, useState} from 'react';

function BottomTabs({
  descriptors,
  navigation,
  state,
}: {
  descriptors: any;
  navigation: any;
  state: any;
}) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  if (focusedOptions.tabBarVisible === false) {
    return null;
  }
  const [userType, setUserType] = useState('1');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  const getData = async () => {
    // user type for home screen
    const usersType: any = await AsyncStorage.getItem('userType');
    setUserType(usersType);
  };

  return (
    <View style={styles.container}>
      {state.routes.map(
        (route: {key: string | number; name: any}, index: any) => {
          const {options} = descriptors[route.key];
          const label =
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
            <>
              {userType == '1' ? (
                <TouchableOpacity
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? {selected: true} : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={[
                    styles.tabButtonContainer,
                    isFocused ? styles.tabActive : null,
                  ]}>
                  {label === 'Home' ? (
                    <Image
                      style={isFocused ? styles.tabIconFocused : styles.tabIcon}
                      resizeMode="contain"
                      source={require('../assets/pngImage/home.png')}
                    />
                  ) : label === 'Community' ? (
                    <Image
                      style={
                        isFocused ? styles.tabIconsFocused : styles.tabIcons
                      }
                      resizeMode="contain"
                      source={require('../assets/pngImage/community.png')}
                    />
                  ) : label === 'Create' ? (
                    <Create navigation={navigation} />
                  ) : label === 'GoalTracker' ? (
                    <Image
                      style={styles.tabIcons}
                      tintColor={isFocused ? colors.THEME_ORANGE : colors.WHITE}
                      resizeMode="contain"
                      source={require('../assets/pngImage/routines.png')}
                    />
                  ) : (
                    <Image
                      style={
                        isFocused ? styles.tabIconsFocused : styles.tabIcons
                      }
                      resizeMode="contain"
                      source={require('../assets/pngImage/note.png')}
                    />
                  )}
                </TouchableOpacity>
              ) : userType == '2' ? (
                <TouchableOpacity
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? {selected: true} : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={[
                    styles.tabButtonContainer,
                    isFocused ? styles.tabActive : null,
                  ]}>
                  {label === 'BusinessHome' ? (
                    <Image
                      style={isFocused ? styles.tabIconFocused : styles.tabIcon}
                      resizeMode="contain"
                      source={require('../assets/pngImage/home.png')}
                    />
                  ) : label === 'BusinessGroup' ? (
                    <Image
                      style={
                        isFocused ? styles.tabIconsFocused : styles.tabIcons
                      }
                      resizeMode="contain"
                      source={require('../assets/pngImage/community.png')}
                    />
                  ) : label === 'BusinessScheduleManagement' ? (
                    <Image
                      style={isFocused ? styles.tabIconFocused : styles.tabIcon}
                      resizeMode="contain"
                      source={require('../assets/pngImage/shedulemanagment.png')}
                    />
                  ) : label === 'GoalTracker' ? (
                    <Image
                      style={styles.tabIcons}
                      tintColor={isFocused ? colors.THEME_ORANGE : colors.WHITE}
                      resizeMode="contain"
                      source={require('../assets/pngImage/routines.png')}
                    />
                  ) : (
                    <Image
                      style={isFocused ? styles.tabIconFocused : styles.tabIcon}
                      resizeMode="contain"
                      source={require('../assets/pngImage/eventmanagment.png')}
                    />
                  )}
                </TouchableOpacity>
              ) : userType == '3' ? (
                <TouchableOpacity
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? {selected: true} : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={[
                    styles.tabButtonContainer,
                    isFocused ? styles.tabActive : null,
                  ]}>
                  {label === 'OrganizationHome' ? (
                    <Image
                      style={isFocused ? styles.tabIconFocused : styles.tabIcon}
                      resizeMode="contain"
                      source={require('../assets/pngImage/home.png')}
                    />
                  ) : label === 'OrganizationGroup' ? (
                    <Image
                      style={
                        isFocused ? styles.tabIconsFocused : styles.tabIcons
                      }
                      resizeMode="contain"
                      source={require('../assets/pngImage/community.png')}
                    />
                  ) : label === 'OrganizationScheduleManagement' ? (
                    <Image
                      style={isFocused ? styles.tabIconFocused : styles.tabIcon}
                      resizeMode="contain"
                      source={require('../assets/pngImage/shedulemanagment.png')}
                    />
                  ) : label === 'GoalTracker' ? (
                    <Image
                      style={styles.tabIcons}
                      tintColor={isFocused ? colors.THEME_ORANGE : colors.WHITE}
                      resizeMode="contain"
                      source={require('../assets/pngImage/routines.png')}
                    />
                  ) : (
                    <Image
                      style={isFocused ? styles.tabIconFocused : styles.tabIcon}
                      resizeMode="contain"
                      source={require('../assets/pngImage/eventmanagment.png')}
                    />
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? {selected: true} : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={[
                    styles.tabButtonContainer,
                    isFocused ? styles.tabActive : null,
                  ]}>
                  {label === 'Home' ? (
                    <Image
                      style={isFocused ? styles.tabIconFocused : styles.tabIcon}
                      resizeMode="contain"
                      source={require('../assets/pngImage/home.png')}
                    />
                  ) : label === 'Community' ? (
                    <Image
                      style={
                        isFocused ? styles.tabIconsFocused : styles.tabIcons
                      }
                      resizeMode="contain"
                      source={require('../assets/pngImage/community.png')}
                    />
                  ) : label === 'Create' ? (
                    <Create navigation={navigation} />
                  ) : label === 'GoalTracker' ? (
                    <Image
                      style={styles.tabIcons}
                      tintColor={isFocused ? colors.THEME_ORANGE : colors.WHITE}
                      resizeMode="contain"
                      source={require('../assets/pngImage/routines.png')}
                    />
                  ) : (
                    <Image
                      style={
                        isFocused ? styles.tabIconsFocused : styles.tabIcons
                      }
                      resizeMode="contain"
                      source={require('../assets/pngImage/note.png')}
                    />
                  )}
                </TouchableOpacity>
              )}
            </>
          );
        },
      )}
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App({navigation}: {navigation: any}) {
  const [userType, setUserType] = useState('1');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });
    return unsubscribe;
  }, [navigation]);

  const getData = async () => {
    // user type for home screen
    const usersType: any = await AsyncStorage.getItem('userType');
    setUserType(usersType);
  };

  return (
    <Tab.Navigator
      // initialRouteName={'Home'}
      tabBar={(
        props: JSX.IntrinsicAttributes & {
          state: any;
          descriptors: any;
          navigation: any;
        },
      ) => <BottomTabs {...props} />}>
      {userType == '1' ? (
        <Tab.Screen
          options={{headerShown: false}}
          name="Home"
          component={Home}
        />
      ) : userType == '2' ? (
        <Tab.Screen
          options={{headerShown: false}}
          name="BusinessHome"
          component={BusinessHome}
        />
      ) : userType == '3' ? (
        <Tab.Screen
          options={{headerShown: false}}
          name="OrganizationHome"
          component={OrganizationHome}
        />
      ) : (
        <Tab.Screen
          options={{headerShown: false}}
          name="Home"
          component={Home}
        />
      )}

      {userType == '1' ? (
        <Tab.Screen
          options={{headerShown: false}}
          name="Community"
          component={Community}
        />
      ) : userType == '2' ? (
        <Tab.Screen
          options={{headerShown: false}}
          name="BusinessGroup"
          component={BusinessGroup}
        />
      ) : userType == '3' ? (
        <Tab.Screen
          options={{headerShown: false}}
          name="OrganizationGroup"
          component={OrganizationGroup}
        />
      ) : (
        <Tab.Screen
          options={{headerShown: false}}
          name="Community"
          component={Community}
        />
      )}

      {userType == '1' ? (
        <Tab.Screen
          options={{headerShown: false}}
          name="Create"
          component={Create}
        />
      ) : userType == '2' ? (
        <Tab.Screen
          options={{headerShown: false}}
          name="BusinessScheduleManagement"
          component={BusinessScheduleManagement}
        />
      ) : userType == '3' ? (
        <Tab.Screen
          options={{headerShown: false}}
          name="OrganizationScheduleManagement"
          component={OrganizationScheduleManagement}
        />
      ) : (
        <Tab.Screen
          options={{headerShown: false}}
          name="Create"
          component={Create}
        />
      )}

      {userType == '1' ? (
        <Tab.Screen
          options={{headerShown: false}}
          name="GoalTracker"
          component={GoalTracker}
        />
      ) : userType == '2' ? (
        <Tab.Screen
          options={{headerShown: false}}
          name="GoalTracker"
          component={GoalTracker}
        />
      ) : userType == '3' ? (
        <Tab.Screen
          options={{headerShown: false}}
          name="GoalTracker"
          component={GoalTracker}
        />
      ) : (
        <Tab.Screen
          options={{headerShown: false}}
          name="GoalTracker"
          component={GoalTracker}
        />
      )}

      {userType == '1' ? (
        <Tab.Screen
          options={{headerShown: false}}
          name="Notes"
          component={Notes}
        />
      ) : userType == '2' ? (
        <Tab.Screen
          options={{headerShown: false}}
          name="BusinessEventManagement"
          component={BusinessEventManagement}
        />
      ) : userType == '3' ? (
        <Tab.Screen
          options={{headerShown: false}}
          name="OrganizationEventManagement"
          component={OrganizationEventManagement}
        />
      ) : (
        <Tab.Screen
          options={{headerShown: false}}
          name="Notes"
          component={Notes}
        />
      )}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabButtonContainer: {
    alignItems: 'center',
    flex: 1,
    height: 50,
    justifyContent: 'center',
  },
  tabIcon: {
    height: 25,
    width: 25,
    tintColor: colors.WHITE,
  },
  tabIconFocused: {
    height: 25,
    width: 25,
    tintColor: colors.THEME_ORANGE,
  },
  tabIcons: {
    height: 20,
    width: 20,
    tintColor: colors.WHITE,
  },
  tabIconsFocused: {
    height: 20,
    width: 20,
    tintColor: colors.THEME_ORANGE,
  },
  container: {
    backgroundColor: colors.BLACK2,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 12,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8.0,
    elevation: 24,
  },
  tabActive: {
    borderBottomWidth: 3,
    borderBottomColor: colors.THEME_ORANGE,
  },
});
