// external imports
import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
// internal imports
import {colors} from '../../constants/ColorConstant';

const FollowersTab = ({items}: {items: any}) => {
  return (
    <View style={styles.container}>
      <View style={styles.direction}>
        {/* image section */}
        {items?.profile_image ? (
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={{uri: `${items?.profile_image}`}}
            />
          </View>
        ) : (
          <View style={styles.noGroupImageContainer}>
            <View style={styles.noGroupImage}>
              <Image
                resizeMode="contain"
                style={styles.image}
                source={require('../../assets/pngImage/avatar.png')}
              />
            </View>
          </View>
        )}

        <View style={styles.amountContainer}>
          <Text style={styles.userName}>{items?.name}</Text>
          <Text style={styles.followerText}>{items?.email}</Text>
        </View>
      </View>
    </View>
  );
};

export default FollowersTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    flex: 1,
    marginVertical: 5,
    padding: 10,
  },
  direction: {
    flexDirection: 'row',
  },
  imageContainer: {
    borderColor: colors.brightGray,
    borderRadius: 50,
    borderWidth: 2,
    height: 40,
    width: 40,
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  noGroupImageContainer: {
    alignItems: 'center',
    backgroundColor: colors.GRAY,
    borderColor: colors.WHITE,
    borderRadius: 50,
    borderWidth: 2,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  noGroupImage: {
    borderRadius: 50,
    height: 40,
    width: 35,
  },
  amountContainer: {paddingHorizontal: 10},
  userName: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  followerText: {
    color: colors.THEME_ORANGE,
    fontSize: 14,
    paddingVertical: 5,
  },
});
