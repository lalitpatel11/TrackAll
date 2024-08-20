// external imports
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
// internal imports
import {colors} from './ColorConstant';

const Header = ({
  headerText,
  backClick,
}: {
  headerText: string;
  backClick: Function;
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backArrow}
        onPress={() => {
          backClick();
        }}>
        <Image
          resizeMode="contain"
          tintColor={colors.WHITE}
          style={styles.icon}
          source={require('../assets/pngImage/backArrow.png')}
        />
      </TouchableOpacity>
      {/* text part  */}
      <Text style={styles.headerText}>{headerText}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 20,
  },
  backArrow: {
    alignSelf: 'center',
  },
  icon: {
    height: 15,
    width: 15,
  },
  headerText: {
    color: colors.WHITE,
    fontSize: 16,
    marginLeft: 90,
  },
});
