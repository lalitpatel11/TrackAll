//external imports
import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

const NotesImagesTab = ({notesImages}: {notesImages: any}) => {
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

export default NotesImagesTab;

const styles = StyleSheet.create({
  feedbackImageContainer: {
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
