//external imports
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import React from 'react';
//internal imports
import {colors} from '../../constants/ColorConstant';

const GroupTab = ({items, tabPress}: {items: any; tabPress: Function}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        tabPress(items?.title);
      }}>
      {/* image section */}
      <View style={styles.imageContainer}>
        {items?.title == 'My Groups' ? (
          <Image
            style={styles.image}
            resizeMode="contain"
            source={require('../../assets/pngImage/expensesIcon.png')}
          />
        ) : items?.title == 'Shared Groups' ? (
          <Image
            style={styles.image}
            resizeMode="contain"
            source={require('../../assets/pngImage/expensesIcon.png')}
          />
        ) : items?.title == 'My Routines' ? (
          <Image
            style={styles.image}
            resizeMode="contain"
            source={require('../../assets/pngImage/routineIcon.png')}
          />
        ) : items?.title == 'Shared Routines' ? (
          <Image
            style={styles.image}
            resizeMode="contain"
            source={require('../../assets/pngImage/sharedRoutineIcon.png')}
          />
        ) : null}
      </View>

      {/* count and title section */}
      <View style={styles.countTitleContainer}>
        <Text style={styles.countText}>{items?.groupcount}</Text>
        <Text style={styles.titleText}>{items?.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default GroupTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK2,
    borderRadius: 30,
    flex: 1,
    flexDirection: 'row',
    height: 104,
    marginHorizontal: 8,
    marginVertical: 5,
    padding: 15,
    width: '105%',
  },
  imageContainer: {
    height: 45,
    marginTop: 6,
    width: 42,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  countTitleContainer: {marginLeft: 10},
  countText: {
    color: colors.THEME_ORANGE,
    fontSize: 35,
    fontWeight: '700',
  },
  titleText: {
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '400',
  },
});
