// external imports
import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
// internal imports
import {colors} from '../../constants/ColorConstant';

const BusinessHomeTab = ({items}: {items: any}) => {
  return (
    <View style={styles.container}>
      {/* this month and amount section  */}
      <View style={styles.imageContainer}>
        <Image
          resizeMode="contain"
          style={styles.image}
          source={require('../../assets/pngImage/dollar.png')}
        />
      </View>

      {/* count section */}
      <View style={styles.countContainer}>
        <Image
          resizeMode="contain"
          style={{height: 20, width: 20, marginRight: 10}}
          source={require('../../assets/pngImage/avatar.png')}
        />
        <Text style={styles.countText}>{items?.count}</Text>
      </View>

      {/* title and sub title section */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{items?.title}</Text>
        <Text style={styles.subTitleText}>{items?.subTitle}</Text>
      </View>
    </View>
  );
};

export default BusinessHomeTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    justifyContent: 'center',
    marginRight: 10,
    paddingLeft: 10,
    padding: 20,
  },
  imageContainer: {
    borderRadius: 50,
    height: 80,
    marginBottom: 5,
    width: 80,
    marginLeft: 20,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginVertical: 5,
  },
  titleContainer: {
    marginLeft: 10,
    marginVertical: 5,
  },
  countText: {
    color: colors.THEME_ORANGE,
    fontSize: 16,
    fontWeight: '700',
  },
  titleText: {
    color: colors.THEME_BLACK,
    fontSize: 20,
    fontWeight: '500',
  },
  subTitleText: {
    color: colors.THEME_BLACK,
    fontSize: 14,
    fontWeight: '400',
  },
});
