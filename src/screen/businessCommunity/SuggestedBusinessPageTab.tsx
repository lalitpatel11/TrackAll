// external imports
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
// internal imports
import {colors} from '../../constants/ColorConstant';

const SuggestedBusinessPageTab = ({
  handleView,
  items,
}: {
  handleView: any;
  items: any;
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        handleView(items?.id);
      }}>
      {/* post count */}
      {items?.postCount > 0 ? (
        <Text style={styles.notificationText}>{items?.postCount}</Text>
      ) : null}

      {/* image section */}
      {items?.businessimage ? (
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{uri: `${items?.businessimage}`}}
          />
        </View>
      ) : (
        <View style={styles.noGroupImageContainer}>
          <View style={styles.noGroupImage}>
            <Image
              resizeMode="contain"
              style={styles.image}
              source={require('../../assets/pngImage/noImage.png')}
            />
          </View>
        </View>
      )}

      <View style={styles.amountContainer}>
        <Text style={styles.pageName}>{items?.name}</Text>
        <Text style={styles.followerText}>{items?.totalfollow} Followers</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SuggestedBusinessPageTab;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    flex: 1,
    height: 'auto',
    margin: 5,
    padding: 8,
    width: 170,
  },
  imageContainer: {
    borderRadius: 50,
    height: 55,
    width: 55,
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
    height: 55,
    justifyContent: 'center',
    width: 55,
  },
  noGroupImage: {
    height: 40,
    width: 35,
  },
  amountContainer: {
    paddingVertical: 5,
  },
  pageName: {
    color: colors.WHITE,
    fontSize: 16,
    textAlign: 'center',
  },
  followerText: {
    color: colors.THEME_ORANGE,
    fontSize: 13,
    paddingTop: 3,
    textAlign: 'center',
  },
  notificationText: {
    backgroundColor: colors.RED,
    borderRadius: 50,
    color: colors.WHITE,
    fontSize: 12,
    fontWeight: '500',
    height: 25,
    justifyContent: 'center',
    padding: 3,
    position: 'absolute',
    right: -5,
    textAlign: 'center',
    top: 0,
    width: 25,
    zIndex: 1,
  },
});
