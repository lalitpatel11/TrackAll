//external imports
import {StyleSheet, View} from 'react-native';
import React from 'react';
import {FloatingAction} from 'react-native-floating-action';
import {colors} from '../../../constants/ColorConstant';

const AddSplitButton = ({navigation}: {navigation: any}) => {
  const actions = [
    {
      text: 'Add Bill Split',
      icon: require('../../../assets/pngImage/addbillsplit.png'),
      name: 'Add Bill Split',
      position: 1,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      tintColor: colors.BLACK,
      textColor: colors.THEME_BLACK,
    },
    {
      text: 'Settle Up Bill',
      icon: require('../../../assets/pngImage/addbillsplit.png'),
      name: 'Settle Up Bill',
      position: 2,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      tintColor: colors.BLACK,
      textColor: colors.THEME_BLACK,
    },
  ];

  // function for add split tab click
  const handleAddSplitClick = () => {
    navigation.navigate('StackNavigation', {screen: 'AddSplit'});
  };

  // function for settle split bill tab click
  const handleSettleSplitBillClick = () => {
    navigation.navigate('StackNavigation', {screen: 'SettleSplitGroup'});
  };

  const handleRoute = (name: any) => {
    if (name === 'Add Bill Split') {
      handleAddSplitClick();
    } else {
      handleSettleSplitBillClick();
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
        buttonSize={60}
      />
    </View>
  );
};

export default AddSplitButton;

const styles = StyleSheet.create({
  createBox: {
    alignItems: 'center',
    borderRadius: 100,
    justifyContent: 'center',
  },
});
