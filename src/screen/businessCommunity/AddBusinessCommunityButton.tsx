import {StyleSheet, View} from 'react-native';
import React from 'react';
import {FloatingAction} from 'react-native-floating-action';
import {colors} from '../../constants/ColorConstant';

const AddBusinessCommunityButton = ({navigation}: {navigation: any}) => {
  const actions = [
    {
      text: 'Create Business',
      icon: require('../../assets/pngImage/addbillsplit.png'),
      name: 'Create Business',
      position: 1,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      textColor: colors.THEME_BLACK,
      tintColor: colors.BLACK,
    },
    {
      text: 'Create Community',
      icon: require('../../assets/pngImage/addbillsplit.png'),
      name: 'Create Community',
      position: 2,
      color: colors.lightYellow,
      textBackground: colors.lightYellow,
      textColor: colors.THEME_BLACK,
      tintColor: colors.BLACK,
    },
  ];

  // function for create business click
  const handleCreateBusinessClick = () => {
    navigation.navigate('StackNavigation', {
      screen: 'CreateBusiness',
    });
  };
  // function for create community click
  const handleCreateCommunityClick = () => {
    navigation.navigate('StackNavigation', {
      screen: 'CreateCommunity',
    });
  };

  const handleRoute = (name: any) => {
    if (name === 'Create Business') {
      handleCreateBusinessClick();
    } else {
      handleCreateCommunityClick();
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

export default AddBusinessCommunityButton;

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
