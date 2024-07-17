//external imports
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
//internal imports
import {colors} from '../../constants/ColorConstant';

const BusinessPageTab = ({
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

      <View style={styles.direction}>
        {/* image section */}
        {items?.businessimage ? (
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={{uri: `${items?.businessimage}`}}
            />
          </View>
        ) : items?.communityimage ? (
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={{uri: `${items?.communityimage}`}}
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
          <Text style={styles.followerText}>
            {items?.totalfollow} Followers
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BusinessPageTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK3,
    borderRadius: 15,
    flex: 1,
    height: 'auto',
    marginVertical: 5,
    padding: 10,
  },
  direction: {
    flexDirection: 'row',
  },
  imageContainer: {
    borderRadius: 50,
    height: 60,
    width: 60,
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
    height: 40,
    width: 35,
  },
  amountContainer: {
    paddingHorizontal: 10,
    width: '85%',
  },
  pageName: {
    color: colors.WHITE,
    fontSize: 16,
  },
  followerText: {
    color: colors.THEME_ORANGE,
    fontSize: 13,
    paddingVertical: 5,
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
    right: 5,
    textAlign: 'center',
    top: 0,
    width: 25,
    zIndex: 1,
  },
});
