// external imports
import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

const UploadedEventImageTab = ({eventImage}: {eventImage: any}) => {
  return (
    <View style={styles.feedbackImageContainer}>
      <Image
        style={styles.image}
        resizeMode="contain"
        source={{
          uri: `${eventImage?.uri ? eventImage?.uri : eventImage?.images}`,
        }}
      />
    </View>
  );
};

export default UploadedEventImageTab;

const styles = StyleSheet.create({
  feedbackImageContainer: {
    borderRadius: 15,
    height: 50,
    margin: 5,
    width: 70,
  },
  image: {
    borderRadius: 15,
    height: '100%',
    width: '100%',
  },
});
