//external imports
import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

const NotesImages = ({notesImages}: {notesImages: any}) => {
  return (
    <View style={styles.feedbackImageContainer}>
      <Image
        style={styles.image}
        resizeMode="contain"
        source={{
          uri: `${notesImages?.images}`,
        }}
      />
    </View>
  );
};

export default NotesImages;

const styles = StyleSheet.create({
  feedbackImageContainer: {
    borderRadius: 15,
    height: 80,
    marginHorizontal: 3,
    width: 120,
  },
  image: {
    width: '100%',
    borderRadius: 15,
    height: '100%',
  },
});
