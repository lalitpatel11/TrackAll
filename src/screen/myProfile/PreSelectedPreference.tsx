//external imports
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
//internal imports
import {colors} from '../../constants/ColorConstant';

const PreSelectedPreference = ({interests}: {interests: any}) => {
  return (
    <View style={styles.interestsContainer}>
      <View style={styles.interestsTabBorder}>
        <Image
          style={styles.checkedIcon}
          resizeMode="contain"
          source={require('../../assets/pngImage/checked.png')}
        />

        <Image
          style={styles.image}
          resizeMode="contain"
          source={{uri: `${interests?.icon}`}}
        />
        <Text style={styles.interestsLabel}>{interests?.name}</Text>
      </View>
    </View>
  );
};

export default PreSelectedPreference;

const styles = StyleSheet.create({
  interestsContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 20,
    flexDirection: 'row',
    height: 100,
    justifyContent: 'space-between',
    margin: 5,
  },
  interestsTabBorder: {
    alignItems: 'center',
    borderColor: colors.THEME_ORANGE,
    borderRadius: 20,
    borderWidth: 2,
    height: 100,
    justifyContent: 'center',
    width: 110,
  },
  interestsLabel: {
    color: colors.BLACK,
  },
  checkedIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 1,
  },
  image: {height: 40, width: 40},
});
