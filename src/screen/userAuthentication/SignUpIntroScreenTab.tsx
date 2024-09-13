//external imports
import React from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
//internal imports
import {colors} from '../../constants/ColorConstant';

const SignUpIntroScreenTab = ({item}: {item: any}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.darkBackgroundImage}
          resizeMode='stretch'
          source={item.darkBackgroundImage}
        />
        <Image
          style={styles.orangeBackgroundImage}
          resizeMode="stretch"
          source={item.orangeBackgroundImage}
        />
        <Image
          style={styles.halfBackgroundImage}
          resizeMode="stretch"
          source={item.halfBackgroundImage}
        />
        <Image
          style={styles.backgroundImage}
          resizeMode="stretch"
          source={item.backGroundImage}
        />

        {/* heading section */}
        <View style={styles.textContainer}>
          <Text style={styles.textLineOne}>{item.textLineOne}</Text>
          <Text style={styles.textLineTwo}>{item.textLineTwo}</Text>
          <Text style={styles.textLineThree}>{item.textLineThird}</Text>
        </View>
      </View>
    </View>
  );
};

export default SignUpIntroScreenTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('screen').width,
  },
  imageContainer: {
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width,
  },
  darkBackgroundImage: {
    height: '100%',
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  orangeBackgroundImage: {
    height: '100%',
    position: 'absolute',
    width: '100%',
    zIndex: 2,
  },
  halfBackgroundImage: {
    height: '100%',
    position: 'absolute',
    right: -85,
    width: '100%',
    zIndex: 3,
  },
  backgroundImage: {
    height: '100%',
    position: 'absolute',
    width: '100%',
    zIndex: 0,
  },
  textContainer: {
    marginTop: '70%',
    paddingHorizontal: 30,
    position: 'absolute',
    zIndex: 5,
  },
  textLineOne: {
    color: colors.WHITE,
    fontSize: 28,
    fontWeight: '500',
  },
  textLineTwo: {
    color: colors.THEME_ORANGE,
    fontSize: 28,
    fontWeight: '500',
    paddingVertical: 5,
  },
  textLineThree: {
    color: colors.WHITE,
    fontSize: 16,
    marginTop: 10,
    width: 330,
  },
});
