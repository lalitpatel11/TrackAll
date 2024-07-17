// external imports
import React from 'react';
import {StyleSheet, Image, TouchableOpacity} from 'react-native';

const EventImages = ({
  eventImages,
  imageClick,
}: {
  eventImages: any;
  imageClick: Function;
}) => {
  return (
    <TouchableOpacity
      style={styles.feedbackImageContainer}
      onPress={() => {
        imageClick();
      }}>
      <Image
        style={styles.image}
        resizeMode="contain"
        source={{
          uri: `${eventImages?.images}`,
        }}
      />
    </TouchableOpacity>
  );
};

export default EventImages;

const styles = StyleSheet.create({
  feedbackImageContainer: {
    borderRadius: 12,
    height: 80,
    margin: 3,
    width: 120,
  },
  image: {
    borderRadius: 12,
    height: '100%',
    width: '100%',
  },
});
