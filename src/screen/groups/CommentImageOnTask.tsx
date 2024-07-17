//external imports
import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
//internal imports
import {colors} from '../../constants/ColorConstant';

const CommentImageOnTask = ({commentImages}: {commentImages: any}) => {
  return (
    <View style={styles.feedbackImageContainer}>
      <Image
        resizeMode="contain"
        style={styles.feedbackImage}
        source={{uri: `${commentImages}`}}
      />
    </View>
  );
};

export default CommentImageOnTask;

const styles = StyleSheet.create({
  feedbackImageContainer: {
    backgroundColor: colors.WHITE,
    height: 180,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 395,
  },
  feedbackImage: {
    borderRadius: 2,
    height: '100%',
    width: '100%',
  },
});
