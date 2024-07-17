//external imports
import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
//internal imports
import {colors} from '../../constants/ColorConstant';

const NoData = () => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <View style={styles.imageContainer}>
          <Image
            resizeMode="contain"
            source={require('../../assets/pngImage/nodata.png')}
            style={styles.image}
          />
        </View>

        <Text style={styles.noDataText}>No Data Found</Text>
        <Text style={styles.noDataSubText}>We Will Provide This Soon</Text>
      </View>
    </View>
  );
};

export default NoData;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BLACK,
    flex: 1,
    padding: 10,
  },
  box: {
    alignItems: 'center',
    backgroundColor: colors.BLACK2,
    borderRadius: 10,
    height: 260,
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    height: 180,
    width: 200,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  noDataText: {
    color: colors.WHITE,
    fontSize: 22,
    fontWeight: '500',
  },
  noDataSubText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: '500',
  },
});
