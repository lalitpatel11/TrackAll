//external imports
import React, {useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {colors} from '../../constants/ColorConstant';

// function for route on intro
const Splash = (props: any) => {
  useEffect(() => {
    setTimeout(() => {
      props.navigation.replace('IntroPage');
    }, 2000);
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logoImage}
          resizeMode="contain"
          source={require('../../assets/pngImage/logo.png')}
        />
      </View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  logoContainer: {
    alignSelf: 'center',
    height: 209,
    marginTop: '50%',
    position: 'absolute',
    width: 219,
  },
  logoImage: {
    backgroundColor: colors.BLACK,
    height: '100%',
    width: '100%',
  },
});
