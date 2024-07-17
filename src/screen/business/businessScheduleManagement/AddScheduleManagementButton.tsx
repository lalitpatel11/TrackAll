import {StyleSheet, View} from 'react-native';
import React from 'react';
import {FloatingAction} from 'react-native-floating-action';
import {colors} from '../../../constants/ColorConstant';

const AddScheduleManagementButton = ({navigation}: {navigation: any}) => {
  const action = [
    {
      text: 'Add Appointment',
      icon: require('../../../assets/pngImage/addbillsplit.png'),
      name: 'Add Appointment',
      position: 1,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      tintColor: colors.BLACK,
      textColor: colors.THEME_BLACK,
    },
    {
      text: 'Add Service',
      icon: require('../../../assets/pngImage/addbillsplit.png'),
      name: 'Add Service',
      position: 2,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      tintColor: colors.BLACK,
      textColor: colors.THEME_BLACK,
    },
    {
      text: 'Manage Availability',
      icon: require('../../../assets/pngImage/addbillsplit.png'),
      name: 'Manage Availability',
      position: 3,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      tintColor: colors.BLACK,
      textColor: colors.THEME_BLACK,
    },
  ];

  // function for Create Appointment click
  const handleAddBusinessAppointmentClick = () => {
    navigation.navigate('StackNavigation', {
      screen: 'AddNewBusinessAppointment',
      //   params: {id: businessId},
    });
  };

  // function for add service click
  const handleAddServiceClick = () => {
    navigation.navigate('StackNavigation', {
      screen: 'CreateService',
      //   params: {id: businessId},
    });
  };

  // function for manage availability service click
  const handleManageAvailabilityClick = () => {
    navigation.navigate('StackNavigation', {
      screen: 'ManageAvailability',
      //   params: {id: businessId},
    });
  };

  const handleRoute = (name: any) => {
    if (name === 'Add Appointment') {
      handleAddBusinessAppointmentClick();
    } else if (name === 'Add Service') {
      handleAddServiceClick();
    } else {
      handleManageAvailabilityClick();
    }
  };

  return (
    <View style={styles.createBox}>
      <FloatingAction
        color="#F28520"
        actions={action}
        onPressItem={name => {
          handleRoute(name);
        }}
      />
    </View>
  );
};

export default AddScheduleManagementButton;

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
