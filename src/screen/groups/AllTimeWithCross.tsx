//external imports
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
//internal imports
import {colors} from '../../constants/ColorConstant';

const AllTimeWithCross = ({
  handleChecked,
  items,
}: {
  handleChecked: Function;
  items: any;
}) => {
  return (
    <View style={styles.timeContainer}>
      <View style={styles.interestsTab}>
        <Text style={styles.timeText}>{items}</Text>

        {/* cross section */}
        <TouchableOpacity
          style={styles.crossContainer}
          onPress={() => {
            handleChecked(items);
          }}>
          <Image
            style={styles.imageStyle}
            resizeMode="contain"
            source={require('../../assets/pngImage/cross.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AllTimeWithCross;
const styles = StyleSheet.create({
  timeContainer: {
    borderRadius: 38,
    margin: 3,
    width: 105,
  },
  interestsTab: {
    alignItems: 'center',
    backgroundColor: colors.GRAY,
    borderColor: colors.THEME_ORANGE,
    borderRadius: 38,
    borderWidth: 2,
    flexDirection: 'row',
    height: 32,
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    width: 105,
  },
  timeText: {
    color: colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  crossContainer: {
    backgroundColor: colors.THEME_ORANGE,
    borderRadius: 50,
    height: 25,
    width: 25,
    zIndex: 1,
  },
  imageStyle: {
    borderRadius: 10,
    height: '100%',
    width: '100%',
  },
});
