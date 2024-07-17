import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FloatingAction} from 'react-native-floating-action';
import {colors} from '../../constants/ColorConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddPostRoutineButton = ({
  businessId,
  navigation,
}: {
  businessId: any;
  navigation: any;
}) => {
  const [userType, setUserType] = useState<any>('1');

  useEffect(() => {
    getUserType();
  }, []);

  const getUserType = async () => {
    const userType = await AsyncStorage.getItem('userType');
    setUserType(userType);
  };

  const actions = [
    {
      text: 'Add Post',
      icon: require('../../assets/pngImage/addbillsplit.png'),
      name: 'Add Post',
      position: 1,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      tintColor: colors.BLACK,
      textColor: colors.THEME_BLACK,
    },
    {
      text: 'Add Routine',
      icon: require('../../assets/pngImage/addbillsplit.png'),
      name: 'Add Routine',
      position: 2,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      tintColor: colors.BLACK,
      textColor: colors.THEME_BLACK,
    },
    {
      text: 'Add Service',
      icon: require('../../assets/pngImage/addbillsplit.png'),
      name: 'Add Service',
      position: 3,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      tintColor: colors.BLACK,
      textColor: colors.THEME_BLACK,
    },
    {
      text: 'Manage Availability',
      icon: require('../../assets/pngImage/addbillsplit.png'),
      name: 'Manage Availability',
      position: 4,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      tintColor: colors.BLACK,
      textColor: colors.THEME_BLACK,
    },
  ];

  const action = [
    {
      text: 'Add Post',
      icon: require('../../assets/pngImage/addbillsplit.png'),
      name: 'Add Post',
      position: 1,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      tintColor: colors.BLACK,
      textColor: colors.THEME_BLACK,
    },
    {
      text: 'Add Routine',
      icon: require('../../assets/pngImage/addbillsplit.png'),
      name: 'Add Routine',
      position: 2,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      tintColor: colors.BLACK,
      textColor: colors.THEME_BLACK,
    },
  ];

  // function for add post click
  const handleAddPostClick = () => {
    navigation.navigate('StackNavigation', {
      screen: 'CreateBusinessPost',
      params: {id: businessId},
    });
  };

  // function for add routine click
  const handleAddRoutineClick = () => {
    navigation.navigate('StackNavigation', {
      screen: 'CreateRoutine',
      params: {id: businessId},
    });
  };

  // function for add service click
  const handleAddServiceClick = () => {
    navigation.navigate('StackNavigation', {
      screen: 'CreateService',
      params: {id: businessId},
    });
  };

  // function for manage availability service click
  const handleManageAvailabilityClick = () => {
    navigation.navigate('StackNavigation', {
      screen: 'ManageAvailability',
      params: {id: businessId},
    });
  };

  const handleRoute = (name: any) => {
    if (name == 'Add Post') {
      handleAddPostClick();
    } else if (name == 'Add Routine') {
      handleAddRoutineClick();
    } else if (name == 'Add Service') {
      handleAddServiceClick();
    } else {
      handleManageAvailabilityClick();
    }
  };

  return (
    <View style={styles.createBox}>
      <FloatingAction
        color="#F28520"
        actions={userType == '2' ? actions : action}
        onPressItem={name => {
          handleRoute(name);
        }}
      />
    </View>
  );
};

export default AddPostRoutineButton;

const styles = StyleSheet.create({
  createBox: {
    alignItems: 'center',
    borderRadius: 100,
    justifyContent: 'center',
    position: 'absolute',
    right: -35,
    top: 20,
    zIndex: 1,
  },
});
