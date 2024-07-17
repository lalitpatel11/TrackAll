// external imports
import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
//internal imports
import DrawerContent from './DrawerContent';
import BottomNavigator from './BottomNavigator';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const navigation = useNavigation();
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: 'rgba(39, 38, 40, 0.85)',
          width: '100%',
        },
        swipeEnabled: true,
      }}
      // useLegacyImplementation={true}
      drawerContent={() => <DrawerContent navigation={navigation} />}
      initialRouteName="BottomNavigator">
      <Drawer.Screen
        name="BottomNavigator"
        component={BottomNavigator}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
}
