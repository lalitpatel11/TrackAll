//external imports
import {View, StyleSheet, Image} from 'react-native';
import React from 'react';

const CommentImagesTab = ({commentImages}: {commentImages: any}) => {
  return (
    <View style={styles.feedbackImageContainer}>
      <Image
        style={styles.image}
        resizeMode="contain"
        source={{
          uri: `${
            commentImages?.uri ? commentImages?.uri : commentImages?.images
          }`,
        }}
      />
    </View>
  );
};

export default CommentImagesTab;

const styles = StyleSheet.create({
  feedbackImageContainer: {
    borderRadius: 8,
    height: 61,
    marginHorizontal: 3,
    width: 66,
  },
  image: {
    borderRadius: 8,
    height: '100%',
    width: '100%',
  },
});
