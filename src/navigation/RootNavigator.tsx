// external imports
import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
//internal imports
import DrawerNavigator from './DrawerNavigator';
import StackNavigation from './StackNavigation';

const Root = createNativeStackNavigator();

const RootStackNavigator = () => {
  return (
    <Root.Navigator initialRouteName="Auth">
      {/* for stack navigation  */}
      <Root.Screen
        name="StackNavigation"
        options={{headerShown: false}}
        component={StackNavigation}
      />

      {/* for drawer navigation */}
      <Root.Screen
        name="DrawerNavigator"
        options={{headerShown: false}}
        component={DrawerNavigator}
      />
    </Root.Navigator>
  );
};

export default RootStackNavigator;
