// external imports
import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

const ExpansesImage = ({expenseImage}: {expenseImage: any}) => {
  return (
    <View style={styles.feedbackImageContainer}>
      <Image
        resizeMode="contain"
        style={styles.feedbackImage}
        source={{
          uri: `${expenseImage?.uri ? expenseImage?.uri : expenseImage?.image}`,
        }}
      />
    </View>
  );
};

export default ExpansesImage;

const styles = StyleSheet.create({
  feedbackImageContainer: {
    borderRadius: 15,
    height: 100,
    margin: 3,
    width: 110,
  },
  feedbackImage: {
    borderRadius: 15,
    height: '100%',
    width: '100%',
  },
});
