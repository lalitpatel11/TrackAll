// external imports
import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
// internal imports
import {colors} from '../../constants/ColorConstant';

const ExpanseImageOnEdit = ({
  checkedList,
  commentImages,
  removeImage,
}: {
  checkedList: number[];
  commentImages: any;
  removeImage: Function;
}) => {
  return (
    <>
      {checkedList.includes(commentImages?.imageid) ? (
        <View style={styles.feedbackImageContainer}>
          {/* cross button section  */}
          <TouchableOpacity
            style={styles.crossContainer}
            onPress={() => {
              removeImage(commentImages?.imageid);
            }}>
            <Image
              style={styles.image}
              resizeMode="contain"
              source={require('../../assets/pngImage/cross.png')}
            />
          </TouchableOpacity>

          <Image
            style={styles.image}
            resizeMode="contain"
            source={{uri: `${commentImages?.image}`}}
          />
        </View>
      ) : null}
    </>
  );
};

export default ExpanseImageOnEdit;

const styles = StyleSheet.create({
  feedbackImageContainer: {
    backgroundColor: colors.WHITE,
    borderColor: colors.THEME_ORANGE,
    borderRadius: 15,
    borderWidth: 2,
    height: 100,
    marginHorizontal: 3,
    width: 105,
  },
  image: {
    borderRadius: 15,
    height: '100%',
    width: '100%',
  },
  crossContainer: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 20,
    position: 'absolute',
    right: 0,
    top: 0,
    width: 20,
    zIndex: 1,
  },
});
