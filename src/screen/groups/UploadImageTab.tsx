//external imports
import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
//internal imports
import {colors} from '../../constants/ColorConstant';

const UploadImageTab = ({commentImages}: {commentImages: any}) => {
  return (
    <View style={styles.feedbackImageContainer}>
      <Image
        style={styles.image}
        resizeMode="contain"
        source={{
          uri: `${commentImages?.uri}`,
        }}
      />
    </View>
  );
};

export default UploadImageTab;

const styles = StyleSheet.create({
  feedbackImageContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    height: 50,
    marginHorizontal: 2,
    width: 60,
  },
  image: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
  },
});
