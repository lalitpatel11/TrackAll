//external imports
import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

const BusinessPostBannerImage = ({postImage}: {postImage: any}) => {
  return (
    <View style={styles.bannerImageContainer}>
      <Image
        resizeMode="contain"
        style={styles.image}
        source={{uri: `${postImage?.image}`}}
      />
    </View>
  );
};

export default BusinessPostBannerImage;

const styles = StyleSheet.create({
  bannerImageContainer: {height: 190, width: 350},
  image: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
  },
});
