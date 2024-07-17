import {StyleSheet, View} from 'react-native';
import React from 'react';
import {FloatingAction} from 'react-native-floating-action';
import {colors} from '../../constants/ColorConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddTaskNotesRoutineButton = ({
  navigation,
  groupId,
}: {
  navigation: any;
  groupId: any;
}) => {
  const actions = [
    {
      text: 'Add Task',
      icon: require('../../assets/pngImage/addbillsplit.png'),
      name: 'Add Task',
      position: 1,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      textColor: colors.THEME_BLACK,
      tintColor: colors.BLACK,
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
      text: 'Add Notes',
      icon: require('../../assets/pngImage/addbillsplit.png'),
      name: 'Add Notes',
      position: 3,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      tintColor: colors.BLACK,
      textColor: colors.THEME_BLACK,
    },
    {
      text: 'Add Appointment',
      icon: require('../../assets/pngImage/addbillsplit.png'),
      name: 'Add Appointment',
      position: 4,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      tintColor: colors.BLACK,
      textColor: colors.THEME_BLACK,
    },
  ];

  // function on add task click
  const handleAddTaskClick = () => {
    navigation.navigate('StackNavigation', {
      screen: 'CreateTask',
      params: {
        data: groupId,
      },
    });
  };

  // function on add routine click
  const handleAddRoutineClick = () => {
    navigation.navigate('StackNavigation', {
      screen: 'CreateRoutine',
      params: {
        data: groupId,
      },
    });
  };

  // function on add notes click
  const handleAddNotesClick = () => {
    navigation.navigate('StackNavigation', {
      screen: 'CreateNotes',
      params: {
        data: groupId,
      },
    });
  };

  // function on add appointment click
  const handleAddAppointmentClick = async () => {
    const userType = await AsyncStorage.getItem('userType');
    if (userType == '2') {
      navigation.navigate('StackNavigation', {
        screen: 'AddNewBusinessAppointment',
        params: {
          data: groupId,
        },
      });
    } else {
      navigation.navigate('StackNavigation', {
        screen: 'AddNewOrganizationAppointment',
        params: {
          data: groupId,
        },
      });
    }
  };

  const handleRoute = (name: any) => {
    if (name === 'Add Task') {
      handleAddTaskClick();
    } else if (name === 'Add Routine') {
      handleAddRoutineClick();
    } else if (name === 'Add Notes') {
      handleAddNotesClick();
    } else {
      handleAddAppointmentClick();
    }
  };

  return (
    <View style={styles.createBox}>
      <FloatingAction
        color="#F28520"
        actions={actions}
        onPressItem={name => {
          handleRoute(name);
        }}
      />
    </View>
  );
};

export default AddTaskNotesRoutineButton;

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
