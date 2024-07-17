//external imports
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
//internal imports
import {colors} from '../../../constants/ColorConstant';

const SplitBillUsers = ({items}: {items: any}) => {
  return (
    <View style={styles.container}>
      <View style={styles.dotContainer} />
      <Text style={styles.text}>{items?.message}</Text>
    </View>
  );
};

export default SplitBillUsers;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginVertical: 5,
  },
  dotContainer: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 10,
    width: 10,
  },
  text: {
    color: colors.THEME_ORANGE,
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 10,
  },
});
