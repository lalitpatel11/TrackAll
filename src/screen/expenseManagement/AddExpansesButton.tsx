//external imports
import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FloatingAction} from 'react-native-floating-action';
import {colors} from '../../constants/ColorConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddExpansesButton = ({navigation}: {navigation: any}) => {
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
      text: 'Add Expense',
      icon: require('../../assets/pngImage/addbillsplit.png'),
      name: 'Add Expense',
      position: 1,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      textColor: colors.THEME_BLACK,
      tintColor: colors.BLACK,
    },
    {
      text: 'Add Budget',
      icon: require('../../assets/pngImage/addbillsplit.png'),
      name: 'Add Budget',
      position: 2,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      textColor: colors.THEME_BLACK,
      tintColor: colors.BLACK,
    },
    {
      text: 'Added Budget',
      icon: require('../../assets/pngImage/addbillsplit.png'),
      name: 'Added Budget',
      position: 3,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      textColor: colors.THEME_BLACK,
      tintColor: colors.BLACK,
    },
    {
      text: 'Split Easy',
      icon: require('../../assets/pngImage/addbillsplit.png'),
      name: 'Split Easy',
      position: 4,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      textColor: colors.THEME_BLACK,
      tintColor: colors.BLACK,
    },
  ];

  const action = [
    {
      text: 'Add Expense',
      icon: require('../../assets/pngImage/addbillsplit.png'),
      name: 'Add Expense',
      position: 1,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      textColor: colors.THEME_BLACK,
      tintColor: colors.BLACK,
    },
    {
      text: 'Add Budget',
      icon: require('../../assets/pngImage/addbillsplit.png'),
      name: 'Add Budget',
      position: 2,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      textColor: colors.THEME_BLACK,
      tintColor: colors.BLACK,
    },
    {
      text: 'Added Budget',
      icon: require('../../assets/pngImage/addbillsplit.png'),
      name: 'Added Budget',
      position: 3,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      textColor: colors.THEME_BLACK,
      tintColor: colors.BLACK,
    },
  ];

  // function on added budget click
  const handleAddBudgetaryClick = () => {
    navigation.navigate('StackNavigation', {screen: 'AddBudgetary'});
  };

  // function on add expense click
  const handleAddExpenseClick = () => {
    navigation.navigate('StackNavigation', {screen: 'AddExpense'});
  };

  // function on add expense click
  const handleAddedBudgetaryClick = () => {
    navigation.navigate('StackNavigation', {screen: 'AddedBudgetary'});
  };

  // function on split click
  const handleSplitClick = () => {
    navigation.navigate('StackNavigation', {screen: 'AddedSplit'});
  };

  const handleRoute = (name: any) => {
    if (name == 'Add Expense') {
      handleAddExpenseClick();
    } else if (name == 'Add Budget') {
      handleAddBudgetaryClick();
    } else if (name == 'Added Budget') {
      handleAddedBudgetaryClick();
    } else {
      handleSplitClick();
    }
  };

  return (
    <View style={styles.createBox}>
      <FloatingAction
        color="#F28520"
        actions={userType == '1' ? actions : action}
        onPressItem={name => {
          handleRoute(name);
        }}
        buttonSize={60}
      />
    </View>
  );
};

export default AddExpansesButton;

const styles = StyleSheet.create({
  createBox: {
    alignItems: 'center',
    borderRadius: 100,
    justifyContent: 'center',
  },
});
