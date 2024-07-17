//external imports
import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
//internal imports
import {colors} from '../../constants/ColorConstant';

const IntroScreenTab = ({item}: {item: any}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}/>
      <View style={styles.bannerImageContainer}>
        <Image
          resizeMode="contain"
          style={styles.bannerImage}
          source={item.image}
        />
      </View>
      {item.id !== 3 ? (
        <View style={styles.textContainer}>
          <Text style={styles.textLineOne}>{item.textLineOne}</Text>
          <Text style={styles.textLineTwo}>{item.textLineTwo}</Text>
        </View>
      ) : (
        <View style={styles.textContainer}>
          <Text style={styles.textLineOne}>
            Set reminders recurrences {'\n'}for
            <Text style={styles.textLineTwo}> TrackAll </Text>Schedule
            {'\n'}Sharing
          </Text>
        </View>
      )}
    </View>
  );
};

export default IntroScreenTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
  },
  imageContainer: {
    height: 500,
    width: 400,
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
  },
  bannerImageContainer: {
    alignSelf: 'center',
    height: '60%',
    justifyContent: 'center',
    position: 'absolute',
    width: '70%',
  },
  bannerImage: {
    height: 250,
    width: 250,
  },
  textContainer: {
    marginTop: 20,
    paddingHorizontal: 30,
  },
  textLineOne: {
    color: colors.WHITE,
    fontSize: 24,
  },
  textLineTwo: {
    color: colors.THEME_ORANGE,
    fontSize: 24,
    fontWeight: 'bold',
  },
});
